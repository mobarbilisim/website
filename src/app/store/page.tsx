import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { Filter, X, ChevronRight } from "lucide-react";

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ 
    q?: string; 
    category?: string; 
    condition?: string; 
    minPrice?: string; 
    maxPrice?: string;
  }>
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const q = resolvedParams?.q;
  const selectedCategory = resolvedParams?.category;
  const selectedCondition = resolvedParams?.condition;
  const minPrice = resolvedParams?.minPrice;
  const maxPrice = resolvedParams?.maxPrice;

  // Verileri çek (Önce kategoriler)
  const { data: categories } = await supabase.from("categories").select("*");

  // Ürün sorgusunu oluştur
  let query = supabase
    .from("products")
    .select("*, categories(name)");

  if (q) query = query.ilike("title", `%${q}%`);
  if (selectedCategory) query = query.eq("category_id", selectedCategory);
  if (selectedCondition) query = query.eq("condition", selectedCondition);
  if (minPrice) query = query.gte("price", parseFloat(minPrice));
  if (maxPrice) query = query.lte("price", parseFloat(maxPrice));

  const { data: products, error } = await query.order("id", { ascending: false });

  if (error) console.error("Supabase Hatası:", error);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              <Link href="/" className="hover:text-blue-600">Anasayfa</Link>
              <ChevronRight size={12} />
              <span className="text-gray-900">Mağaza</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              {q ? `"${q}" İçin Sonuçlar` : "Mağaza"}
            </h1>
            <p className="text-gray-500 font-medium mt-2">
              {products?.length || 0} ürün listeleniyor
            </p>
          </div>
          
          {/* Active Filters Display */}
          {(selectedCategory || selectedCondition || minPrice || maxPrice) && (
            <div className="flex flex-wrap gap-2">
              <Link href="/store" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full hover:bg-gray-800 transition">
                Filtreleri Temizle <X size={12} />
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Mobile Filter Toggle (Visible only on mobile) */}
          <div className="lg:hidden flex flex-wrap gap-4 mb-4">
            <div className="w-full">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                Hızlı Filtrele
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/store" className={`px-4 py-2 rounded-xl text-xs font-bold border ${!selectedCategory ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                  Hepsi
                </Link>
                {categories?.map((cat) => (
                  <Link 
                    key={cat.id}
                    href={`/store?category=${cat.id}`} 
                    className={`px-4 py-2 rounded-xl text-xs font-bold border ${selectedCategory === cat.id.toString() ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block space-y-10">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Filter size={16} /> Kategoriler
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/store" className={`text-sm font-bold transition-all ${!selectedCategory ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
                    Tüm Ürünler
                  </Link>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/store?category=${cat.id}`} 
                      className={`text-sm font-bold transition-all ${selectedCategory === cat.id.toString() ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Condition */}
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Ürün Durumu</h3>
              <div className="flex flex-col gap-3">
                <Link href={`/store?${new URLSearchParams({ ...resolvedParams, condition: 'Sıfır' })}`} className={`text-sm font-bold ${selectedCondition === 'Sıfır' ? 'text-blue-600' : 'text-gray-500'}`}>Sıfır Ürünler</Link>
                <Link href={`/store?${new URLSearchParams({ ...resolvedParams, condition: '2.El' })}`} className={`text-sm font-bold ${selectedCondition === '2.El' ? 'text-blue-600' : 'text-gray-500'}`}>2. El Ürünler</Link>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Fiyat Aralığı</h3>
              <form action="/store" method="GET" className="space-y-4">
                {/* Mevcut filtreleri korumak için gizli inputlar */}
                {q && <input type="hidden" name="q" value={q} />}
                {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
                {selectedCondition && <input type="hidden" name="condition" value={selectedCondition} />}
                
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" 
                    name="minPrice" 
                    defaultValue={minPrice || ""} 
                    placeholder="Min" 
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500" 
                  />
                  <input 
                    type="number" 
                    name="maxPrice" 
                    defaultValue={maxPrice || ""} 
                    placeholder="Max" 
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500" 
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">
                  Fiyat Filtrele
                </button>
              </form>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {!products || products.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ürün Bulunamadı</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-8">
                  Seçtiğiniz kriterlere uygun ürün bulunamadı. Lütfen filtreleri değiştirmeyi deneyin.
                </p>
                <Link href="/store" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-xl shadow-gray-200">
                  Tüm Ürünleri Gör
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
