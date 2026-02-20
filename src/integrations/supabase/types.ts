export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_inquiries: {
        Row: {
          additional_notes: string | null
          conversation_history: Json
          conversation_summary: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          conversation_history?: Json
          conversation_summary?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          conversation_history?: Json
          conversation_summary?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      design_covers: {
        Row: {
          cover_image_url: string | null
          created_at: string
          design_examples: Json
          design_patterns: Json
          editorial_summary: string
          id: string
          meta_description: string | null
          meta_keywords: string[] | null
          og_image_url: string | null
          published_at: string | null
          reading_time_minutes: number | null
          slug: string
          status: string
          title: string
          trend_sources: Json | null
          updated_at: string
          week_of: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          design_examples?: Json
          design_patterns?: Json
          editorial_summary: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          og_image_url?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug: string
          status?: string
          title: string
          trend_sources?: Json | null
          updated_at?: string
          week_of: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          design_examples?: Json
          design_patterns?: Json
          editorial_summary?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          og_image_url?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug?: string
          status?: string
          title?: string
          trend_sources?: Json | null
          updated_at?: string
          week_of?: string
        }
        Relationships: []
      }
      design_generation_usage: {
        Row: {
          created_at: string
          generation_count: number
          id: string
          ip_address: string
          updated_at: string
          usage_date: string
        }
        Insert: {
          created_at?: string
          generation_count?: number
          id?: string
          ip_address: string
          updated_at?: string
          usage_date?: string
        }
        Update: {
          created_at?: string
          generation_count?: number
          id?: string
          ip_address?: string
          updated_at?: string
          usage_date?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          budget: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          postcode: string | null
          renovations: string[] | null
          state: string | null
          status: string | null
          suburb: string | null
          timeline: string | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone: string
          postcode?: string | null
          renovations?: string[] | null
          state?: string | null
          status?: string | null
          suburb?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          postcode?: string | null
          renovations?: string[] | null
          state?: string | null
          status?: string | null
          suburb?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          alt_text: string | null
          content: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          left_position: number
          parallax_speed: number
          ratio: string | null
          size: string | null
          top_position: number
          type: string
          updated_at: string
          width_percent: number | null
          z_index: number
        }
        Insert: {
          alt_text?: string | null
          content?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          left_position?: number
          parallax_speed?: number
          ratio?: string | null
          size?: string | null
          top_position?: number
          type: string
          updated_at?: string
          width_percent?: number | null
          z_index?: number
        }
        Update: {
          alt_text?: string | null
          content?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          left_position?: number
          parallax_speed?: number
          ratio?: string | null
          size?: string | null
          top_position?: number
          type?: string
          updated_at?: string
          width_percent?: number | null
          z_index?: number
        }
        Relationships: []
      }
      image_overrides: {
        Row: {
          created_at: string
          id: string
          original_path: string
          override_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          original_path: string
          override_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          original_path?: string
          override_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      image_search_cache: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          provider: string
          query: string
          results: Json
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          provider: string
          query: string
          results: Json
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          provider?: string
          query?: string
          results?: Json
        }
        Relationships: []
      }
      moodboards: {
        Row: {
          canvas_data: Json
          created_at: string
          id: string
          name: string
          session_id: string | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          canvas_data?: Json
          created_at?: string
          id?: string
          name?: string
          session_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          canvas_data?: Json
          created_at?: string
          id?: string
          name?: string
          session_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_featured: boolean | null
          project_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          project_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          challenge: string | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          is_published: boolean
          location: string | null
          name: string
          overview: string | null
          solution: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          category: string
          challenge?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          name: string
          overview?: string | null
          solution?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          category?: string
          challenge?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          name?: string
          overview?: string | null
          solution?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          client_hash: string
          created_at: string
          endpoint: string
          id: string
          request_count: number
          window_start: string
        }
        Insert: {
          client_hash: string
          created_at?: string
          endpoint: string
          id?: string
          request_count?: number
          window_start?: string
        }
        Update: {
          client_hash?: string
          created_at?: string
          endpoint?: string
          id?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      viewed_projects: {
        Row: {
          id: string
          ip_address: string
          project_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address: string
          project_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address?: string
          project_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      popup_responses: {
        Row: {
          id: string
          name: string
          phone: string
          source: string
          page_url: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          source?: string
          page_url?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          source?: string
          page_url?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      enforce_rate_limit: {
        Args: {
          p_client_hash: string
          p_endpoint: string
          p_limit: number
          p_window_seconds: number
        }
        Returns: Json
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
