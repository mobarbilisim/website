import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { ChevronRight } from "lucide-react";

export const revalidate = 0;

export default async function IkinciElUrunlerPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const cId = resolvedParams?.c;

  // Supabase queries
  let query = supabase
    .from("products")
    .select("*, categories(name)")
    .neq("condition", "Sıfır"); // Tümü (2. El, Teşhir vb.)

  if (cId) {
    query = query.eq("category_id", cId);
  }

  const { data: products, error } = await query;
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="bg-gray-50 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 uppercase">2. EL ÜRÜNLER</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/ikinci-el-urunler" className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-colors ${!cId ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    Tümü <ChevronRight size={16} />
                  </Link>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/ikinci-el-urunler?c=${cat.id}`} className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-colors ${cId === String(cat.id) ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {cat.name} <ChevronRight size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
              2. El Garantili Ürünler
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {!products || products.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  Bu kategoride henüz ikinci el ürün bulunmuyor.
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between">
                    <div>
                      <Link href={`/store/${product.id}`} className="block relative w-full h-48 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 overflow-hidden group-hover:shadow-md transition">
                        <FavoriteButton product={product} />
                        {product.image_url ? (
                          <Image src={product.image_url} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          "Görsel Yok"
                        )}
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase z-10">
                          {product.condition}
                        </div>
                      </Link>
                      <div className="text-xs text-blue-600 font-bold mb-1">{((product as any).categories)?.name || 'Kategorisiz'}</div>
                      <Link href={`/store/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2" title={product.title}>{product.title}</h3>
                      </Link>
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

        </div>
      </div>
    </div>
  );
}
