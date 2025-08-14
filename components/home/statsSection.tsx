// components/home/StatsSection.tsx
"use client";

import { motion } from "framer-motion";
import { useHomeStats } from "@/hooks/useHomeStats";
import { container, item } from "@/constants/home/animations";

export const StatsSection = () => {
  const { stats, loading, error } = useHomeStats();

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-500">Error loading stats: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] py-12 border-t border-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          variants={container}
        >
          {stats.map((stat, i) => (
            <motion.div key={stat.id} className="p-6" variants={item}>
              <p className={
                "text-3xl md:text-4xl font-bold " +
                (i === 0
                  ? "text-white"
                  : i === 2
                    ? "text-[#ff6b35]"
                    : "text-game-cyan")
              }>
                {stat.value}
              </p>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};