import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import AddToCartButton from "@/components/ui/AddToCartButton";

// Server-side Supabase client since this is a Server Component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function StorePage() {
  // Supabase'den ürünleri ve kategorilerini çek
  const { data: products, error } = await supabase
    .from("products")
    .select("*, categories(name)");

  if (error) {
    console.error("Supabase Hatası:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-4xl font-extrabold mb-4">Mobar Bilişim Ürünleri</h1>
      <p className="text-gray-500 mb-12">Sıfır ve testleri tamamlanmış 2. el garantili teknoloji mağazası.</p>
      
      {/* Dynamic Grid from Database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {!products || products.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
            Kataloğumuzda şu an ürün bulunmuyor. Lütfen admin panelinden ürün ekleyin.
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between">
              <div>
                <div className="w-full h-48 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 relative overflow-hidden">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    "Görsel Yok"
                  )}
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    {product.condition}
                  </div>
                </div>
                {/* ts-ignore if you have strictly typed DB, but here it works */}
                <div className="text-xs text-blue-600 font-bold mb-1">{((product as any).categories)?.name || 'Kategorisiz'}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2" title={product.title}>{product.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{product.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="text-lg font-bold">{(product.price).toLocaleString('tr-TR')} ₺</div>
                <AddToCartButton product={product} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
