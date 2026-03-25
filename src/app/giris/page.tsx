"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function CustomerLoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw new Error("E-posta adresiniz veya şifreniz yanlış.");
      }

      // Check if admin
      if (data.user?.email === "mobarbilisim@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/");
        router.refresh(); // to update header immediately
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // İlerde Supabase ayarlarından email onayı açık olursa, o mesajı vermeliyiz.
    // Kapattığımız için direkt giriş yapar.
    try {
      const { data, error: registerError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (registerError) {
        if (registerError.message.includes("already registered")) {
            throw new Error("Bu e-posta adresi zaten kullanımda.");
        }
        throw new Error(registerError.message);
      }

      setSuccess("Hesabınız başarıyla oluşturuldu! Yönlendiriliyorsunuz...");
      
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 bg-gray-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-extrabold text-blue-600 tracking-tighter mb-2 cursor-pointer">MOBAR</h1>
          </Link>
          <p className="text-gray-500">Hesabınıza giriş yapın veya üye olun</p>
        </div>

        {/* Tab */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-8">
          <button
            onClick={() => { setTab("login"); setError(null); setSuccess(null); }}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${tab === "login" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => { setTab("register"); setError(null); setSuccess(null); }}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${tab === "register" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
          >
            Üye Ol
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm font-medium p-3 rounded-lg border border-red-100 mb-6 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 text-sm font-medium p-3 rounded-lg border border-green-100 mb-6 text-center">
            {success}
          </div>
        )}

        {tab === "login" ? (
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@posta.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Giriş Yap
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız Soyadınız" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@posta.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Üye Ol
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Üye olarak <Link href="/mesafeli-satis" className="underline hover:text-blue-600">Mesafeli Satış Sözleşmesi&apos;ni</Link> kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
}
