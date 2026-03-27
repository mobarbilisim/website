import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText } from "lucide-react";

export const revalidate = 60; // 60 saniyede bir önbelleği yenile

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase.from("blogs").select("title, content").eq("slug", resolvedParams.slug).single();
  
  if (!blog) return { title: 'Makale Bulunamadı' };
  
  return {
    title: `${blog.title} | Mobar Bilişim Blog`,
    description: blog.content.substring(0, 160).replace(/<[^>]*>?/gm, ''), // Remove HTML tags
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!blog) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 text-center bg-gray-50 min-h-[60vh]">
        <FileText size={64} className="text-gray-300 mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">404 - Makale Bulunamadı</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Aradığınız blog yazısı yayından kaldırılmış, silinmiş veya bağlantı hatalı olabilir. Lütfen blog anasayfasına dönerek diğer makalelerimize göz atın.
        </p>
        <Link href="/blog" className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition flex items-center gap-2">
          <ArrowLeft size={20} /> Bloglara Dön
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white flex-1 min-h-screen">
      {/* Makale Başlığı (Hero) */}
      <header className="bg-gray-900 text-white pt-24 pb-32 px-4 relative overflow-hidden">
        {/* Dekoratif Arka Plan Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-white transition-colors mb-6 font-medium text-sm border border-blue-400/30 px-4 py-1.5 rounded-full">
            <ArrowLeft size={16} /> Tüm Makaleler
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] mb-6 drop-shadow-xl tracking-tight">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-400 text-sm font-medium">
            <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(blog.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <span className="text-blue-400">Mobar Bilişim Blog Takımı</span>
          </div>
        </div>
      </header>

      {/* Makale İçeriği (Gövde) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        
        {/* Kapak Fotoğrafı */}
        {blog.image_url && (
          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 relative mb-12">
            <Image 
              src={blog.image_url} 
              alt={blog.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          {/* Gerçek İçerik */}
          <div className="prose prose-blue prose-lg max-w-none text-gray-700 leading-relaxed"
               dangerouslySetInnerHTML={{ __html: blog.content }}
          >
          </div>
        </div>
      </div>
    </article>
  );
}
