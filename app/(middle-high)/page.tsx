import MiddleHighAboutContent from "@/components/about/MiddleHighAboutContent";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";

export default function Home() {
  return (
    <MiddleHighHeroLayout active="about">
      <MiddleHighAboutContent />
    </MiddleHighHeroLayout>
  );
}

