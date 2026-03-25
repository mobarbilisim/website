"use client";

import { useFavorites } from "@/components/providers/FavoriteProvider";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-red-500 fill-red-100" size={32} />
        <h1 className="text-3xl font-extrabold text-gray-900">Favorilerim ({favorites.length})</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {favorites.map((product) => (
          <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all relative flex flex-col justify-between">
            <button 
              onClick={(e) => { e.preventDefault(); removeFavorite(product.id); }}
              className="absolute top-6 right-6 z-10 w-8 h-8 bg-white text-gray-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm border border-gray-100 transition-colors"
              title="Favorilerden Kaldır"
            >
              <Trash2 size={16} />
            </button>
            <div>
              <Link href={`/store/${product.id}`} className="block w-full h-48 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 relative overflow-hidden group">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  "Görsel Yok"
                )}
              </Link>
              <Link href={`/store/${product.id}`}>
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2" title={product.title}>{product.title}</h3>
              </Link>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
              <div className="text-lg font-bold">{(product.price).toLocaleString('tr-TR')} ₺</div>
              <AddToCartButton product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
