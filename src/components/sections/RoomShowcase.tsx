"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { RoomCard } from "@/components/rooms/RoomCard";
import { rooms } from "@/lib/data/rooms";
import { useSiteContent } from "@/hooks/useSiteContent";

export function RoomShowcase() {
  const { content } = useSiteContent();
  const sec = content?.sections?.rooms;

  return (
    <section id="rooms" className="py-24 lg:py-32 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
            {sec?.subtitle ?? "Rooms"}
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream font-light">
            {sec?.title ?? "Our Rooms & Suites"}
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
