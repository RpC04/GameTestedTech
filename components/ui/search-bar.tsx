"use client";
import { useState, useEffect, useRef } from "react";
import { Search, FileText, Hash, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type SearchResult =
  | { type: 'article'; id: any; title: any; slug: any; excerpt: any; created_at: any }
  | { type: 'category'; id: any; name: any; slug: any };

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchContent = async (searchTerm: string) => {
    if (!searchTerm.trim()) return [];
    
    setLoading(true);
    
    try {
      // Buscar en artículos
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, created_at')
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
        .limit(5);

      // Buscar en categorías
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug')
        .ilike('name', `%${searchTerm}%`)
        .limit(3);

      return [
        ...(articles || []).map(item => ({ ...item, type: "article" as const })),
        ...(categories || []).map(item => ({ ...item, type: "category" as const }))
      ];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length >= 2) {
        const searchResults = await searchContent(query);
        setResults(searchResults);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Cerrar cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-xl mx-4 md:mx-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-full py-2 px-4 pr-10 text-white text-sm focus:border-[#ff6b35] focus:outline-none transition-all"
        placeholder="Search..."
      />
      <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f23] border border-gray-700 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400 flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#ff6b35] border-t-transparent rounded-full"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={
                    result.type === 'article' 
                      ? `/blog/${result.slug}` // 👈 Cambiado de /articles/ a /blog/
                      : `/articles?category=${result.slug}`
                  }
                  className="block p-3 hover:bg-[#1a1a1a] rounded-lg cursor-pointer group transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  <div className="flex items-start gap-3">
                    {result.type === 'article' ? (
                      <FileText className="w-4 h-4 text-[#ff6b35] mt-1 flex-shrink-0" />
                    ) : (
                      <Hash className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium group-hover:text-[#ff6b35] transition-colors truncate">
                        {result.type === 'article' ? result.title : result.name}
                      </div>
                      {result.type === 'article' && result.excerpt && (
                        <div className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {result.excerpt}
                        </div>
                      )}
                      {result.type === 'article' && result.created_at && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(result.created_at).toLocaleDateString()}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        {result.type === 'article' ? 'Article' : 'Category'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-400">
              <div className="text-lg mb-2">🔍</div>
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}