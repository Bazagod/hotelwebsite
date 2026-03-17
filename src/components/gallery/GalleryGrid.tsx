"use client";

import Image from "next/image";
import { galleryImages } from "@/lib/data/gallery";
import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { useSiteContent } from "@/hooks/useSiteContent";

type GalleryImageType = {
  id: string;
  src: string;
  alt: string;
  category: string;
};

export function GalleryGrid() {
  const [filter, setFilter] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<GalleryImageType[]>([]);
  const { content } = useSiteContent();
  const sec = content?.sections?.gallery;

  const categories = [
    { key: null, label: "All" },
    { key: "rooms", label: "Rooms" },
    { key: "dining", label: "Dining" },
    { key: "lake", label: "Lake" },
    { key: "spa", label: "Spa" },
    { key: "events", label: "Events" },
    { key: "nature", label: "Nature" },
  ];

  useEffect(() => {
    fetch("/api/admin/images")
      .then((res) => res.ok && res.json())
      .then((data) => Array.isArray(data) && setUploadedImages(data))
      .catch(() => {});
  }, []);

  const allImages: GalleryImageType[] = [...galleryImages, ...uploadedImages];
  const filtered =
    filter === null
      ? allImages
      : allImages.filter((img) => img.category === filter);

  return (
    <section id="gallery" className="py-24 lg:py-32 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
            {sec?.subtitle ?? "Gallery"}
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream font-light">
            {sec?.title ?? "A glimpse of BAZAGOD"}
          </h2>
        </FadeIn>

        <FadeIn className="flex flex-wrap justify-center gap-2 mb-12">
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
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="relative aspect-[4/3] rounded-lg overflow-hidden group transition-all duration-300"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="absolute bottom-4 left-4 right-4 text-cream text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {img.alt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
