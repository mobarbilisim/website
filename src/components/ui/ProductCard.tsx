"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";
import FavoriteButton from "@/components/ui/FavoriteButton";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between h-full">
      <div>
        <Link href={`/store/${product.id}`} className="block relative w-full h-48 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 overflow-hidden group-hover:shadow-md transition">
          <FavoriteButton product={product} />
          {product.image_url ? (
            <Image 
              src={product.image_url} 
              alt={product.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            "Görsel Yok"
          )}
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase z-10">
            {product.condition}
          </div>
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
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
