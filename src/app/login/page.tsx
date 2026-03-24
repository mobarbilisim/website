export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 bg-gray-50">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tighter mb-2">MOBAR</h1>
          <p className="text-gray-500">Üye Ol veya Giriş Yap</p>
        </div>
        
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta</label>
            <input type="email" placeholder="ornek@posta.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
          </div>
          
          <button className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
            Devam Et
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400 mt-8">
          Bu sayfayı geçici olarak doldurduk, ileride Supabase Auth bağlanacak.
        </p>
      </div>
    </div>
  );
}
