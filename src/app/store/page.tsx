import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ui/ProductCard";

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const q = resolvedParams?.q;

  // Supabase'den ürünleri ve kategorilerini çek
  let query = supabase
    .from("products")
    .select("*, categories(name)");

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Supabase Hatası:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-4xl font-extrabold mb-4">
        {q ? `"${q}" için arama sonuçları` : "Mobar Bilişim Ürünleri"}
      </h1>
      <p className="text-gray-500 mb-12">
        {q ? `${products?.length || 0} ürün bulundu` : "Sıfır ve testleri tamamlanmış 2. el garantili teknoloji mağazası."}
      </p>
      
      {/* Dynamic Grid from Database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {!products || products.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
            Kataloğumuzda şu an ürün bulunmuyor. Lütfen admin panelinden ürün ekleyin.
          </div>
        ) : (
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
