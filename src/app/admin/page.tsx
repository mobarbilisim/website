"use client";

import { motion } from "framer-motion";
import { DollarSign, Activity, CreditCard, Users } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Toplam Ciro", value: "₺45,231.89", change: "+20.1% geçen aydan", icon: <DollarSign size={22} className="text-emerald-400" /> },
    { title: "Aktif Siparişler", value: "+235", change: "+180.1% geçen aydan", icon: <CreditCard size={22} className="text-blue-400" /> },
    { title: "Sistem Sağlığı", value: "99.9%", change: "Sunucular aktif & hatasız", icon: <Activity size={22} className="text-purple-400" /> },
    { title: "Yeni Kullanıcılar", value: "+573", change: "+201 son 7 günde", icon: <Users size={22} className="text-orange-400" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sisteme Hoş Geldiniz</h2>
        <p className="text-muted-foreground mt-2">İşletmenizin ve e-ticaret sitenizin güncel özeti burada.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass p-6 rounded-2xl flex flex-col border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none">
              {stat.icon}
            </div>
            <div className="flex items-center gap-3 mb-4">
              {stat.icon}
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass border border-white/5 rounded-2xl p-6 lg:col-span-4 h-96 flex items-center justify-center text-muted-foreground"
        >
          [Grafik Gelecek] - Grafik Kütüphanesi Eklenebilir (Recharts vb.)
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass border border-white/5 rounded-2xl p-6 lg:col-span-3 h-96 overflow-hidden flex flex-col"
        >
          <h3 className="font-semibold mb-4">Son Operasyonlar</h3>
          <div className="flex-1 space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Sipariş #00{i}XF</span>
                  <span className="text-xs text-muted-foreground">3 dakika önce • Ödendi</span>
                </div>
                <span className="font-semibold text-emerald-400">+₺{(i * 1250) + 500}.00</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
