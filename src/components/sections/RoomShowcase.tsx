"use client";

import { motion } from "framer-motion";
import { RoomCard } from "@/components/rooms/RoomCard";
import { rooms } from "@/lib/data/rooms";

export function RoomShowcase() {
  return (
    <section id="rooms" className="py-24 lg:py-32 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
            Accommodation
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream font-light">
            Rooms & Suites
          </h2>
          <p className="mt-6 text-cream/80 text-lg">
            Each space is designed for comfort and elegance, with views of Lake
            Tanganyika or our lush gardens. Experience the finest hospitality in
            Bujumbura.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
