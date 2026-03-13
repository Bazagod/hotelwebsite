"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { galleryImages } from "@/lib/data/gallery";
import { useState } from "react";

export function GalleryGrid() {
  const [filter, setFilter] = useState<string | null>(null);
  const categories = [
    { key: null, label: "All" },
    { key: "rooms", label: "Rooms" },
    { key: "dining", label: "Dining" },
    { key: "lake", label: "Lake" },
    { key: "spa", label: "Spa" },
    { key: "events", label: "Events" },
    { key: "nature", label: "Nature" },
  ];
  const filtered =
    filter === null
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  return (
    <section id="gallery" className="py-24 lg:py-32 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
            Gallery
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream font-light">
            A glimpse of BAZAGOD
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.key ?? "all"}
              onClick={() => setFilter(cat.key)}
              className={`
                px-4 py-2 rounded-sm text-sm uppercase tracking-wider transition-colors
                ${
                  filter === cat.key
                    ? "bg-luxury-gold text-charcoal"
                    : "text-cream/80 hover:text-luxury-gold border border-white/20 hover:border-luxury-gold/50"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((img, index) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="absolute bottom-4 left-4 right-4 text-cream text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {img.alt}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
