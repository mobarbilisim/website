import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blogs")
    .select("title, content")
    .eq("slug", params.slug)
    .single();

  if (!post) return { title: "Yazı Bulunamadı" };

  return {
    title: `${post.title} - Mobar Bilişim Blog`,
    description: post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-4">İçerik Bulunamadı</h1>
        <Link href="/blog" className="text-blue-600 hover:underline">Blog listesine dön</Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] w-full bg-gray-900">
        {post.image_url ? (
          <Image src={post.image_url} alt={post.title} fill className="object-cover opacity-60" priority />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 font-black text-6xl uppercase tracking-tighter">Mobar Bilişim</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold mb-8 transition-colors">
              <ArrowLeft size={16} /> Blog'a Dön
            </Link>
            <div className="flex items-center gap-4 text-blue-400 text-xs font-black uppercase tracking-widest mb-4">
              <span className="bg-blue-600/20 px-2 py-1 rounded">Teknoloji & Rehber</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="prose prose-lg prose-blue max-w-none">
          <p className="text-gray-600 leading-loose text-lg font-medium whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">M</div>
            <div>
              <div className="text-sm font-black text-gray-900">Mobar Bilişim Ekibi</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Profesyonel Teknoloji Çözümleri</div>
            </div>
          </div>
          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
            <Share2 size={20} /> <span className="text-sm font-bold hidden sm:inline">Paylaş</span>
          </button>
        </div>
      </div>
    </article>
  );
}
