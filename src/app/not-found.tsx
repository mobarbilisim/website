import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-gray-50">
      <div className="w-24 h-24 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-8">
        <Search size={40} />
      </div>
      <h1 className="text-7xl font-black text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Sayfa Bulunamadı</h2>
      <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir. Ana sayfaya dönerek devam edebilirsiniz.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-500/20">
          <Home size={18} /> Ana Sayfaya Dön
        </Link>
        <Link href="/store" className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl transition border border-gray-200">
          Mağazaya Git
        </Link>
      </div>
    </div>
  );
}
