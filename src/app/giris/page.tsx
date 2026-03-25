"use client";

import { useState } from "react";
import Link from "next/link";

export default function CustomerLoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="flex-1 flex items-center justify-center py-20 bg-gray-50">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tighter mb-2">MOBAR</h1>
          <p className="text-gray-500">Hesabınıza giriş yapın veya üye olun</p>
        </div>

        {/* Tab */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-8">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${tab === "login" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${tab === "register" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
          >
            Üye Ol
          </button>
        </div>

        {tab === "login" ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta</label>
              <input type="email" placeholder="ornek@posta.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
              Giriş Yap
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad</label>
              <input type="text" placeholder="Adınız Soyadınız" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta</label>
              <input type="email" placeholder="ornek@posta.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre</label>
              <input type="password" placeholder="En az 8 karakter" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
              Üye Ol
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Üye olarak <Link href="/mesafeli-satis" className="underline hover:text-blue-600">Mesafeli Satış Sözleşmesi&apos;ni</Link> kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
}
