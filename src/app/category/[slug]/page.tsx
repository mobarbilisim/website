import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name, slug");
  const cat = categories?.find((c: any) => c.slug === resolvedParams.slug);
  
  return {
    title: `${cat?.name || resolvedParams.slug.replace(/-/g, ' ')} - Mobar Bilişim`,
    description: `${cat?.name || ''} kategorisindeki tüm ürünleri uygun fiyatlarla Mobar Bilişim'de inceleyin.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  
  const supabase = await createClient();

  // Tüm kategorileri çek
  const { data: allCategories } = await supabase.from("categories").select("*");
  const categories = allCategories || [];

  // Slug ile kategoriyi bul
  const currentCategory = categories.find((c: any) => c.slug === slug);
  
  if (!currentCategory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-gray-50 min-h-screen">
        <span className="text-6xl mb-6">🔍</span>
        <h1 className="text-3xl font-black mb-4 text-gray-900">Kategori Bulunamadı</h1>
        <p className="text-gray-500 mb-8 max-w-md">Aradığınız kategori silinmiş veya bağlantı hatalı olabilir.</p>
        <Link href="/store" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          Mağazaya Dön
        </Link>
      </div>
    );
  }

  // Bu bir ana kategori mi yoksa alt kategori mi?
  const isParent = !currentCategory.parent_id;
  
  // Alt kategorilerini bul (sadece ana kategori ise)
  const subCategories = isParent 
    ? categories.filter((c: any) => c.parent_id === currentCategory.id)
    : [];

  // Eğer bu bir ana kategori ise: Hem kendi ürünlerini hem alt kategorilerdeki ürünleri getir
  // Eğer bu bir alt kategori ise: Sadece kendi ürünlerini getir ve kardeş kategorileri sidebar'da göster
  const categoryIds: number[] = [currentCategory.id];
  if (isParent) {
    subCategories.forEach((sub: any) => categoryIds.push(sub.id));
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name, id)")
    .in("category_id", categoryIds)
    .order("created_at", { ascending: false });

  const allProducts = products || [];

  // Sidebar için: eğer alt kategori ise üst kategorisini ve kardeşlerini bul
  let parentCategory = currentCategory;
  let sidebarSubs = subCategories;
  
  if (!isParent) {
    parentCategory = categories.find((c: any) => c.id === currentCategory.parent_id) || currentCategory;
    sidebarSubs = categories.filter((c: any) => c.parent_id === parentCategory.id);
  }

  // Her alt kategorideki ürün sayısını hesapla
  const getSubCount = (catId: number) => allProducts.filter((p: any) => p.category_id === catId).length;

  return (
    <div className="bg-gray-50 flex-1 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition">Anasayfa</Link>
            <ChevronRight size={14} />
            <Link href="/store" className="hover:text-blue-600 transition">Mağaza</Link>
            <ChevronRight size={14} />
            {!isParent && parentCategory.id !== currentCategory.id && (
              <>
                <Link href={`/category/${parentCategory.slug}`} className="hover:text-blue-600 transition">
                  {parentCategory.name}
                </Link>
                <ChevronRight size={14} />
              </>
            )}
            <span className="text-gray-900 font-bold">{currentCategory.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            {currentCategory.name}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isParent && subCategories.length > 0 
              ? `${subCategories.length} alt kategori ve toplam ${allProducts.length} ürün listeleniyor.`
              : `${allProducts.length} ürün listeleniyor.`
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sol Sidebar — Kategori Filtresi */}
          {sidebarSubs.length > 0 && (
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-28">
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-blue-600" />
                  <h3 className="font-black text-sm text-gray-900 uppercase tracking-wider">
                    {parentCategory.name}
                  </h3>
                </div>
                
                <div className="p-3 space-y-1">
                  {/* Tüm Ürünler Linki */}
                  <Link
                    href={`/category/${parentCategory.slug}`}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      currentCategory.id === parentCategory.id && isParent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <span>Tüm {parentCategory.name}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      currentCategory.id === parentCategory.id && isParent
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {allProducts.length}
                    </span>
                  </Link>

                  <div className="h-px bg-gray-100 my-2"></div>

                  {/* Alt Kategoriler */}
                  {sidebarSubs.map((sub: any) => {
                    const isActive = currentCategory.id === sub.id;
                    const count = getSubCount(sub.id);
                    return (
                      <Link
                        key={sub.id}
                        href={`/category/${sub.slug}`}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                          {sub.name}
                        </div>
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}

          {/* Sağ: Ürün Grid */}
          <main className="flex-1">
            {allProducts.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-6xl mb-4">📦</span>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Bu kategoride henüz ürün yok</h3>
                <p className="text-sm text-gray-500 mb-6">Mobar Bilişim yakında bu kategoriye yepyeni ürünler ekleyecektir.</p>
                <Link href="/store" className="text-blue-600 font-bold hover:underline">Tüm Ürünlere Göz At →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {allProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
