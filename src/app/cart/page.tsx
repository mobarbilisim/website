import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart size={40} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Hemen yeni ve yenilenmiş teknoloji ürünlerimizi inceleyerek fırsatları değerlendirin.
      </p>
      <Link href="/store" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
        Alışverişe Başla
      </Link>
    </div>
  );
}
