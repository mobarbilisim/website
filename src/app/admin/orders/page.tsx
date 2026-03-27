"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Package, Clock, Truck, CheckCircle2, Search, XCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setOrders(data);
      setFilteredOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    const results = orders.filter(order => 
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (!error) fetchOrders();
    else alert("Durum güncellenemedi: " + error.message);
  };

  const statusBadge = (status: string) => {
    switch(status) {
      case "Bekliyor": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Hazırlanıyor": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Kargolandı": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Tamamlandı": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "İptal Edildi": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Siparişler</h2>
          <p className="text-gray-500 text-sm mt-1">Müşterilerden gelen tüm siparişleri buradan yönetin.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="İsim, e-posta veya ID ile ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full sm:w-64 text-sm"
          />
        </div>
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
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Sipariş / Tarih</th>
                <th className="px-6 py-4 font-semibold">Müşteri Detayları</th>
                <th className="px-6 py-4 font-semibold">Ürünler</th>
                <th className="px-6 py-4 font-semibold text-right">Toplam Tutar</th>
                <th className="px-6 py-4 font-semibold text-center">Durum Güncelleme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-400 text-sm">Veriler yükleniyor...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-400 text-sm">Eşleşen sipariş bulunamadı.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-gray-900 text-sm mb-1">#{order.id}</div>
                      <div className="text-[11px] text-gray-400 font-medium">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                        <br />
                        {new Date(order.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-bold text-gray-900 mb-1">{order.customer_name}</div>
                      <div className="flex flex-col gap-0.5">
                        <div className="text-xs text-gray-500 flex items-center gap-1.5 truncate max-w-[200px]" title={order.customer_email}>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {order.customer_email}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {order.customer_phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="space-y-1.5">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="text-[12px] bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center justify-between gap-3">
                            <span className="text-gray-700 truncate">{item.title}</span>
                            <span className="font-bold text-blue-600 flex-shrink-0">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="text-base font-black text-gray-900">
                        ₺{order.total_price?.toLocaleString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-center">
                      <div className="flex justify-center">
                        <select 
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border-2 outline-none cursor-pointer transition-all ${statusBadge(order.status)} hover:shadow-sm`}
                        >
                          <option value="Bekliyor">🟠 Bekliyor</option>
                          <option value="Hazırlanıyor">🔵 Hazırlanıyor</option>
                          <option value="Kargolandı">🟣 Kargolandı</option>
                          <option value="Tamamlandı">🟢 Tamamlandı</option>
                          <option value="İptal Edildi">🔴 İptal Edildi</option>
                        </select>
                      </div>
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
