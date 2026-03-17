"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const DEFAULT_BG = "https://upload.wikimedia.org/wikipedia/commons/5/59/Bujumbura_%26_Lake_Tanganyika.JPG";

export function HeroSection() {
  const { content } = useSiteContent();
  const hero = content?.hero;

  const bgImage = hero?.backgroundImage || DEFAULT_BG;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="BAZAGOD Hotel, Bujumbura — Lac Tanganyika, Burundi"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 animate-fade-in-up">
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium">
            {hero?.subtitle ?? "Bujumbura · Lac Tanganyika"}
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-cream tracking-tight max-w-5xl mx-auto leading-[1.1]">
            {hero?.titleLine1 ?? "Where luxury meets"}
            <br />
            <span className="text-luxury-gold italic">
              {hero?.titleLine2 ?? "the heart of Africa"}
            </span>
          </h1>
          <p
            className="text-cream/90 text-lg sm:text-xl max-w-2xl mx-auto font-light animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {hero?.description ??
              "An exclusive retreat on the shores of Lake Tanganyika. Discover refined comfort in Burundi\u2019s most distinguished address."}
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up"
            style={{ animationDelay: "0.9s" }}
          >
            <Link
              href="/#booking"
              className="inline-flex items-center justify-center h-14 px-10 text-base rounded-sm bg-luxury-gold text-charcoal hover:bg-luxury-gold-light font-medium transition-all hover:scale-[1.02]"
            >
              Reserve your stay
            </Link>
            <Link
              href="/#rooms"
              className="inline-flex items-center justify-center h-14 px-10 text-base rounded-sm border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 font-medium transition-all"
            >
              Explore rooms
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1.5s" }}>
        <a href="#rooms" className="flex flex-col items-center gap-2 text-cream/70 hover:text-luxury-gold transition-colors">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
