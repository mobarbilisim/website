import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";
import FavoriteButton from "@/components/ui/FavoriteButton";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const formattedTitle = slug.replace(/-/g, ' ').toUpperCase();
  
  const supabase = await createClient();

  // Try to find the category by slug OR name matches the un-slugged version
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug");

  const currentCategory = categories?.find(c => c.slug === slug) 
    || categories?.find(c => c.name.toLowerCase() === formattedTitle.toLowerCase() || c.name.toLowerCase().replace(/\s+/g, '-') === slug);

  let products: any[] = [];
  let errorMsg = null;

  if (currentCategory) {
    // Kategori bulundu, şimdi ürünleri çekelim
    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("category_id", currentCategory.id);

    if (error) {
      errorMsg = "Ürünler yüklenirken bir hata oluştu.";
    } else {
      products = dbProducts || [];
    }
  } else {
    // Özel durumlar için fallback (Kategori DB'de yoksa ama slug varsa, ilike ile ürün başlıklarında veya eski mantıkla arayabiliriz)
    // Mesela "Bileşenler ve Aksesuarlar" için manuel getirme yapmak istersek:
    const { data: dbProducts } = await supabase
      .from("products")
      .select("*, categories(name)");
      
    // Eğer kategori tablosunda bulamadıysa, ürünlerin kategorilerinde bu isme benzer (ilike) arayalım
    if (dbProducts) {
       products = dbProducts.filter(p => 
         p.categories?.name?.toLowerCase().includes(formattedTitle.toLowerCase().split(' ')[0])
       );
    }
  }

  return (
    <div className="bg-gray-50 flex-1 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4">
          <span className="text-blue-600">{currentCategory?.name || formattedTitle}</span> 
          <span className="text-lg text-gray-500 font-medium ml-4">({products.length} Ürün)</span>
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {!products || products.length === 0 ? (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-6xl mb-4">📦</span>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Bu kategoride henüz ürün yok</h3>
              <p>Mobar Bilişim yakında bu kategoriye yepyeni ürünler ekleyecektir.</p>
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
  );
}
