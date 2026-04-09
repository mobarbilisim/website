"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Server } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Code, Monitor, Laptop, Map, Layers, Cpu } from "lucide-react";

const iconMap: Record<string, any> = { Code, Monitor, Laptop, Server, Map, Layers, Cpu };

export default function HeroSlider({ initialSlides }: { initialSlides: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Auto-slide
  // Auto-slide & Scroll-to-top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isHovered || !initialSlides || initialSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % initialSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, initialSlides]);

  if (!initialSlides || initialSlides.length === 0) return null;

  const activeSlide = initialSlides[currentSlide] || initialSlides[0];

  const getIcon = useCallback((name: string, fallback: string = "Server") => {
    return iconMap[name] || iconMap[fallback] || Server;
  }, []);

  const Icon1 = getIcon(activeSlide.Icon1 || "Server");
  const Icon2 = getIcon(activeSlide.Icon2 || "Monitor");

  return (
    <section className="w-full max-w-[1400px] w-[97%] mx-auto mt-4 md:mt-8">
      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button') || target.closest('[data-slider-dot]')) return;
          router.push(activeSlide.btnLink || "/store");
        }}
        className={`relative w-full h-[450px] md:h-[550px] bg-gradient-to-br ${activeSlide.bg} rounded-3xl overflow-hidden shadow-2xl group flex items-center transition-colors duration-1000 border border-white/10 cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-0 right-1/4 w-1/2 h-full bg-white/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 px-8 md:px-16 w-full md:w-3/5" key={currentSlide}>
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full mb-6 shadow-sm">
            {activeSlide.subtitle}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-2xl tracking-tight">
            {activeSlide.title.split(' ').slice(0, 2).join(' ')} <br />
             <span className={activeSlide.accent}>{activeSlide.title.split(' ').slice(2).join(' ')}</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-50/80 mb-10 max-w-lg font-medium leading-relaxed drop-shadow-md">
            {activeSlide.desc}
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-extrabold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              {activeSlide.btnText} <ArrowRight size={20} className="text-blue-600" />
            </span>
            <div className="hidden sm:flex text-white/50 text-sm font-semibold tracking-wider uppercase ml-4 items-center gap-2">
              <span className="w-8 h-px bg-white/30 hidden md:block" /> KEŞFET
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute right-0 top-0 h-full w-2/5 justify-end items-center overflow-hidden pr-10 pointer-events-none">
          <div className="relative flex items-center justify-center w-full h-full" key={`icon-${currentSlide}`}>
            {activeSlide.image_url ? (
              <Image src={activeSlide.image_url} alt="Slider" fill priority className="object-contain drop-shadow-2xl p-4 scale-110" sizes="(max-width: 768px) 100vw, 40vw" />
            ) : (
              <>
                <Icon1 size={400} className="text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 blur-sm" />
                <Icon2 size={240} className="text-white z-10 relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
              </>
            )}
          </div>
        </div>

        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault(); e.stopPropagation();
            setCurrentSlide((prev) => (prev - 1 + initialSlides.length) % initialSlides.length);
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/30 text-white rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all z-30 cursor-pointer shadow-xl"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          type="button"
          onClick={(e) => {
             e.preventDefault(); e.stopPropagation();
             setCurrentSlide((prev) => (prev + 1) % initialSlides.length);
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/30 text-white rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all z-30 cursor-pointer shadow-xl"
        >
          <ChevronRight size={28} />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {initialSlides.map((_, i) => (
            <div
              key={i}
              data-slider-dot="true"
              onClick={(e) => {
                 e.stopPropagation();
                 setCurrentSlide(i);
              }}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${i === currentSlide ? "bg-white w-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/30 w-3 hover:bg-white/60"}`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <div className="h-full bg-white/50 transition-all duration-300" style={{ width: `${((currentSlide + 1) / initialSlides.length) * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
