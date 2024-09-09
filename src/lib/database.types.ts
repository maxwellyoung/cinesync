export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      movies: {
        Row: {
          director: string | null;
          id: number;
          overview: string | null;
          poster_path: string | null;
          rating: number | null;
          title: string | null;
          user_id: string | null;
          year: number | null;
        };
        Insert: {
          director?: string | null;
          id?: never;
          overview?: string | null;
          poster_path?: string | null;
          rating?: number | null;
          title?: string | null;
          user_id?: string | null;
          year?: number | null;
        };
        Update: {
          director?: string | null;
          id?: never;
          overview?: string | null;
          poster_path?: string | null;
          rating?: number | null;
          title?: string | null;
          user_id?: string | null;
          year?: number | null;
        };
        Relationships: [];
      };
      watchlist: {
        Row: {
          created_at: string | null;
          director: string;
          id: number;
          overview: string;
          poster_path: string | null;
          rating: number;
          title: string;
          user_id: string;
          year: number;
        };
        Insert: {
          created_at?: string | null;
          director: string;
          id?: number;
          overview: string;
          poster_path?: string | null;
          rating: number;
          title: string;
          user_id: string;
          year: number;
        };
        Update: {
          created_at?: string | null;
          director?: string;
          id?: number;
          overview?: string;
          poster_path?: string | null;
          rating?: number;
          title?: string;
          user_id?: string;
          year?: number;
        };
        Relationships: [];
      };
      prompt_suggestions: {
        Row: {
          id: number;
          suggestion: string;
        };
        Insert: {
          id?: number;
          suggestion: string;
        };
        Update: {
          id?: number;
          suggestion?: string;
        };
      };
      friends: {
        Row: {
          id: number;
          user_id: string;
          friend_id: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          friend_id: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          friend_id?: string;
        };
      };
      friend_requests: {
        Row: {
          id: number;
          user_id: string;
          friend_id: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          friend_id: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          friend_id?: string;
        };
      };
      genres: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
      };
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
