import { createClient } from "@/lib/supabase/server";
import HeroSlider from "@/components/ui/HeroSlider";
import PromoBanners from "@/components/ui/PromoBanners";
import ProductSlider from "@/components/ui/ProductSlider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobar Bilişim | Kurumsal Teknoloji & Özel Yazılım",
  description: "Sıfır cihazlar, garantili 2. el bilgisayarlar ve profesyonel özel yazılım çözümleri. Dijital dönüşümde güvenilir ortağınız."
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const defaultSlides = [
  {
    title: "ALL IN ONE BİLGİSAYARLAR",
    subtitle: "Modern Ofislerin Vazgeçilmezi",
    desc: "Daha düzenli çalışma alanları için tasarlanmış hepsi bir arada bilgisayarlar.",
    bg: "from-gray-100 via-gray-200 to-gray-300",
    accent: "text-gray-900",
    btnText: "İncele",
    btnLink: "/store",
    image_url: "",
    Icon1: "Monitor",
    Icon2: "Server"
  }
];

export default async function Home() {
  const supabase = await createClient();
  let slides = defaultSlides;
  let promoBanners: any[] = [];
  let productSections: any[] = [];
  let allProducts: any[] = [];
  let categories: any[] = [];

  try {
    const { data: settings } = await supabase.from('site_settings').select('*');
    if (settings) {
      const sObj = settings.find((d: any) => d.key === 'homepage_slides');
      if (sObj?.value?.length > 0) slides = sObj.value;
      
      const pbObj = settings.find((d: any) => d.key === 'homepage_promo_banners');
      if (pbObj?.value?.length > 0) promoBanners = pbObj.value;
      
      const psObj = settings.find((d: any) => d.key === 'homepage_product_sections');
      if (psObj?.value?.length > 0) productSections = psObj.value;
    }

    // Fetch products and categories always (regardless of productSections count)
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (prods) allProducts = prods;
    const { data: cats } = await supabase.from('categories').select('*');
    if (cats) categories = cats;

  } catch (err) {
    console.error("Settings fetch error", err);
  }

  return (
    <div className="bg-white pb-20">
      <HeroSlider initialSlides={slides} />
      
      {promoBanners.length > 0 && (
         <PromoBanners banners={promoBanners} />
      )}

      {productSections.map((section: any, idx: number) => {
         // Filter products where category_id matches section.category_id OR its children
         let filteredProducts = allProducts;
         if (section.category_id) {
            const sectionCatId = section.category_id?.toString();
            const childIds = categories.filter((c: any) => c.parent_id?.toString() === sectionCatId).map((c: any) => c.id.toString());
            filteredProducts = allProducts.filter(p => p.category_id?.toString() === sectionCatId || childIds.includes(p.category_id?.toString()));
         }
         
         const limit = parseInt(section.limit) || 12;
         filteredProducts = filteredProducts.slice(0, limit);

         if (filteredProducts.length === 0) return null;

         return (
            <ProductSlider 
               key={idx}
               title={section.title}
               subtitle={section.subtitle}
               products={filteredProducts}
            />
         );
      })}
    </div>
  );
}
