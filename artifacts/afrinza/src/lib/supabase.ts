import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[Afrinza] Supabase is not configured.\n" +
      "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.\n" +
      "See .env.example for the required format."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Quick connection test — call this from browser console to verify your
 * Supabase credentials are working:
 *
 *   import { testSupabaseConnection } from "@/lib/supabase";
 *   testSupabaseConnection();
 */
export async function testSupabaseConnection(): Promise<void> {
  try {
    const { error } = await supabase.from("_test_ping").select("*").limit(1);
    if (error && error.code !== "42P01") {
      // 42P01 = relation does not exist — that's fine, connection works
      console.error("[Supabase] Connection error:", error.message);
    } else {
      console.log("[Supabase] ✅ Connection successful — credentials are valid.");
    }
  } catch (err) {
    console.error("[Supabase] ❌ Connection failed:", err);
  }
}
