import { requireStudentOrSchoolEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentCommunityClient from "./StudentCommunityClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Student Community | School Web Platform",
  description: "Student Community - Free board, consultation, study information sharing",
};

export default async function StudentCommunityPage() {
  // STUDENT role 또는 학교 이메일이면 접근 가능
  try {
    await requireStudentOrSchoolEmail();
  } catch (error) {
    redirect("/community");
  }

  return <StudentCommunityClient />;
}
