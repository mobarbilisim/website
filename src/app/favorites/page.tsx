import { Heart } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <Heart size={40} className="fill-red-100" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Favori Ürününüz Yok</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Beğendiğiniz teknoloji ürünlerini kalp ikonuna tıklayarak favorilerinize ekleyin, indirimleri kaçırmayın!
      </p>
      <Link href="/store" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
        Ürünlere Göz At
      </Link>
    </div>
  );
}
