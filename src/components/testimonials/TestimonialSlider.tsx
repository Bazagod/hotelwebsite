"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import { useSiteContent } from "@/hooks/useSiteContent";

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const { content } = useSiteContent();
  const sec = content?.sections?.testimonials;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
      setAnimKey((k) => k + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[current];

  const goTo = (i: number) => {
    setCurrent(i);
    setAnimKey((k) => k + 1);
  };

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-charcoal/90 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
            {sec?.subtitle ?? "Testimonials"}
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream font-light">
            {sec?.title ?? "What our guests say"}
          </h2>
        </FadeIn>

        <div className="max-w-4xl mx-auto">
          <div className="glass-dark rounded-xl p-8 sm:p-12 min-h-[320px] flex flex-col justify-center relative">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-luxury-gold/30" />
            <div key={animKey} className="text-center animate-fade-in">
              <p className="font-serif text-xl sm:text-2xl text-cream/95 leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-luxury-gold/50">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                    loading="lazy"
                  />
                </div>
                <div className="text-left sm:text-center">
                  <p className="font-semibold text-cream">{t.name}</p>
                  <p className="text-sm text-cream/60">
                    {t.role} · {t.location}
                  </p>
                  <div className="flex gap-1 mt-1 justify-center sm:justify-start">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-luxury-gold" aria-hidden>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length)}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === current ? "bg-luxury-gold w-6" : "bg-white/30 hover:bg-white/50"
                    )}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goTo((current + 1) % testimonials.length)}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
