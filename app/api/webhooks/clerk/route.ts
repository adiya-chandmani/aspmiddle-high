import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// Force dynamic rendering (webhooks must be dynamic)
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  console.log("[Webhook] ========== Webhook Request Received ==========");
  console.log("[Webhook] Timestamp:", new Date().toISOString());
  console.log("[Webhook] WEBHOOK_SECRET exists:", !!WEBHOOK_SECRET);

  if (!WEBHOOK_SECRET) {
    console.error("[Webhook] ERROR: CLERK_WEBHOOK_SECRET is not set");
    return new Response(
      JSON.stringify({ error: "CLERK_WEBHOOK_SECRET is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // 헤더 가져오기
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    console.log("[Webhook] Headers received:", {
      svix_id: !!svix_id,
      svix_timestamp: !!svix_timestamp,
      svix_signature: !!svix_signature,
      svix_id_value: svix_id?.substring(0, 20) + "...",
    });

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("[Webhook] ERROR: Missing svix headers", {
        svix_id: !!svix_id,
        svix_timestamp: !!svix_timestamp,
        svix_signature: !!svix_signature,
      });
      return new Response(
        JSON.stringify({ error: "Missing svix headers" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 본문 가져오기
    let payload: any;
    let body: string;
    
    try {
      payload = await req.json();
      body = JSON.stringify(payload);
      console.log("[Webhook] Payload received, event type:", payload?.type || "unknown");
    } catch (parseError) {
      console.error("[Webhook] ERROR: Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // webhook 검증
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
      console.log("[Webhook] ✅ Webhook verified successfully");
    } catch (err: any) {
      console.error("[Webhook] ❌ Error verifying webhook:", {
        error: err.message,
        name: err.name,
        stack: err.stack,
      });
      return new Response(
        JSON.stringify({ 
          error: "Webhook verification failed",
          details: err.message 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 이벤트 처리
    const eventType = evt.type;
    console.log("[Webhook] Processing event type:", eventType);
    
    // 타입 안전한 로깅
    if (eventType === "user.created" || eventType === "user.updated") {
      const userData = evt.data as { id: string; email_addresses?: Array<{ email_address?: string }>; first_name?: string; last_name?: string };
      console.log("[Webhook] Event data:", {
        id: userData.id,
        email: userData.email_addresses?.[0]?.email_address,
      });
    } else if (eventType === "user.deleted") {
      const deletedData = evt.data as { id: string };
      console.log("[Webhook] Event data:", {
        id: deletedData.id,
      });
    } else {
      console.log("[Webhook] Event data:", {
        id: (evt.data as any)?.id,
      });
    }

    if (eventType === "user.created" || eventType === "user.updated") {
      const userData = evt.data as { id: string; email_addresses?: Array<{ email_address?: string }>; first_name?: string; last_name?: string };
      const { id, email_addresses, first_name, last_name } = userData;
      console.log("[Webhook] Processing user:", { 
        id, 
        email: email_addresses?.[0]?.email_address,
        first_name,
        last_name,
      });

      try {
        // 이메일 도메인 확인하여 역할 결정
        const email = email_addresses?.[0]?.email_address || null;
        const schoolEmailDomains = process.env.SCHOOL_EMAIL_DOMAINS?.split(",").map(d => d.trim()) || [];
        
        console.log("[Webhook] School email domains:", schoolEmailDomains);
        
        // 학교 이메일 도메인을 가진 사용자는 STUDENT 역할 부여
        let defaultRole: "STUDENT" | "VISITOR" = "VISITOR";
        if (email) {
          const domain = email.split("@")[1];
          console.log("[Webhook] User email domain:", domain);
          if (schoolEmailDomains.includes(domain)) {
            defaultRole = "STUDENT";
            console.log("[Webhook] ✅ Assigning STUDENT role");
          } else {
            console.log("[Webhook] ✅ Assigning VISITOR role (domain not in school list)");
          }
        } else {
          console.log("[Webhook] ⚠️ No email found, assigning VISITOR role");
        }

        // 데이터베이스 연결 확인
        console.log("[Webhook] Attempting to connect to database...");
        console.log("[Webhook] DATABASE_URL exists:", !!process.env.DATABASE_URL);
        console.log("[Webhook] POSTGRES_URL exists:", !!process.env.POSTGRES_URL);

        // 사용자 생성 또는 업데이트
        const user = await prisma.user.upsert({
          where: { clerkUserId: id },
          update: {
            email: email || null,
            name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
            // 업데이트 시에는 역할을 변경하지 않음 (이미 설정된 역할 유지)
          },
          create: {
            clerkUserId: id,
            email: email || null,
            name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
            role: defaultRole, // 학교 이메일이면 STUDENT, 아니면 VISITOR
          },
        });

        console.log("[Webhook] ✅ User synced successfully:", { 
          id: user.id, 
          clerkUserId: user.clerkUserId,
          email: user.email,
          name: user.name,
          role: user.role,
        });
      } catch (error: any) {
        console.error("[Webhook] ❌ Error syncing user to database:", {
          error: error.message,
          name: error.name,
          code: error.code,
          meta: error.meta,
          stack: error.stack,
        });
        return new Response(
          JSON.stringify({ 
            error: "Error syncing user to database",
            details: error.message,
            code: error.code,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    } else if (eventType === "user.deleted") {
      const deletedData = evt.data as { id: string };
      const { id } = deletedData;
      console.log("[Webhook] Processing user deletion:", { id });

      try {
        // 사용자 삭제 (존재하지 않아도 에러 발생하지 않도록 deleteMany 사용)
        const result = await prisma.user.deleteMany({
          where: { clerkUserId: id },
        });
        
        if (result.count > 0) {
          console.log("[Webhook] ✅ User deleted successfully:", { id });
        } else {
          console.log("[Webhook] ⚠️ User not found in database (may have been already deleted):", { id });
          // 사용자가 이미 삭제되었거나 존재하지 않는 경우는 정상으로 처리
        }
      } catch (error: any) {
        // P2025 에러는 "레코드가 존재하지 않음"이므로 무시
        if (error.code === 'P2025') {
          console.log("[Webhook] ⚠️ User not found in database (may have been already deleted):", { id });
          // 정상으로 처리하고 계속 진행
        } else {
          console.error("[Webhook] ❌ Error deleting user from database:", {
            error: error.message,
            name: error.name,
            code: error.code,
          });
          return new Response(
            JSON.stringify({ 
              error: "Error deleting user",
              details: error.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    } else {
      console.log("[Webhook] ⚠️ Unhandled event type:", eventType);
    }

    console.log("[Webhook] ========== Webhook Processing Complete ==========");
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("[Webhook] ❌ Unexpected error:", {
      error: error.message,
      name: error.name,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({ 
        error: "Unexpected error processing webhook",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

