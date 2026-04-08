"use client";

import Link from "next/link";
import { ArrowRight, Code, Monitor, Laptop, Server, Map, Layers, Cpu } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

const iconMap: Record<string, any> = { Code, Monitor, Laptop, Server, Map, Layers, Cpu };

export default function FeatureCards({ cards }: { cards: any[] }) {
  const getIcon = useCallback((name: string, fallback: string = "Monitor") => {
    return iconMap[name] || iconMap[fallback] || Monitor;
  }, []);

  if (!cards || cards.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const CardIcon = getIcon(card.icon, "Monitor");
          return (
            <Link
              key={idx}
              href={card.btnLink || "/store"}
              className={`group relative flex flex-col justify-between min-h-[280px] rounded-3xl overflow-hidden shadow-2xl text-white bg-gradient-to-br ${card.bg} border border-white/[0.08] hover:-translate-y-2 transition-transform duration-300`}
            >
              <div className="absolute -right-8 -bottom-8 opacity-[0.07] group-hover:opacity-[0.14] group-hover:scale-110 transition-all duration-500">
                <CardIcon size={200} strokeWidth={0.8} />
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {card.image_url && (
                <div className="absolute inset-0">
                  <Image src={card.image_url} alt={card.title} fill className="object-cover opacity-20 group-hover:opacity-30 transition-all duration-500 scale-105 group-hover:scale-110" />
                </div>
              )}

              <div className="relative z-10 p-7 md:p-8 flex flex-col h-full">
                <div className="inline-flex items-center gap-2 self-start bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
                  <CardIcon size={12} />
                  {card.features?.[0]?.replace('•','').trim()}
                </div>

                <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-4 drop-shadow-xl tracking-tight">
                  {card.title.split(/<br\s*\/?>/i).map((part: string, i: number) => (
                    <span key={i}>{i > 0 && <br />}{part}</span>
                  ))}
                </h3>

                <ul className="space-y-2 flex-1 mb-6">
                  {card.features?.slice(1).map((feat: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-white/80 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                      {feat.replace('•','').trim()}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 border-t border-white/10 pt-5 mt-auto">
                  <span className="text-sm font-extrabold tracking-wide">{card.btnText}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
