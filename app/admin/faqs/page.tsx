import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import FAQManager from "@/components/admin/FAQManager";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "FAQ Management | Admin",
  description: "Manage frequently asked questions",
};

export default async function AdminFAQsPage() {
  try {
    await requireAuth();
  } catch (error) {
    redirect("/sign-in");
  }

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const role = await getUserRole(userId);
  if (role !== "ADMIN") {
    redirect("/admin");
  }

  // Fetch all FAQs for admin view
  const faqs = await prisma.fAQ.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });

  // Serialize dates to strings
  const serializedFAQs = faqs.map((faq) => ({
    ...faq,
    createdAt: faq.createdAt.toISOString(),
    updatedAt: faq.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">FAQ Management</h2>
        <p className="text-gray-600 dark:text-gray-400">Create and manage frequently asked questions.</p>
      </div>
      <FAQManager initialFAQs={serializedFAQs} />
    </div>
  );
}

