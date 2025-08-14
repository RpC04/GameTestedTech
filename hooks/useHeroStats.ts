import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Stat } from "@/types/home/type";

export const useHeroStats = () => {
  const [heroStats, setHeroStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeroStats() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("hero_stats")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;
        setHeroStats(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchHeroStats();
  }, []);

  return { heroStats, loading, error };
};