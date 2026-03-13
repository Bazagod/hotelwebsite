"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-charcoal/90 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
            Testimonials
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream font-light">
            What our guests say
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-dark rounded-xl p-8 sm:p-12 min-h-[320px] flex flex-col justify-center relative">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-luxury-gold/30" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
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
                      unoptimized
                    />
                  </div>
                  <div className="text-left sm:text-center">
                    <p className="font-semibold text-cream">{t.name}</p>
                    <p className="text-sm text-cream/60">
                      {t.role} · {t.location}
                    </p>
                    <div className="flex gap-1 mt-1 justify-center sm:justify-start">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <span
                          key={i}
                          className="text-luxury-gold"
                          aria-hidden
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
                }
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
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
                onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
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
