import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  return user;
}

export async function getUserRole(clerkUserId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { role: true },
    });
    return user?.role || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

export async function getCurrentUserRole(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  return await getUserRole(userId);
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function requireRole(requiredRole: string) {
  const userId = await requireAuth();
  const role = await getUserRole(userId);
  
  if (role !== requiredRole) {
    throw new Error("Forbidden: Insufficient permissions");
  }
  
  return { userId, role };
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}

export async function checkRoleAccess(clerkUserId: string, requiredRole: string): Promise<boolean> {
  const role = await getUserRole(clerkUserId);
  return role === requiredRole;
}

export async function checkRoleAccessMultiple(clerkUserId: string, allowedRoles: string[]): Promise<boolean> {
  const role = await getUserRole(clerkUserId);
  return role ? allowedRoles.includes(role) : false;
}

// 학교 이메일 도메인 확인
export async function isSchoolEmail(): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) {
      console.log("[isSchoolEmail] No user found");
      return false;
    }

    const emailAddresses = user.emailAddresses || [];
    const schoolEmailDomains = process.env.SCHOOL_EMAIL_DOMAINS?.split(",").map(d => d.trim()) || [];

    console.log("[isSchoolEmail] Email addresses:", emailAddresses.map(e => e.emailAddress));
    console.log("[isSchoolEmail] School domains:", schoolEmailDomains);

    if (schoolEmailDomains.length === 0) {
      // 환경 변수가 설정되지 않았으면 모든 로그인 사용자 허용 (개발 편의)
      console.log("[isSchoolEmail] No school domains configured, allowing access");
      return true;
    }

    const hasSchoolEmail = emailAddresses.some((email) => {
      const domain = email.emailAddress.split("@")[1];
      const matches = schoolEmailDomains.some((schoolDomain) => domain === schoolDomain);
      console.log("[isSchoolEmail] Checking domain:", domain, "matches:", matches);
      return matches;
    });

    return hasSchoolEmail;
  } catch (error) {
    console.error("Error checking school email:", error);
    return false;
  }
}

// STUDENT role 또는 학교 이메일이면 접근 허용 (VISITOR는 제외)
export async function requireStudentOrSchoolEmail() {
  const userId = await requireAuth();
  const role = await getUserRole(userId);
  
  console.log("[requireStudentOrSchoolEmail] User ID:", userId, "Role:", role);
  
  // VISITOR는 접근 불가
  if (role === "VISITOR") {
    console.log("[requireStudentOrSchoolEmail] Access denied: VISITOR role");
    throw new Error("Forbidden: VISITOR role cannot access Student Community");
  }
  
  // STUDENT role이면 허용
  if (role === "STUDENT") {
    console.log("[requireStudentOrSchoolEmail] Access granted via role");
    return { userId, role, accessType: "role" };
  }
  
  // 학교 이메일이면 허용
  const hasSchoolEmail = await isSchoolEmail();
  if (hasSchoolEmail) {
    console.log("[requireStudentOrSchoolEmail] Access granted via email");
    return { userId, role, accessType: "email" };
  }
  
  console.log("[requireStudentOrSchoolEmail] Access denied");
  throw new Error("Forbidden: Student role or school email required");
}

