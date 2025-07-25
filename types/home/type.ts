export interface Author {
  name: string;
  avatar_url: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  status: string;
  author: Author;
  article_tags: { tag: Tag }[];
  category: Category;
}

export interface Stat {
  id?: number; // Agregamos id opcional
  value: string;
  label: string;
  display_order?: number; // Agregamos orden opcional
}

export interface FloatAnimation {
  y: number[];
  rotate: number[];
  transition: {
    duration: number;
    repeat: number;
    ease: string;
  };
}