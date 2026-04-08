"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { ImageOff } from "lucide-react";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div>
        <Link href={`/store/${product.id}`} className="block relative w-full h-48 bg-gray-50 rounded-xl mb-4 flex flex-col items-center justify-center text-gray-400 overflow-hidden group-hover:shadow-md transition">
          <FavoriteButton product={product} />
          {product.images?.[0] || product.image_url ? (
            <Image 
              src={product.images?.[0] || product.image_url} 
              alt={product.title} 
              fill 
              className={`object-cover group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'grayscale' : ''}`} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center opacity-50">
              <ImageOff size={32} className="mb-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#9ca3af]">Görsel Yok</span>
            </div>
          )}

          {/* Fırsat Etiketi (Badge) */}
          {product.badge && (
            <div className="absolute top-2 left-2 z-10">
               <div className="bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center text-[10px] font-black px-2 py-1 rounded-md shadow-md border border-red-400">
                 {product.badge}
               </div>
            </div>
          )}

          {/* Tükendi — Blur Overlay (Görselin Üzerinde) */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 rounded-xl overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-[6px] bg-white/40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="bg-red-600/90 text-white text-sm font-black uppercase px-6 py-2.5 rounded-xl tracking-[0.2em] shadow-2xl border border-red-500/30">
                  TÜKENDİ
                </span>
              </div>
            </div>
          )}
        </Link>
        <div className="text-xs text-blue-600 font-bold mb-1">
          {product.categories?.name || 'Kategorisiz'}
        </div>
        <Link href={`/store/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2" title={product.title}>
            {product.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4">{product.description}</p>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="text-lg font-bold">{(product.price).toLocaleString('tr-TR')} ₺</div>
        {isOutOfStock ? (
          <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-200">Tükendi</span>
        ) : (
          <AddToCartButton product={product} />
        )}
      </div>
    </div>
  );
}
