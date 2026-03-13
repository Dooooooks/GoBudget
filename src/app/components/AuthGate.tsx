import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { AuthUser } from "../auth";
import { supabase } from "../supabaseClient";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(data.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
