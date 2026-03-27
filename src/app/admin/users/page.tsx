"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, Calendar } from "lucide-react";

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      // Not: Supabase Auth users tablosuna direkt erişilemez. 
      // Genelde 'profiles' veya 'users' isimli bir public tablo kullanılır.
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setUsers(data);
      } else if (error) {
        console.error("Profil çekme hatası:", error.message);
      }
      setLoading(false);
    }
    fetchUsers();
  }, [supabase]);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Müşteriler Yükleniyor...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Müşteriler & Üyeler</h2>
        <p className="text-gray-500 mt-2">Sisteme kayıtlı kurumsal ve bireysel kullanıcıların hesapları.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Müşteri / Firma</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">E-Posta</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Kayıt Tarihi</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="font-bold text-gray-900">{user.full_name || "İsimsiz Kullanıcı"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                    <Mail size={14} />
                    {user.email || "E-posta yok"}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm font-medium">
                    <Calendar size={14} />
                    {new Date(user.created_at).toLocaleDateString("tr-TR")}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-xs border border-emerald-100">Aktif</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="py-20 text-center text-gray-500 font-medium bg-white">
            Henüz kayıtlı müşteri bulunmuyor veya `profiles` tablosu boş.
          </div>
        )}
      </div>
    </div>
  );
}
