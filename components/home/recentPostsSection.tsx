"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArticleCard } from "@/components/articles/article-card";
import { HorizontalArticleCard } from "@/components/articles/horizontal-article-card";
import { Article } from "@/types/article";

interface RecentPostsSectionProps {
  articles: Article[];
  activeTab: string;
}

export const RecentPostsSection = ({ articles, activeTab }: RecentPostsSectionProps) => {
  return (
    <motion.section className="py-12 bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-1">
          <div className="lg:col-span-3">
            <motion.div
              className="flex mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div
                className={`py-3 px-5 font-medium text-2xl transition-colors ${
                  activeTab === "recent" ? "text-game-cyan" : "text-gray-400"
                }`}
              >
                Recent Posts
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {activeTab === "recent" && (
                <motion.div
                  key="recent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-10">
                    {/* First 4 articles in 2x2 grid */}
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <ArticleCard article={articles[0]} />
                      <ArticleCard article={articles[1]} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <ArticleCard article={articles[2]} />
                      <ArticleCard article={articles[3]} />
                    </div>

                    {/* Info blocks */}
                    <InfoBlocks />

                    {/* Last 2 articles horizontal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <HorizontalArticleCard article={articles[4]} reverse={false} />
                      <HorizontalArticleCard article={articles[5]} reverse={true} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// Componente interno para los bloques informativos
const InfoBlocks = () => {
  const blocks = [
    {
      image: "/images/unsplash.png",
      title: "Honest Reviews: Opinions You Can Trust",
      description: "At Game Tested Tech, we provide truthful reviews to empower you with the knowledge needed to make informed decisions about gaming hardware and peripherals...",
      reverse: false,
      delay: 0.1
    },
    {
      image: "/images/unsplash.png", 
      title: "Unlock True Gaming Potential: Expert Guides",
      description: "Game Tested Tech strives to provide diverse, helpful information to empower gamers of all levels...",
      reverse: true,
      delay: 0.25
    },
    {
      image: "/images/unsplash.png",
      title: "The Game Tested Way: Our Methodology", 
      description: "Benchmarking products requires meticulous care, time, and unwavering honesty...",
      reverse: false,
      delay: 0.4
    }
  ];

  return (
    <div className="space-y-12">
      {blocks.map((block, index) => (
        <motion.div
          key={index}
          className={`flex ${block.reverse ? 'flex-col-reverse md:flex-row' : 'flex-col md:flex-row'} items-center rounded-2xl shadow-lg p-6 gap-6`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: block.delay, type: "spring" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <img
            src={block.image}
            alt={block.title}
            className="w-full h-40 md:w-[360px] md:h-[240px] object-cover rounded-xl"
          />
          <div className={block.reverse ? "text-right w-full" : ""}>
            <h3 className="text-xl font-bold mb-2 text-white">
              {block.title}
            </h3>
            <p className="text-gray-300">
              {block.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};