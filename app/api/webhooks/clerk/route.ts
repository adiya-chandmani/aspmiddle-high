import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  // 헤더 가져오기
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // 본문 가져오기
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // webhook 검증
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // 이벤트 처리
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      // 사용자 생성 또는 업데이트
      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {
          email: email_addresses[0]?.email_address || null,
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
        },
        create: {
          clerkUserId: id,
          email: email_addresses[0]?.email_address || null,
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
          role: "STUDENT", // 기본값은 STUDENT
        },
      });
    } catch (error) {
      console.error("Error syncing user to database:", error);
      return new Response("Error syncing user", {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // 사용자 삭제
      await prisma.user.delete({
        where: { clerkUserId: id },
      });
    } catch (error) {
      console.error("Error deleting user from database:", error);
      return new Response("Error deleting user", {
        status: 500,
      });
    }
  }

  return new Response("", { status: 200 });
}

