import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://mobar.com.tr";

export const revalidate = 3600; // 1 saatte bir yenile

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/store`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/yazilim-cozumleri`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/kvkk`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dinamik ürün sayfaları
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await supabase
      .from("products")
      .select("id, updated_at")
      .eq("is_active", true);

    if (products) {
      productPages = products.map((p) => ({
        url: `${BASE_URL}/store/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {}

  // Dinamik blog sayfaları
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { data: blogs } = await supabase
      .from("blogs")
      .select("slug, updated_at")
      .eq("is_published", true);

    if (blogs) {
      blogPages = blogs.map((b) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch {}

  return [...staticPages, ...productPages, ...blogPages];
}
