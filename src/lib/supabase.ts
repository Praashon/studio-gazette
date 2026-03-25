import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (respects RLS with anon key)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (bypasses RLS for admin ops)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServiceClient(): SupabaseClient<any, "public", any> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
