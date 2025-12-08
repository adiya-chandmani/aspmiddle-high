import { requireStudentOrSchoolEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import SuggestionClient from "./SuggestionClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Suggestion | Student Community",
  description: "Suggestion board for students",
};

export default async function SuggestionPage() {
  // STUDENT role 또는 학교 이메일이면 접근 가능
  try {
    await requireStudentOrSchoolEmail();
  } catch (error) {
    redirect("/community");
  }

  return <SuggestionClient />;
}

