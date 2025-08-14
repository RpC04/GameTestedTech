export interface Article {
    id: number
    title: string
    slug: string
    content: string
    excerpt: string
    featured_image: string
    status: 'draft' | 'published' | 'archived'
    category_id: number | null
    tags: string[]
    author_id: number | null
    meta_title: string
    meta_description: string
    views: number
    created_at: string
    updated_at: string
}

export type ArticleForm = Omit<Article, "id" | "views" | "created_at" | "updated_at">
export type ArticleFormWithTags = ArticleForm & {
    id?: number; //If dont want to update inmediatly the image of the article, this field is not required, just comment the line or remove it 1/2
    article_tags?: { 
        tag_id: number 
    }[]
}


export interface Author {
    id: number
    name: string
    email: string | null
    avatar_url: string | null
    bio: string | null
    created_at: string
    updated_at: string
}

export interface HomeJsonLdProps {
    articles: {
        title: string
        description: string
        date: string
        author: string
    }[]
}

export interface HorizontalArticleCardProps {
    article: any
    reverse?: boolean
    className?: string
}

export interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export interface RelatedArticle {
    id: any
    title: any
    slug: any
    excerpt: any
    featured_image: any
    category_id: any
    author_id: any
    created_at: any
}

export interface Category {
    id: number
    name: string
    slug: string
    description: string | null
    icon: string | null
    created_at: string
    updated_at: string
}

export interface Tag {
    id: number
    name: string
    slug: string
    created_at: string
    updated_at: string
}

export interface Comment {
    id: number
    article_id: number
    author_name: string | null
    author_email: string | null
    content: string
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
}
