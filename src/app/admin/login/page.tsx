"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Giriş başarısız. Lütfen e-posta veya şifrenizi kontrol edin.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 bg-gray-50">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tighter mb-2">MOBAR</h1>
          <p className="text-gray-500">Yönetici Girişi</p>
        </div>
        
        {error && (
           <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
             {error}
           </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@posta.com" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400 mt-8">
          Bu alan sadece site yöneticilerine aittir.
        </p>
      </div>
    </div>
  );
}
