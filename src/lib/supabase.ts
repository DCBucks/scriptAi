import { createClient } from "@supabase/supabase-js";

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client only if environment variables are present
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null;
};

// Database types (we'll update these after creating our schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_user_id: string;
          email: string;
          name: string | null;
          subscription_status: "active" | "cancelled" | "expired" | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_ends_at: string | null;
          transcription_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          email: string;
          name?: string | null;
          subscription_status?: "active" | "cancelled" | "expired" | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
          transcription_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          email?: string;
          name?: string | null;
          subscription_status?: "active" | "cancelled" | "expired" | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
          transcription_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      audio_files: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          file_size: number;
          duration: string;
          upload_url: string | null;
          transcript: string | null;
          processing_status: "pending" | "processing" | "completed" | "error";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          filename: string;
          file_size: number;
          duration: string;
          upload_url?: string | null;
          transcript?: string | null;
          processing_status?: "pending" | "processing" | "completed" | "error";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          filename?: string;
          file_size?: number;
          duration?: string;
          upload_url?: string | null;
          transcript?: string | null;
          processing_status?: "pending" | "processing" | "completed" | "error";
          created_at?: string;
          updated_at?: string;
        };
      };
      summaries: {
        Row: {
          id: string;
          audio_file_id: string;
          main_summary: string;
          bullet_points: string[];
          key_topics: string[];
          action_items: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          audio_file_id: string;
          main_summary: string;
          bullet_points: string[];
          key_topics: string[];
          action_items: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          audio_file_id?: string;
          main_summary?: string;
          bullet_points?: string[];
          key_topics?: string[];
          action_items?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          audio_file_id: string;
          type: "user" | "ai";
          content: string;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          audio_file_id: string;
          type: "user" | "ai";
          content: string;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          audio_file_id?: string;
          type?: "user" | "ai";
          content?: string;
          timestamp?: string;
          created_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          invited_by: string | null;
          invited_at: string;
          joined_at: string | null;
          status: "pending" | "active" | "inactive";
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member";
          invited_by?: string | null;
          invited_at?: string;
          joined_at?: string | null;
          status?: "pending" | "active" | "inactive";
          created_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          role?: "owner" | "admin" | "member";
          invited_by?: string | null;
          invited_at?: string;
          joined_at?: string | null;
          status?: "pending" | "active" | "inactive";
          created_at?: string;
        };
      };
    };
  };
}
