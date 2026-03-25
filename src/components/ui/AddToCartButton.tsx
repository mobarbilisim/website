"use client";

import { useCart } from "@/components/providers/CartProvider";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // In case it's inside a Link
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
        added 
          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
          : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
      }`}
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
