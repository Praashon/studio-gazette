export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          color?: string;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          image_url: string | null;
          source_name: string;
          source_url: string;
          author: string | null;
          category_id: string | null;
          published_at: string;
          fetched_at: string;
          is_featured: boolean;
          is_breaking: boolean;
          read_time_minutes: number;
          guid: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          image_url?: string | null;
          source_name: string;
          source_url: string;
          author?: string | null;
          category_id?: string | null;
          published_at: string;
          fetched_at?: string;
          is_featured?: boolean;
          is_breaking?: boolean;
          read_time_minutes?: number;
          guid?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          image_url?: string | null;
          source_name?: string;
          source_url?: string;
          author?: string | null;
          category_id?: string | null;
          published_at?: string;
          fetched_at?: string;
          is_featured?: boolean;
          is_breaking?: boolean;
          read_time_minutes?: number;
          guid?: string | null;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          article_id: string;
          session_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          session_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          session_id?: string;
          created_at?: string;
        };
      };
      rss_sources: {
        Row: {
          id: string;
          name: string;
          feed_url: string;
          category_id: string | null;
          is_active: boolean;
          last_fetched_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          feed_url: string;
          category_id?: string | null;
          is_active?: boolean;
          last_fetched_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          feed_url?: string;
          category_id?: string | null;
          is_active?: boolean;
          last_fetched_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Convenience types
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type RssSource = Database["public"]["Tables"]["rss_sources"]["Row"];

export type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
