"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (!error) fetchOrders();
    else alert("Durum güncellenemedi: " + error.message);
  };

  const statusBadge = (status: string) => {
    switch(status) {
      case "Bekliyor": return "bg-orange-100 text-orange-700";
      case "Hazırlanıyor": return "bg-blue-100 text-blue-700";
      case "Kargolandı": return "bg-purple-100 text-purple-700";
      case "Tamamlandı": return "bg-emerald-100 text-emerald-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const statCards = [
    { label: "Bekleyen", count: orders.filter(o => o.status === 'Bekliyor').length, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Hazırlanan", count: orders.filter(o => o.status === 'Hazırlanıyor').length, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Kargolanan", count: orders.filter(o => o.status === 'Kargolandı').length, icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Tamamlanan", count: orders.filter(o => o.status === 'Tamamlandı').length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Siparişler</h2>
        <p className="text-gray-500 text-sm mt-1">Müşterilerden gelen tüm siparişleri buradan yönetin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{s.label}</div>
                <div className="text-2xl font-bold text-gray-900">{s.count}</div>
              </div>
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <Icon size={20} className={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Sipariş / Tarih</th>
                <th className="px-6 py-3 font-semibold">Müşteri</th>
                <th className="px-6 py-3 font-semibold">Ürünler</th>
                <th className="px-6 py-3 font-semibold">Tutar</th>
                <th className="px-6 py-3 font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-sm">Yükleniyor...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-sm">Henüz sipariş bulunmuyor.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm">#{order.id}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleString('tr-TR')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800">{order.customer_name}</div>
                      <div className="text-xs text-gray-400">{order.customer_email}</div>
                      <div className="text-xs text-gray-400">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="mb-0.5">
                            <span className="font-semibold text-blue-600">{item.quantity}x</span> {item.title}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">₺{order.total_price?.toLocaleString('tr-TR')}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border outline-none cursor-pointer ${statusBadge(order.status)} bg-white`}
                      >
                        <option value="Bekliyor">🟠 Bekliyor</option>
                        <option value="Hazırlanıyor">🔵 Hazırlanıyor</option>
                        <option value="Kargolandı">🟣 Kargolandı</option>
                        <option value="Tamamlandı">🟢 Tamamlandı</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
