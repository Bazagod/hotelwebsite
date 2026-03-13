"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image - Lake Tanganyika / luxury hotel vibe */}
      <div className="absolute inset-0">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/5/59/Bujumbura_%26_Lake_Tanganyika.JPG"
          alt="Bujumbura et le lac Tanganyika — BAZAGOD Hotel, Burundi"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-6"
        >
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium">
            Bujumbura · Lac Tanganyika
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-cream tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Where luxury meets
            <br />
            <span className="text-luxury-gold italic">the heart of Africa</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-cream/90 text-lg sm:text-xl max-w-2xl mx-auto font-light"
          >
            An exclusive retreat on the shores of Lake Tanganyika. Discover
            refined comfort in Burundi&apos;s most distinguished address.
          </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
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
            </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#rooms" className="flex flex-col items-center gap-2 text-cream/70 hover:text-luxury-gold transition-colors">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
