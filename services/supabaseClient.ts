import { createClient } from '@supabase/supabase-js';
import { SupabaseClip } from '../types';

// Define a minimal structure for the 'clips' table for type safety
export interface Database {
  public: {
    Tables: {
      clips: {
        Row: SupabaseClip;
        Insert: Omit<SupabaseClip, 'id' | 'created_at'>;
        Update: Partial<SupabaseClip>;
      };
    };
  };
}

const supabaseUrl = 'https://dgbrdmccaxgsknluxcre.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnYnJkbWNjYXhnc2tubHV4Y3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzg0OTAsImV4cCI6MjA3Mjg1NDQ5MH0.k7gU0a67nWOApF7DdDSH_x2Ihsy64M8ZRbby7qnrc2U';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
