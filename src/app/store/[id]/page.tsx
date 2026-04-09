import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import AddToCartButton from "@/components/ui/AddToCartButton";
import FavoriteButton from "@/components/ui/FavoriteButton";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, ChevronRight, Info, ImageOff } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("title, description")
    .eq("id", resolvedParams.id)
    .single();

  if (!product) {
    return { title: 'Ürün Bulunamadı' };
  }

  return {
    title: `${product.title} - Mobar Bilişim`,
    description: product.description?.substring(0, 160) || "Mobar Bilişim garantili ürünleri.",
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name, id)")
    .eq("id", resolvedParams.id)
    .single();

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Ürün Bulunamadı</h1>
        <p className="text-gray-500 mb-8">Aradığınız ürün yayından kaldırılmış veya bağlantı hatalı olabilir.</p>
        <Link href="/store" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Mağazaya Dön
        </Link>
      </div>
    );
  }

  // Benzer Ürünler (Aynı kategoriden)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4);

  const categoryName = (product as any).categories?.name || 'Kategorisiz';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-[1400px] w-[97%] mx-auto py-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition">Anasayfa</Link>
            <ChevronRight size={14} />
            <Link href="/store" className="hover:text-blue-600 transition">Mağaza</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] w-[97%] mx-auto">
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden border border-gray-100 group shadow-inner">
                {product.images?.[0] || product.image_url ? (
                  <Image src={product.images?.[0] || product.image_url} alt={product.title} fill className={`object-contain p-4 group-hover:scale-105 transition-transform duration-700 ${product.stock <= 0 ? 'grayscale' : ''}`} />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <ImageOff size={64} className="mb-4 text-gray-300" />
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Görsel Yok</span>
                  </div>
                )}
                
                {product.badge && (
                  <div className="absolute top-4 left-4 z-20">
                     <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center text-[11px] font-black text-center leading-tight shadow-xl shadow-red-500/40 border-2 border-white">
                       {product.badge}
                     </div>
                  </div>
                )}

                {/* Tükendi Blur Overlay */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 z-20 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 backdrop-blur-md bg-white/30"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <span className="bg-red-600/90 text-white text-xl font-black uppercase px-10 py-4 rounded-2xl tracking-[0.25em] shadow-2xl border border-red-500/30">
                        TÜKENDİ
                      </span>
                      <span className="text-sm font-bold text-gray-700">Bu ürün şu an stokta bulunmuyor</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {product.images.map((img: string, i: number) => (
                    <div key={i} className="aspect-square bg-white border border-gray-200 rounded-xl overflow-hidden relative cursor-pointer hover:border-blue-500 transition-colors">
                      <Image src={img} alt={`${product.title} ${i+1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                  {categoryName}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl font-black text-blue-600">
                  {(product.price).toLocaleString('tr-TR')} ₺
                </div>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <CheckCircle2 size={12} /> Stokta Var
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                    Tükendi
                  </span>
                )}
              </div>
              
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.features?.map((f: string, i: number) => (
                    <span key={i} className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-blue-500"/> {f}
                    </span>
                  ))}
                  {product.condition && !product.features?.includes(product.condition) && (
                    <span className="bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Info size={12} className="text-orange-500"/> {product.condition}
                    </span>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Info size={16} className="text-blue-600" /> Ürün Açıklaması
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                    {product.description || "Bu ürün için henüz bir açıklama girilmemiş."}
                  </p>
                </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10 h-[60px]">
                <div className="flex-[2]">
                  {product.stock <= 0 ? (
                    <div className="w-full h-full flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-xl">
                      <span className="text-red-600 font-black text-base uppercase tracking-widest">Tükendi — Sepete Eklenemez</span>
                    </div>
                  ) : (
                    <AddToCartButton product={product} className="w-full h-full py-0 text-base shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all rounded-xl" />
                  )}
                </div>
                <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer group shadow-sm z-10 relative">
                  <div className="flex items-center gap-2">
                    <FavoriteButton product={product} />
                    <span className="ml-[40px] text-sm font-extrabold text-gray-700 group-hover:text-red-500 transition-colors">Favorilere Ekle</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-gray-900">Kargo</h4>
                    <p className="text-[11px] text-gray-500 font-bold">Ücretsiz Teslimat</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-gray-900">Garanti</h4>
                    <p className="text-[11px] text-gray-500 font-bold">Mobar Güvencesi</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-gray-900">Kondisyon</h4>
                    <p className="text-[11px] text-gray-500 font-bold uppercase line-clamp-1" title={product.condition || 'FIRSAT'}>
                      {product.condition ? (product.condition === 'new' ? 'Sıfır' : product.condition) : 'FIRSAT'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Benzer Ürünler
              </h2>
              <Link href="/store" className="text-sm font-bold text-blue-600 hover:underline">
                Tümünü Gör
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
