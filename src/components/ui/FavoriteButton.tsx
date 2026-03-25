"use client";

import { useFavorites } from "@/components/providers/FavoriteProvider";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ product }: { product: any }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favState = isFavorite(product.id);
  const supabase = createClient();
  const router = useRouter();

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent triggering parent Link click
    
    // Check if user logged in
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      alert("Favorilere eklemek için önce giriş yapmalısınız.");
      router.push("/giris");
      return;
    }

    if (favState) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <button 
      onClick={toggleFavorite}
      className={`absolute top-2 left-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/90 shadow-sm border ${
        favState 
          ? "text-red-500 border-red-100 bg-red-50" 
          : "text-gray-400 border-gray-100 hover:text-red-500 hover:bg-red-50"
      }`}
    >
      <Heart size={16} className={favState ? "fill-red-500" : ""} />
    </button>
  );
}
