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
      title: "2.EL KURUMSAL BİLGİSAYARLAR",
      subtitle: "Fırsat Ürünleri",
      desc: "Kurumsal Performans, Uygun Maliyet. Tüm testleri yapılmış, 3 ay garantili ürünleri hemen inceleyin.",
      bg: "from-slate-800 to-slate-900",
      accent: "text-blue-400",
      btnText: "Hemen İncele",
      Icon1: Server,
      Icon2: Monitor,
    },
    {
      title: "SIFIR OYUNCU KASALARI",
      subtitle: "Yeni Nesil",
      desc: "Oyunlarda en yüksek performansı alın. Garantili sıfır sistemlerle kesintisiz gücü hissedin.",
      bg: "from-indigo-900 to-purple-900",
      accent: "text-purple-400",
      btnText: "Sistemleri Gör",
      Icon1: Server,
      Icon2: Cpu,
    },
    {
      title: "ÖZEL YAZILIM ÇÖZÜMLERİ",
      subtitle: "Kurumsal",
      desc: "İşletmenize özel web yazılımları, uygulamalar ve uçtan uca dijital çözümler üretiyoruz.",
      bg: "from-emerald-900 to-teal-900",
      accent: "text-emerald-400",
      btnText: "Bize Ulaşın",
      Icon1: Code,
      Icon2: Laptop,
    }
  ];

  const defaultCards = [
    {
      title: "2.EL MASAÜSTÜ <br/> BİLGİSAYARLAR",
      features: ["• Çıkışlı Kurumsal", "• Temiz Kondisyon", "• Hızlı Kargo"],
      bg: "from-blue-400 to-blue-500",
      icon: "Monitor",
      btnText: "ÜRÜNLERİ GÖR",
      btnLink: "/store",
    },
    {
      title: "2.EL ALL IN ONE <br/> BİLGİSAYARLAR",
      features: ["• Kompakt Tasarım", "• Ofis İçin İdeal", "• Garantili"],
      bg: "from-orange-400 to-orange-500",
      icon: "Layers",
      btnText: "ÜRÜNLERİ GÖR",
      btnLink: "/store",
    },
    {
      title: "YAZILIM <br/> ÇÖZÜMLERİ",
      features: ["• Web Siteleri", "• E-Ticaret / Kurumsal", "• Hızlı Teslimat"],
      bg: "from-emerald-400 to-emerald-500",
      icon: "Code",
      btnText: "PAKETLERİ GÖR",
      btnLink: "/yazilim-cozumleri",
    },
    {
      title: "2.EL MİNİ OFİS <br/> BİLGİSAYARLARI",
      features: ["• Sessiz • Az Yer Kaplar", "• Kurumsal Kullanım", "• Garantili Tüketim"],
      bg: "from-purple-500 to-purple-600",
      icon: "Server",
      btnText: "ÜRÜNLERİ GÖR",
      btnLink: "/store",
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
        <div 
          className={`relative w-full h-[400px] md:h-[500px] bg-gradient-to-r ${activeSlide.bg} rounded-2xl overflow-hidden shadow-2xl group flex items-center transition-colors duration-1000`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Abstract particles/glow */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 px-8 md:px-16 md:w-2/3">
            <motion.div 
              key={currentSlide} 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.7 }}
            >
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs uppercase tracking-widest rounded-full mb-4">
                {activeSlide.subtitle}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                {activeSlide.title.split(' ').slice(0, 2).join(' ')} <br />
                <span className={activeSlide.accent}>{activeSlide.title.split(' ').slice(2).join(' ')}</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg">
                {activeSlide.desc}
              </p>
              <Link href={activeSlide.btnLink || "/store"} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-blue-500/30 transition-all">
                {activeSlide.btnText} <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
          
          {/* Decorative/Image Placeholder on the Right */}
          <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 justify-center items-center drop-shadow-2xl">
              <motion.div key={`bg-${currentSlide}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
                {activeSlide.image_url ? (
                  <div className="relative w-64 h-64 md:w-80 md:h-80 z-10 flex items-center justify-center">
                    <Image src={activeSlide.image_url} alt="Slider Image" width={320} height={320} className="object-contain max-h-full drop-shadow-2xl" />
                  </div>
                ) : (
                  <>
                    {(() => {
                      const Icon1 = activeSlide.Icon1 ? getIcon(activeSlide.Icon1) : getIcon("Server");
                      const Icon2 = activeSlide.Icon2 ? getIcon(activeSlide.Icon2) : getIcon("Monitor");
                      return (
                        <>
                          <Icon1 size={250} className="text-slate-700/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          <Icon2 size={160} className="text-white z-10 relative" />
                        </>
                      )
                    })()}
                  </>
                )}
              </motion.div>
          </div>

          {/* Slider Controls */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {activeSlides.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full cursor-pointer transition-all ${i === currentSlide ? "bg-white w-6" : "bg-white/40 w-2 hover:bg-white/70"}`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Card Categories (Mimicking the reference design) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {activeCards.map((card, idx) => {
            const CardIcon = getIcon(card.icon, "Monitor");
            return (
              <motion.div key={idx} variants={itemVariants} className={`bg-gradient-to-br ${card.bg} p-6 rounded-3xl text-white shadow-lg overflow-hidden relative group hover:-translate-y-1 transition-transform`}>
                <CardIcon size={100} className="absolute -right-4 -bottom-4 text-white/20 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold uppercase mb-2" dangerouslySetInnerHTML={{ __html: card.title }}></h3>
                <ul className="text-xs font-medium text-white/80 mb-6 space-y-1">
                  {card.features.map((feat: string, fIdx: number) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>
                <Link href={card.btnLink} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-bold border border-white/20 transition-colors inline-flex items-center gap-2 mt-auto">
                  {card.btnText} <ChevronRight size={16} />
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
