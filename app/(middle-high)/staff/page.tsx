import { redirect } from "next/navigation";

export const metadata = {
  title: "Redirecting | School Web Platform",
  description: "Redirecting to matriculation page",
};

export default function StaffPage() {
  redirect("/matriculation");
}

