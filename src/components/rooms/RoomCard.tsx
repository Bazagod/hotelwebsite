"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Room } from "@/lib/data/rooms";

interface RoomCardProps {
  room: Room;
  index?: number;
}

export function RoomCard({ room, index = 0 }: RoomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-white/10 bg-charcoal/60 hover:bg-charcoal/80 transition-all duration-500 hover:border-luxury-gold/30">
        <Link href={`/rooms/${room.slug}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={room.image}
              alt={room.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <span className="text-luxury-gold text-sm font-medium uppercase tracking-wider">
                {room.view}
              </span>
              <span className="text-cream/90 text-lg font-serif">
                From ${room.pricePerNight}
                <span className="text-sm font-sans font-normal">/night</span>
              </span>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="font-serif text-2xl text-cream group-hover:text-luxury-gold transition-colors">
              {room.name}
            </h3>
            <p className="mt-2 text-cream/70 text-sm line-clamp-2">
              {room.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-luxury-gold text-sm font-medium">
              <span>View details</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
