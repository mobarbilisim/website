"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Code, Monitor, Laptop, Server, Map, Layers, Cpu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const iconMap: Record<string, any> = { Code, Monitor, Laptop, Server, Map, Layers, Cpu };

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [customSlides, setCustomSlides] = useState<any[]>([]);
  const [customCards, setCustomCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default veri (Supabase hata verirse veya tablo yoksa fallback)
  const defaultSlides = [
    {
      title: "ÖZEL YAZILIM ÇÖZÜMLERİ",
      subtitle: "Kurumsal & Dijital",
      desc: "Modern web siteleri, e-ticaret platformları ve kurumsal yazılım çözümleri. Hızlı teslimat, profesyonel destek.",
      bg: "from-emerald-900 via-teal-900 to-slate-900",
      accent: "text-emerald-400",
      btnText: "Hemen Keşfedin",
      btnLink: "/category/yazilim-cozumleri",
      Icon1: "Code",
      Icon2: "Laptop"
    },
    {
      title: "SIFIR GARANTİLİ CIHAZLAR",
      subtitle: "Sıfır Kapalı Kutu",
      desc: "Tam garanti süresiyle sıfır bilgisayar ve bileşen ürünleri. Hemen kargola, güvenle al.",
      bg: "from-blue-900 via-indigo-900 to-slate-900",
      accent: "text-blue-400",
      btnText: "Sıfır Ürünleri Gör",
      btnLink: "/sifir-urunler",
      Icon1: "Server",
      Icon2: "Cpu"
    },
    {
      title: "2. EL GARANTİLİ BİLGİSAYARLAR",
      subtitle: "Fiyrsatları Kaçırma",
      desc: "Kurumsal performans, uygun maliyet. Tüm testleri yapılmış, 3 ay Mobar garantili ürünleri hemen inceleyin.",
      bg: "from-slate-800 via-slate-900 to-gray-900",
      accent: "text-orange-400",
      btnText: "Fırsatları Gör",
      btnLink: "/ikinci-el-urunler",
      Icon1: "Server",
      Icon2: "Monitor"
    }
  ];

  const defaultCards = [
    {
      title: "MODERN YAZILIM<br/>ÇÖZÜMLERİ",
      features: ["• Modern Web Siteleri", "• E-Ticaret / Kurumsal", "• Hızlı Teslimat & SEO"],
      bg: "from-slate-800 to-slate-900",
      icon: "Code",
      btnText: "PAKETLERİ GÖR",
      btnLink: "/category/yazilim-cozumleri",
      image_url: ""
    },
    {
      title: "SIFIR GARANTİLİ<br/>ÜRÜNLER",
      features: ["• Sıfır Kapalı Kutu", "• Tam Garanti Süresi", "• Hızlı Kargo"],
      bg: "from-blue-500 to-blue-600",
      icon: "Laptop",
      btnText: "ÜRÜNLERİ İNCELE",
      btnLink: "/sifir-urunler",
      image_url: ""
    },
    {
      title: "2. EL GARANTİLİ<br/>BİLGİSAYARLAR",
      features: ["• Tüm Testleri Yapıldı", "• 3 Ay Mobar Garantisi", "• Kurumsal Temiz Cihazlar"],
      bg: "from-purple-500 to-purple-600",
      icon: "Monitor",
      btnText: "FIRSATLARI GÖR",
      btnLink: "/ikinci-el-urunler",
      image_url: ""
    }
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (data && !error) {
          const sObj = data.find(d => d.key === 'homepage_slides');
          if (sObj?.value?.length > 0) setCustomSlides(sObj.value);
          
          const cObj = data.find(d => d.key === 'homepage_cards');
          if (cObj?.value?.length > 0) setCustomCards(cObj.value);
        }
      } catch (err) {
        console.error("Supabase settings fetch error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const activeSlides = customSlides.length > 0 ? customSlides : defaultSlides;
  const activeCards = customCards.length > 0 ? customCards : defaultCards;

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, activeSlides.length]);

  const activeSlide = activeSlides[currentSlide] || activeSlides[0];

  const getIcon = (name: string, defaultIconName: string = "Server") => {
    return iconMap[name] || iconMap[defaultIconName] || Server;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="bg-gray-50 pb-20">
      {/* Hero Banner Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Link 
          href={activeSlide.btnLink || "/store"}
          className={`relative w-full h-[450px] md:h-[550px] bg-gradient-to-br ${activeSlide.bg} rounded-3xl overflow-hidden shadow-2xl group flex items-center transition-colors duration-1000 border border-white/10 cursor-pointer`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Abstract particles/glow */}
          <div className="absolute top-0 right-1/4 w-1/2 h-full bg-white/10 blur-[120px] pointer-events-none rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 blur-[100px] pointer-events-none rounded-full"></div>
          
          <div className="relative z-10 px-8 md:px-16 w-full md:w-3/5">
            <motion.div 
              key={currentSlide} 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full mb-6 shadow-sm">
                {activeSlide.subtitle}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-2xl tracking-tight">
                {activeSlide.title.split(' ').slice(0, 2).join(' ')} <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 ${activeSlide.accent}`}>{activeSlide.title.split(' ').slice(2).join(' ')}</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-50/80 mb-10 max-w-lg font-medium leading-relaxed drop-shadow-md">
                {activeSlide.desc}
              </p>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-extrabold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  {activeSlide.btnText} <ArrowRight size={20} className="text-blue-600" />
                </span>
                <div className="hidden sm:flex text-white/50 text-sm font-semibold tracking-wider uppercase ml-4 items-center gap-2">
                  <span className="w-8 h-px bg-white/30 hidden md:block"></span> 
                  KEŞFET
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative/Image Placeholder on the Right */}
          <div className="hidden md:flex absolute right-0 top-0 h-full w-2/5 justify-end items-center drop-shadow-2xl overflow-hidden mask-image-gradient-left pr-10">
              <motion.div 
                key={`bg-${currentSlide}`} 
                initial={{ opacity: 0, scale: 0.8, x: 50 }} 
                animate={{ opacity: 1, scale: 1, x: 0 }} 
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 flex items-center justify-center w-full h-full"
              >
                {activeSlide.image_url ? (
                  <Image src={activeSlide.image_url} alt="Slider Image" fill className="object-contain max-h-[90%] drop-shadow-2xl p-4 scale-110" />
                ) : (
                  <>
                    {(() => {
                      const Icon1 = activeSlide.Icon1 ? getIcon(activeSlide.Icon1) : getIcon("Server");
                      const Icon2 = activeSlide.Icon2 ? getIcon(activeSlide.Icon2) : getIcon("Monitor");
                      return (
                        <>
                          <Icon1 size={400} className="text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 blur-sm" />
                          <Icon2 size={240} className="text-white z-10 relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                        </>
                      )
                    })()}
                  </>
                )}
              </motion.div>
          </div>

          {/* Slider Controls */}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/30 text-white rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all z-20 cursor-pointer shadow-xl"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide((prev) => (prev + 1) % activeSlides.length); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/30 text-white rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all z-20 cursor-pointer shadow-xl"
          >
            <ChevronRight size={28} />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {activeSlides.map((_, i) => (
              <div 
                key={i} 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide(i); }}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${i === currentSlide ? "bg-white w-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/30 w-3 hover:bg-white/60"}`}
              ></div>
            ))}
          </div>
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
            <div 
              className="h-full bg-white/50 transition-all duration-300" 
              style={{ width: `${((currentSlide + 1) / activeSlides.length) * 100}%` }}
            ></div>
          </div>
        </Link>
      </section>

      {/* Modern Card Categories (Mimicking the reference design) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {activeCards.map((card, idx) => {
            const CardIcon = getIcon(card.icon, "Monitor");
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Link
                  href={card.btnLink || "/store"}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                  className={`group relative flex flex-col justify-between h-full min-h-[280px] rounded-3xl overflow-hidden shadow-2xl text-white cursor-pointer block bg-gradient-to-br ${card.bg} border border-white/[0.08] hover:-translate-y-2 transition-transform duration-300`}
                >
                  {/* Background Icon (decorative) */}
                  <div className="absolute -right-8 -bottom-8 opacity-[0.07] group-hover:opacity-[0.14] group-hover:scale-110 transition-all duration-500">
                    <CardIcon size={200} strokeWidth={0.8} />
                  </div>

                  {/* Glow */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                  {/* Card Image */}
                  {card.image_url && (
                    <div className="absolute inset-0">
                      <Image src={card.image_url} alt={card.title} fill className="object-cover opacity-20 group-hover:opacity-30 transition-all duration-500 scale-105 group-hover:scale-110" />
                    </div>
                  )}

                  <div className="relative z-10 p-7 md:p-8 flex flex-col h-full">
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 self-start bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
                      <CardIcon size={12} />
                      {card.features?.[0]?.replace('•','').trim()}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-4 drop-shadow-xl tracking-tight" dangerouslySetInnerHTML={{ __html: card.title }}></h3>

                    {/* Features */}
                    <ul className="space-y-2 flex-1 mb-6">
                      {card.features?.slice(1).map((feat: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-center gap-2 text-sm text-white/80 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0"></span>
                          {feat.replace('•','').trim()}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center gap-3 border-t border-white/10 pt-5 mt-auto">
                      <span className="text-sm font-extrabold tracking-wide">{card.btnText}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          </motion.div>
      </section>

      {/* Services Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Neden Bizi Seçmelisiniz?</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow flex flex-col md:flex-row items-start gap-8"
          >
            <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Code size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Özel Yazılım Çözümleri</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                İşletmenizin ihtiyacına tam uyan, modern, hızlı ve yüksek performanslı özel yazılımlar geliştiriyoruz. Kurumsal süreçlerinizi dijitalleştirerek zaman ve maliyet tasarrufu sağlamanızı hedefliyoruz.
              </p>
              <Link href="/services/software" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-700 gap-2">
                Projelerimizi İncele <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow flex flex-col md:flex-row items-start gap-8"
          >
            <div className="bg-purple-50 text-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Laptop size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sıfır ve 2. El Teknoloji Ürünleri</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Kurumsal şirketlerden çıkması, 100% garantili, testleri tamamlanmış uygun fiyatlı ikinci el bilgisayarlar ve son teknoloji sıfır çevre birimlerini güvenli e-ticaret altyapımız ile adresinize kadar getiriyoruz.
              </p>
              <Link href="/store" className="inline-flex items-center font-bold text-purple-600 hover:text-purple-700 gap-2">
                Hemen Alışverişe Başla <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
}
