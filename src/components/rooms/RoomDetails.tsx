"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, Maximize2, Bed } from "lucide-react";
import type { Room } from "@/lib/data/rooms";

interface RoomDetailsProps {
  room: Room;
}

export function RoomDetails({ room }: RoomDetailsProps) {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <Link
            href="/#rooms"
            className="inline-flex items-center gap-2 text-cream hover:text-luxury-gold transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to rooms
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {room.images.slice(1, 3).map((src, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={src}
                    alt={`${room.name} view ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-luxury-gold uppercase tracking-widest text-sm">
              {room.view}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-cream">
              {room.name}
            </h1>
            <p className="text-cream/80 text-lg leading-relaxed">
              {room.description}
            </p>

            <div className="flex flex-wrap gap-6 py-4 border-y border-white/10">
              <div className="flex items-center gap-2 text-cream/80">
                <Maximize2 className="w-5 h-5 text-luxury-gold" />
                <span>{room.size}</span>
              </div>
              <div className="flex items-center gap-2 text-cream/80">
                <Users className="w-5 h-5 text-luxury-gold" />
                <span>Up to {room.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-2 text-cream/80">
                <Bed className="w-5 h-5 text-luxury-gold" />
                <span>{room.bedType}</span>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl text-cream mb-3">Amenities</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-cream/80">
                {room.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-baseline gap-4 pt-4">
              <span className="font-serif text-3xl text-luxury-gold">
                ${room.pricePerNight}
              </span>
              <span className="text-cream/60">per night</span>
            </div>

            <a
              href="#booking"
              className="inline-flex items-center justify-center h-14 px-10 rounded-sm bg-luxury-gold text-charcoal hover:bg-luxury-gold-light font-medium transition-all hover:scale-[1.02]"
            >
              Reserve now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
