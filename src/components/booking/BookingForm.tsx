"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  roomId?: string;
  roomName?: string;
  className?: string;
}

export function BookingForm({ roomId, roomName, className }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-center py-12", className)}
      >
        <p className="font-serif text-2xl text-luxury-gold mb-2">
          Request received
        </p>
        <p className="text-cream/80">
          Our team will confirm your reservation at BAZAGOD within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="glass-dark border-white/20 overflow-hidden">
        <CardHeader className="border-b border-white/10">
          <h3 className="font-serif text-xl text-cream">
            {roomName ? `Reserve: ${roomName}` : "Reservation request"}
          </h3>
          {roomId && (
            <input type="hidden" name="roomId" value={roomId} />
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-cream/80 mb-2">
                  Check-in
                </label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-cream/80 mb-2">
                  Check-out
                </label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="flex h-12 w-full rounded-sm border border-white/20 bg-white/5 px-4 py-2 text-base text-cream focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">
                Full name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Send reservation request
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
