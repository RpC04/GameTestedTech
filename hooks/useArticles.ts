import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Article } from "@/types/article";

export const useLatestArticles = (limit: number = 6) => {
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("articles")
          .select(`
            *,
            author:authors (
              name,
              avatar_url
            ), 
            article_tags (
              tag:tags ( id, name )
            ),
            category:categories ( id, name )
          `)
          .eq('status', 'published')
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        
        setLatestArticles(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [limit]);

  return { latestArticles, loading, error };
};