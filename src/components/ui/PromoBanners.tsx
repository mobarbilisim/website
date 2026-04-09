import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBanners({ banners = [] }: { banners: any[] }) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] w-[97%] mx-auto mt-6">
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(banners.length, 4)} gap-4 lg:gap-6`}>
        {banners.map((banner, idx) => (
          <Link href={banner.link || '#'} key={idx} className={`block rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative group bg-gradient-to-br ${banner.bg} text-white`}>
             <div className="flex justify-between items-center h-44 md:h-48 pr-4 relative z-10 p-5 lg:p-6">
                <div className="flex flex-col justify-center max-w-[65%]">
                   <h3 className="text-sm md:text-base font-black leading-tight mb-1 drop-shadow-sm line-clamp-2">
                      {banner.title}
                   </h3>
                   {banner.subtitle && (
                      <p className="text-[10px] md:text-xs font-semibold opacity-90 mb-3 drop-shadow-sm line-clamp-2">
                         {banner.subtitle}
                      </p>
                   )}
                   <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm self-start px-3 py-1 rounded-full text-[10px] md:text-xs font-bold hover:bg-white hover:text-gray-900 transition-colors">
                      ÜRÜNLERİ GÖR <ArrowRight size={12} />
                   </span>
                </div>
                {banner.image_url && (
                   <div className="w-24 h-24 md:w-32 md:h-32 absolute -right-2 top-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500 origin-right">
                      <img src={banner.image_url} alt="" className="w-full h-full object-contain filter drop-shadow-xl" />
                   </div>
                )}
             </div>
             {/* Decorative shine effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-0"></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
