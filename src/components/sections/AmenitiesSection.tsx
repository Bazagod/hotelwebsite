"use client";

import {
  Waves,
  Sparkles,
  UtensilsCrossed,
  Umbrella,
  Dumbbell,
  Compass,
} from "lucide-react";
import { amenities } from "@/lib/data/amenities";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  waves: Waves,
  spa: Sparkles,
  utensils: UtensilsCrossed,
  "umbrella-beach": Umbrella,
  dumbbell: Dumbbell,
  compass: Compass,
};

export function AmenitiesSection() {
  const { content } = useSiteContent();
  const sec = content?.sections?.amenities;

  return (
    <section id="amenities" className="py-24 lg:py-32 bg-charcoal/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
            {sec?.subtitle ?? "Experiences"}
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream font-light">
            {sec?.title ?? "Hotel amenities"}
          </h2>
          <p className="mt-6 text-cream/80 text-lg">
            {sec?.description ??
              "From our infinity pool overlooking Lake Tanganyika to the spa and private beach\u2014every detail is designed for your comfort."}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => {
            const Icon = iconMap[amenity.icon] ?? Compass;
            return (
              <FadeIn key={amenity.id} delay={index * 0.08}>
                <div
                  className={cn(
                    "glass-dark rounded-lg p-8 border border-white/10 h-full",
                    "hover:border-luxury-gold/30 transition-colors duration-300"
                  )}
                >
                  <div className="w-12 h-12 rounded-lg bg-luxury-gold/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <h3 className="font-serif text-xl text-cream mb-2">
                    {amenity.title}
                  </h3>
                  <p className="text-cream/70 text-sm leading-relaxed">
                    {amenity.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
