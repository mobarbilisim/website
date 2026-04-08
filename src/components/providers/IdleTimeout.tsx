"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function IdleTimeout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

  // Logout function
  const handleLogout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Only logout if there is an active session
    if (session) {
      await supabase.auth.signOut();
      toast.error("Uzun süre işlem yapmadığınız için güvenliğiniz gereği oturumunuz kapatıldı.");
      router.push("/giris");
      router.refresh();
    }
  };

  const resetTimeout = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(handleLogout, TIMEOUT_MS);
  };

  useEffect(() => {
    // Check if session exists on mount
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      // Only attach listeners if user is signed in
      if (session) {
        resetTimeout();

        const events = ["mousemove", "keydown", "wheel", "touchstart", "click"];
        
        const attachListeners = () => {
          events.forEach((event) => window.addEventListener(event, resetTimeout));
        };

        const removeListeners = () => {
          events.forEach((event) => window.removeEventListener(event, resetTimeout));
        };

        attachListeners();

        // Cleanup
        return () => {
          removeListeners();
          if (timeoutId.current) clearTimeout(timeoutId.current);
        };
      }
    });
  }, []);

  return <>{children}</>;
}
