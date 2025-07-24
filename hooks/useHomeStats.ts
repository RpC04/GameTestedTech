// hooks/useHomeStats.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Stat } from "@/types/home/index";

export const useHomeStats = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("home_stats")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStat = async (id: number, value: string, label: string) => {
    try {
      const { error } = await supabase
        .from("home_stats")
        .update({ value, label })
        .eq("id", id);

      if (error) throw error;
      
      // Actualizar el estado local
      setStats(prev => prev.map(stat => 
        stat.id === id ? { ...stat, value, label } : stat
      ));
      
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

  return { stats, loading, error, updateStat, refetch: fetchStats };
};