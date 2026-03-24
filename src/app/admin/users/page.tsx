export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Müşteriler & Üyeler</h2>
        <p className="text-muted-foreground mt-2">Sisteme kayıtlı kurumsal ve bireysel kullanıcıların hesapları.</p>
      </div>

      <div className="glass border border-white/10 rounded-2xl p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-muted-foreground text-sm">
              <th className="pb-3 font-medium">Müşteri / Firma Adı</th>
              <th className="pb-3 font-medium">E-Posta</th>
              <th className="pb-3 font-medium">Kayıt Tarihi</th>
              <th className="pb-3 font-medium text-right">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3].map((user) => (
              <tr key={user} className="hover:bg-white/5 transition-colors">
                <td className="py-4 font-semibold">Test Kullanıcısı {user}</td>
                <td className="py-4 text-sm text-muted-foreground">kullanici{user}@firma.com</td>
                <td className="py-4 text-sm">11 Eylül 2024</td>
                <td className="py-4 text-right">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full font-medium text-xs">Aktif</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
