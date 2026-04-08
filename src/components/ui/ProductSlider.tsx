"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Heart, CheckCircle2 } from "lucide-react";
import { useFavorites } from "@/components/providers/FavoriteProvider";
import { useCart } from "@/components/providers/CartProvider";
import toast from "react-hot-toast";

export default function ProductSlider({ title, subtitle, products = [] }: { title: string; subtitle?: string; products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [products]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12 relative">
      
      {/* Title Area */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mb-8 pb-4 border-b-2 border-blue-500">
         <div className="text-center md:text-left">
           <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-2">
             <div className="w-4 h-4 bg-blue-500 rounded-sm inline-block transform rotate-45 hidden md:block"></div>
             {title}
           </h2>
           {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
         </div>
      </div>

      {/* Custom Slider Navigation */}
      <button onClick={scrollLeft} disabled={!canScrollLeft} className={`absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100 transition-all ${!canScrollLeft ? 'opacity-0 invisible' : 'opacity-100 hover:scale-110 text-blue-600 hover:text-blue-700'}`}>
         <ChevronLeft size={24} />
      </button>
      <button onClick={scrollRight} disabled={!canScrollRight} className={`absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100 transition-all ${!canScrollRight ? 'opacity-0 invisible' : 'opacity-100 hover:scale-110 text-blue-600 hover:text-blue-700'}`}>
         <ChevronRight size={24} />
      </button>

      {/* Slider Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6"
      >
        {products.map((product) => {
          const primaryImg = product.images?.[0] || product.image_url;
          const fakeOldPrice = product.price * 1.15;
          const isFav = isFavorite(product.id);
          const conditionText = product.condition || (product.features?.[0] || '');
          return (
            <div key={product.id} className="min-w-[260px] md:min-w-[280px] w-[260px] md:w-[280px] flex-shrink-0 snap-start select-none bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col group overflow-hidden relative">
              
              {/* Image Box */}
              <Link href={`/store/${product.id}`} className="block relative w-full aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                 {primaryImg ? (
                   <img src={primaryImg} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">Görsel Yok</div>
                 )}
                 {/* Badge - Fırsat Etiketi */}
                 {product.badge && (
                   <div className="absolute top-3 left-3 z-20">
                     <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center text-[10px] font-black text-center leading-tight shadow-lg shadow-red-500/40 border-2 border-white">
                       {product.badge}
                     </div>
                   </div>
                 )}
                 {/* Favori Butonu */}
                 <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if(isFav) { removeFavorite(product.id); toast.success("Favorilerden çıkarıldı."); }
                    else { addFavorite(product); toast.success("Favorilere eklendi!", { icon: '❤️' }); }
                  }} 
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 transition-colors z-20"
                 >
                   <Heart size={16} className={isFav ? "fill-red-500 text-red-500" : ""} />
                 </button>
              </Link>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                 {/* Rating */}
                 <div className="flex items-center gap-0.5 text-amber-400 mb-2">
                    <Star size={12} className="fill-amber-400" />
                    <Star size={12} className="fill-amber-400" />
                    <Star size={12} className="fill-amber-400" />
                    <Star size={12} className="fill-amber-400" />
                    <Star size={12} className="fill-amber-400" />
                 </div>
                 
                 {/* Title */}
                 <Link href={`/store/${product.id}`} className="block text-sm font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors h-10 mb-3">
                    {product.title}
                 </Link>

                 {/* Specs snippet - admin controlled */}
                 {conditionText && (
                   <div className="text-[11px] text-gray-500 mb-3 min-h-[28px] bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1">
                     <CheckCircle2 size={10} className="text-blue-500 shrink-0"/>
                     <span className="line-clamp-1">{conditionText}</span>
                   </div>
                 )}

                 {/* Price & Action */}
                 <div className="mt-auto flex items-end justify-between">
                    <div>
                       <div className="text-xs text-gray-400 line-through font-medium mb-0.5">₺{fakeOldPrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</div>
                       <div className="text-[#e20613] font-black tracking-tight text-lg leading-none">
                          {product.price.toLocaleString('tr-TR')} <span className="text-sm font-bold ml-0.5">TL</span>
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={() => {
                     addToCart({ id: product.id, title: product.title, price: product.price, image_url: primaryImg || '', quantity: 1 });
                     toast.success("Sepete eklendi!");
                  }}
                  className="w-full mt-4 bg-gray-900 border border-gray-900 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-white hover:text-gray-900 transition-colors uppercase tracking-wider"
                 >
                    Sepete Ekle
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
