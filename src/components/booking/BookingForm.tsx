"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const SLUG_TO_TYPE: Record<string, string> = {
  "lake-tanganyika-suite": "Lake Tanganyika Suite",
  "bujumbura-executive": "Bujumbura Executive Room",
  "rusizi-garden-villa": "Rusizi Garden Villa",
  "karera-deluxe": "Karera Falls Deluxe",
  "karera-falls-deluxe": "Karera Falls Deluxe",
};

interface BookingFormProps {
  roomId?: string;
  roomName?: string;
  roomSlug?: string;
  className?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function BookingForm({ roomName, roomSlug, className }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const typeName = roomSlug ? SLUG_TO_TYPE[roomSlug] : undefined;

      const { data } = await axios.post(`${API_BASE}/public/booking`, {
        guest_first_name: firstName,
        guest_last_name: lastName,
        guest_email: email,
        guest_phone: phone || undefined,
        room_type_name: typeName || roomName,
        check_in_date: checkIn,
        check_out_date: checkOut,
        adults: parseInt(guests),
        special_requests: specialRequests || undefined,
        source: "website",
      });

      setConfirmationNumber(data.data?.confirmation_number || data.confirmation_number || "");
      setStatus("success");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Something went wrong. Please try again or contact us directly.");
      }
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={cn("text-center py-12 animate-fade-in", className)}>
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-serif text-2xl text-luxury-gold mb-2">Reservation confirmed</p>
        {confirmationNumber && (
          <p className="text-cream/80 text-lg mb-4">
            Confirmation: <span className="font-mono font-bold text-luxury-gold">{confirmationNumber}</span>
          </p>
        )}
        <p className="text-cream/60 max-w-md mx-auto">
          Thank you for choosing BAZAGOD Hotel. You will receive a confirmation email shortly.
          Our team will reach out within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("animate-fade-in-up", className)}>
      <Card className="glass-dark border-white/20 overflow-hidden">
        <CardHeader className="border-b border-white/10">
          <h3 className="font-serif text-xl text-cream">
            {roomName ? `Reserve: ${roomName}` : "Reservation request"}
          </h3>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-cream/80 mb-2">Check-in</label>
                <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm text-cream/80 mb-2">Check-out</label>
                <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">Guests</label>
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
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-cream/80 mb-2">First name</label>
                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
              </div>
              <div>
                <label className="block text-sm text-cream/80 mb-2">Last name</label>
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-cream/80 mb-2">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm text-cream/80 mb-2">Phone (optional)</label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+257 ..." />
              </div>
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">Special requests</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                className="flex w-full rounded-sm border border-white/20 bg-white/5 px-4 py-3 text-base text-cream focus:outline-none focus:ring-2 focus:ring-luxury-gold resize-none placeholder:text-cream/40"
                placeholder="Any special requests or preferences..."
              />
            </div>

            {status === "error" && errorMsg && (
              <div className="rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                {errorMsg}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting..." : "Send reservation request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
