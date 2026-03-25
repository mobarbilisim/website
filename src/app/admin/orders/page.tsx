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

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
      
    if (!error) {
      fetchOrders();
    } else {
      alert("Durum güncellenemedi: " + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Bekliyor": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Hazırlanıyor": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Kargolandı": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Tamamlandı": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Siparişler</h2>
        <p className="text-muted-foreground mt-2">Müşterilerden gelen tüm siparişler, kargo durumları ve işlemler.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Bekleyen</h3>
            <div className="text-3xl font-bold text-orange-400">{orders.filter(o => o.status === 'Bekliyor').length}</div>
          </div>
          <Clock className="w-10 h-10 text-orange-400/20" />
        </div>
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Hazırlanan</h3>
            <div className="text-3xl font-bold text-blue-400">{orders.filter(o => o.status === 'Hazırlanıyor').length}</div>
          </div>
          <Package className="w-10 h-10 text-blue-400/20" />
        </div>
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Kargolanan</h3>
            <div className="text-3xl font-bold text-purple-400">{orders.filter(o => o.status === 'Kargolandı').length}</div>
          </div>
          <Truck className="w-10 h-10 text-purple-400/20" />
        </div>
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Tamamlanan</h3>
            <div className="text-3xl font-bold text-emerald-400">{orders.filter(o => o.status === 'Tamamlandı').length}</div>
          </div>
          <CheckCircle2 className="w-10 h-10 text-emerald-400/20" />
        </div>
      </div>

      <div className="glass border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground text-sm bg-white/5">
                <th className="px-6 py-4 font-medium">Sipariş ID / Tarih</th>
                <th className="px-6 py-4 font-medium">Müşteri Detayı</th>
                <th className="px-6 py-4 font-medium">Sipariş Özeti</th>
                <th className="px-6 py-4 font-medium">Toplam Tutar</th>
                <th className="px-6 py-4 font-medium max-w-[150px]">Durum Güncelle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">Yükleniyor...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Henüz sipariş bulunmuyor.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">#{order.id}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleString('tr-TR')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                      <div className="text-xs text-muted-foreground mt-2 max-w-[200px] truncate" title={order.customer_address}>{order.customer_address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="mb-1">
                            <span className="font-bold text-blue-400">{item.quantity}x</span> {item.title}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground text-lg">
                      ₺{order.total_price?.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-xl outline-none font-medium appearance-none cursor-pointer text-sm ${getStatusColor(order.status)}`}
                      >
                        <option value="Bekliyor" className="bg-background text-foreground">🟠 Bekliyor</option>
                        <option value="Hazırlanıyor" className="bg-background text-foreground">🔵 Hazırlanıyor</option>
                        <option value="Kargolandı" className="bg-background text-foreground">🟣 Kargolandı</option>
                        <option value="Tamamlandı" className="bg-background text-foreground">🟢 Tamamlandı</option>
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
