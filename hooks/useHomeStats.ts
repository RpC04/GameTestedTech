// hooks/useHomeStats.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Stat } from "@/types/home/index";

export const useHomeStats = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [heroStats, setHeroStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch home stats
      const { data: homeData, error: homeError } = await supabase
        .from("home_stats")
        .select("*")
        .order("display_order", { ascending: true });

      if (homeError) throw homeError;

      // Fetch hero stats
      const { data: heroData, error: heroError } = await supabase
        .from("hero_stats")
        .select("*")
        .order("display_order", { ascending: true });

      if (heroError) throw heroError;

      setStats(homeData || []);
      setHeroStats(heroData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStat = async (id: number, value: string, label: string, type: 'home' | 'hero' = 'home') => {
    try {
      const table = type === 'home' ? 'home_stats' : 'hero_stats';
      
      const { error } = await supabase
        .from(table)
        .update({ value, label })
        .eq("id", id);

      if (error) throw error;
      
      // Actualizar el estado local correspondiente
      if (type === 'home') {
        setStats(prev => prev.map(stat => 
          stat.id === id ? { ...stat, value, label } : stat
        ));
      } else {
        setHeroStats(prev => prev.map(stat => 
          stat.id === id ? { ...stat, value, label } : stat
        ));
      }
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An error occurred' 
      };
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, heroStats, loading, error, updateStat, refetch: fetchStats };
};