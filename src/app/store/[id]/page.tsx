import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import AddToCartButton from "@/components/ui/AddToCartButton";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";

// Server-side Supabase client since this is a Server Component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data: product } = await supabase
    .from("products")
    .select("title, description")
    .eq("id", params.id)
    .single();

  if (!product) {
    return { title: 'Ürün Bulunamadı' };
  }

  return {
    title: `${product.title} - Mobar Bilişim`,
    description: product.description?.substring(0, 160) || "Mobar Bilişim garantili ürünleri.",
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", params.id)
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

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft size={16} /> Mağazaya Dön
        </Link>

        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Image Section */}
            <div className="relative w-full aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
              {product.image_url ? (
                <Image src={product.image_url} alt={product.title} fill className="object-cover" />
              ) : (
                <div className="text-gray-400 font-medium">Bu ürün için görsel eklenmemiş</div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-white/20 uppercase">
                {product.condition}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {((product as any).categories)?.name || 'Kategorisiz'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-2 leading-tight">
                {product.title}
              </h1>
              <div className="text-sm text-gray-400 mb-8">Ürün Kodu: #{product.id} • Stok: {product.stock > 0 ? 'Mevcut' : 'Tükendi'}</div>
              
              <div className="text-4xl font-black text-gray-900 mb-8">
                {(product.price).toLocaleString('tr-TR')} ₺
              </div>
              
              <div className="mb-10 text-gray-600 leading-relaxed max-w-lg">
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex-1">
                 <AddToCartButton product={product} /> 
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Stoktan Hemen Teslim</h4>
                    <p className="text-xs text-gray-500">16:00'a kadar sipariş verin</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Garantili Ürün</h4>
                    <p className="text-xs text-gray-500">Testleri tamamlanmıştır</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Ücretsiz Kargo</h4>
                    <p className="text-xs text-gray-500">Tüm alışverişlerde geçerli</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
