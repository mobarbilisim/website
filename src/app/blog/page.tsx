import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, FileText } from "lucide-react";

export const revalidate = 60; // 60 saniyede bir önbelleği yenile

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-gray-50 flex-1 min-h-[70vh]">
      {/* Blog Hero */}
      <div className="bg-blue-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Mobar Bilişim Blog</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg font-medium">
          Teknoloji dünyasındaki gelişmeler, yeni trendler ve kurumunuza değer katacak bilişim ipuçları.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!blogs || blogs.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-6xl mb-4">📰</span>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Yayında Makale Yok</h3>
              <p>Ekibimiz yakında burada yeni teknoloji içerikleri paylaşacak.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col relative">
                <Link href={`/blog/${blog.slug}`} className="absolute inset-0 z-10"></Link>
                
                <div className="w-full h-56 bg-gray-100 relative overflow-hidden">
                  {blog.image_url ? (
                    <Image src={blog.image_url} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FileText size={64} />
                    </div>
                  )}
                  {/* Etiket / Tarih Kılıfı */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 shadow-sm flex items-center gap-1.5 border border-white/50">
                    <Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  <div 
                    className="text-gray-500 text-sm line-clamp-3 mb-6"
                    dangerouslySetInnerHTML={{ __html: blog.content }} 
                  />
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                    Devamını Oku <ArrowRight size={16} />
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
