"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "mobar_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage erişim hatası (SSR guard)
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  };

  const reject = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez Politikası"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/10 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* İkon + Metin */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0 mt-0.5">🍪</span>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Çerezler &amp; Kişisel Veriler
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Sitemizi geliştirmek, güvenli bir alışveriş deneyimi sunmak ve{" "}
                <strong className="text-gray-700">6698 sayılı KVKK</strong> kapsamında
                verilerinizi işlemek için zorunlu ve analitik çerezler kullanıyoruz.
                Detaylar için{" "}
                <Link
                  href="/kvkk"
                  className="text-blue-600 underline hover:text-blue-700 transition-colors"
                >
                  KVKK Aydınlatma Metni
                </Link>
                &#39;ni inceleyebilirsiniz.
              </p>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={reject}
              className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Reddet
            </button>
            <button
              onClick={accept}
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              Tümünü Kabul Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
