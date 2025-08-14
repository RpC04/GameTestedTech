"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { HeroSection } from "@/components/home/heroSection";
import { RecentPostsSection } from "@/components/home/recentPostsSection";
import { StatsSection } from "@/components/home/statsSection";
import { useLatestArticles } from "@/hooks/useArticles";
import { useAnimations } from "@/hooks/useAnimations";

export default function Home() {
  const [activeTab] = useState("recent");
  const { latestArticles, loading, error } = useLatestArticles(6);
  const { isLoaded, isHovering, setIsHovering } = useAnimations();

  if (loading) {
    return <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center">
      <div className="text-red-500">Error: {error}</div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f23]">
      <div className="relative">
        <Header />
        <HeroSection 
          isLoaded={isLoaded}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
        />
      </div>
      
      <RecentPostsSection 
        articles={latestArticles}
        activeTab={activeTab}
      />
      
      <StatsSection />
      
      <Footer />
    </div>
  );
}