"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogOut, ShieldAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminIndicator() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // If we are already inside the /admin section, don't show the floating indicator
  const isInsideAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAdmin(true);
        resetTimer();
      } else {
        setIsAdmin(false);
      }
    };
    checkAuth();

    // 20 Minute Inactivity Auto-Logout
    const handleLogout = async () => {
      await supabase.auth.signOut();
      setIsAdmin(false);
      router.push("/login?message=Güvenlik nedeniyle oturumunuz kapatıldı.");
      router.refresh();
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // 20 minutes = 20 * 60 * 1000 = 1200000 ms
      timeoutId = setTimeout(handleLogout, 1200000);
    };

    // Listen to user activity
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    const activityListener = () => {
      if (isAdmin) resetTimer();
    };

    events.forEach((event) => window.addEventListener(event, activityListener));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, activityListener));
    };
  }, [pathname, isAdmin, router, supabase.auth]);

  if (!isAdmin || isInsideAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      <button 
        onClick={() => router.push("/admin")}
        className="bg-blue-600 text-white shadow-2xl rounded-full px-5 py-3 flex items-center gap-3 font-bold hover:scale-105 hover:bg-blue-700 transition"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
        Yönetim Paneli Açık
      </button>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          setIsAdmin(false);
          router.refresh();
        }}
        className="bg-red-50 text-red-600 border border-red-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold hover:bg-red-100 hover:scale-105 transition"
      >
        <LogOut size={16} /> Hemen Çıkış Yap
      </button>
    </div>
  );
}
