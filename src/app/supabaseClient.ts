import { createClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __GOBUDGET_CONFIG__?: {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
    };
  }
}

const runtimeConfig =
  typeof window !== "undefined" ? window.__GOBUDGET_CONFIG__ : undefined;

const supabaseUrl =
  runtimeConfig?.supabaseUrl ??
  (import.meta.env.VITE_SUPABASE_URL as string | undefined);

const supabaseAnonKey =
  runtimeConfig?.supabaseAnonKey ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
