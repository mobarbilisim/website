import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Blog & Haberler - Mobar Bilişim",
  description: "Teknoloji dünyasından en son haberler, rehberler ve ipuçları Mobar Bilişim blog sayfasında.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Blog & Haberler
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Teknoloji dünyasındaki gelişmeleri, uzman görüşlerimizi ve güncel haberleri buradan takip edebilirsiniz.
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-medium">Henüz bir yazı paylaşılmamış.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col h-full">
                <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                  {post.image_url ? (
                    <Image src={post.image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest text-xs">Mobar Bilişim</div>
                  )}
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">
                    {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="text-sm font-black text-gray-900 inline-flex items-center gap-2">
                    Devamını Oku <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
