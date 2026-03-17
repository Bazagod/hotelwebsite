"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { useSiteContent } from "@/hooks/useSiteContent";

const BUJUMBURA_LAT = -3.3822;
const BUJUMBURA_LNG = 29.3644;
const EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=29.35%2C-3.4%2C29.38%2C-3.36&layer=mapnik&marker=${BUJUMBURA_LAT}%2C${BUJUMBURA_LNG}`;

export function MapSection() {
  const { content } = useSiteContent();
  const sec = content?.sections?.location;
  const hotel = content?.hotel;

  return (
    <section id="location" className="py-24 lg:py-32 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
            {sec?.subtitle ?? "Location"}
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream font-light">
            {sec?.title ?? "Find us in Bujumbura"}
          </h2>
          <p className="mt-6 text-cream/80 text-lg">
            {sec?.description ??
              "Avenue du Lac Tanganyika, on the shores of Lake Tanganyika. Minutes from Bujumbura International Airport and the city center."}
          </p>
        </FadeIn>

        <FadeIn>
          <div className="rounded-xl overflow-hidden border border-white/10 glass-dark aspect-[16/10] min-h-[300px]">
            <iframe
              title="BAZAGOD Hotel location - Bujumbura, Burundi"
              src={EMBED_URL}
              className="w-full h-full min-h-[300px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </FadeIn>
        <p className="mt-4 text-center text-cream/60 text-sm">
          {hotel?.address ?? "Avenue du Lac Tanganyika, Bujumbura, Burundi"} · {hotel?.phone ?? "+257 22 25 12 34"}
        </p>
      </div>
    </section>
  );
}
