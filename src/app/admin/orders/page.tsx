export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Siparişler</h2>
        <p className="text-muted-foreground mt-2">Müşterilerden gelen tüm çevrimiçi siparişler, kargo durumları ve faturalar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Bekleyen</h3>
          <div className="text-3xl font-bold text-orange-400">14</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Hazırlanan</h3>
          <div className="text-3xl font-bold text-blue-400">5</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Kargolanan (Bu Hafta)</h3>
          <div className="text-3xl font-bold text-emerald-400">42</div>
        </div>
      </div>

      <div className="glass border border-white/10 rounded-2xl p-6 h-96 flex flex-col items-center justify-center text-muted-foreground">
        <p className="text-lg">Bugün herhangi bir sipariş alınmadı.</p>
        <p className="text-sm mt-2 opacity-50">(Veritabanı bağlandığında liste dolacaktır)</p>
      </div>
    </div>
  );
}
