"use client";

import { useCart } from "@/components/providers/CartProvider";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";

import toast from 'react-hot-toast';

export default function AddToCartButton({ product, className }: { product: any, className?: string }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    // Stok kontrolü — tükenmiş ürün sepete eklenemez
    if (product.stock !== undefined && product.stock <= 0) {
      toast.error("Bu ürün tükenmiştir, sepete eklenemez.", { icon: '❌' });
      return;
    }
    addToCart(product);
    setAdded(true);
    toast.success("Ürün sepete eklendi!", { icon: '🛒' });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`text-xs font-bold flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
        added 
          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
          : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
      } ${className || ''}`}
    >
      {added ? (
        <>
          <Check size={14} /> Eklendi
        </>
      ) : (
        <>
          <ShoppingCart size={14} /> Sepete Ekle
        </>
      )}
    </button>
  );
}
