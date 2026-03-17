"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { reservationsApi } from "@/features/reservations/services/reservations-api";
import { roomsApi } from "@/features/rooms/services/rooms-api";
import { getApiError } from "@/services/api-client";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewReservationModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    guest_first_name: "",
    guest_last_name: "",
    guest_email: "",
    guest_phone: "",
    room_type_id: "",
    check_in_date: "",
    check_out_date: "",
    adults: "1",
    children: "0",
    source: "direct",
    special_requests: "",
  });

  const { data: roomTypes } = useQuery({
    queryKey: ["room-types"],
    queryFn: () => roomsApi.listTypes(),
    enabled: open,
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await reservationsApi.create({
        guest_first_name: form.guest_first_name,
        guest_last_name: form.guest_last_name,
        guest_email: form.guest_email || undefined,
        guest_phone: form.guest_phone || undefined,
        room_type_id: parseInt(form.room_type_id),
        check_in_date: form.check_in_date,
        check_out_date: form.check_out_date,
        adults: parseInt(form.adults),
        children: parseInt(form.children),
        source: form.source,
        special_requests: form.special_requests || undefined,
      });
      toast.success("Reservation created successfully.");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
      setForm({
        guest_first_name: "", guest_last_name: "", guest_email: "", guest_phone: "",
        room_type_id: "", check_in_date: "", check_out_date: "",
        adults: "1", children: "0", source: "direct", special_requests: "",
      });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const selectedType = roomTypes?.data?.find((t) => t.id === parseInt(form.room_type_id));
  const nights =
    form.check_in_date && form.check_out_date
      ? Math.max(0, Math.ceil((new Date(form.check_out_date).getTime() - new Date(form.check_in_date).getTime()) / 86400000))
      : 0;
  const estimate = selectedType && nights > 0 ? nights * selectedType.base_price : null;

  return (
    <Modal open={open} onClose={onClose} title="New Reservation" description="Create a new guest reservation" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset className="space-y-3">
          <legend className="text-xs text-gray-500 uppercase tracking-wider mb-2">Guest Information</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name *</label>
              <Input value={form.guest_first_name} onChange={(e) => set("guest_first_name", e.target.value)} required className="bg-white/5 border-white/15 h-10" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Name *</label>
              <Input value={form.guest_last_name} onChange={(e) => set("guest_last_name", e.target.value)} required className="bg-white/5 border-white/15 h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <Input type="email" value={form.guest_email} onChange={(e) => set("guest_email", e.target.value)} className="bg-white/5 border-white/15 h-10" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <Input value={form.guest_phone} onChange={(e) => set("guest_phone", e.target.value)} className="bg-white/5 border-white/15 h-10" />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-xs text-gray-500 uppercase tracking-wider mb-2">Stay Details</legend>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Room Type *</label>
            <Select value={form.room_type_id} onChange={(e) => set("room_type_id", e.target.value)} required>
              <option value="">Select room type</option>
              {roomTypes?.data?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — ${t.base_price}/night (max {t.max_occupancy} guests)
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Check-in *</label>
              <Input type="date" value={form.check_in_date} onChange={(e) => set("check_in_date", e.target.value)} required className="bg-white/5 border-white/15 h-10" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Check-out *</label>
              <Input type="date" value={form.check_out_date} onChange={(e) => set("check_out_date", e.target.value)} required className="bg-white/5 border-white/15 h-10" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Adults *</label>
              <Select value={form.adults} onChange={(e) => set("adults", e.target.value)}>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Children</label>
              <Select value={form.children} onChange={(e) => set("children", e.target.value)}>
                {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Source</label>
              <Select value={form.source} onChange={(e) => set("source", e.target.value)}>
                <option value="direct">Direct</option>
                <option value="website">Website</option>
                <option value="ota">OTA</option>
                <option value="phone">Phone</option>
              </Select>
            </div>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Special Requests</label>
          <textarea
            value={form.special_requests}
            onChange={(e) => set("special_requests", e.target.value)}
            rows={2}
            className="flex w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 resize-none"
            placeholder="Early check-in, extra pillows, etc."
          />
        </div>

        {estimate !== null && (
          <div className="rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {nights} night{nights !== 1 ? "s" : ""} × ${selectedType?.base_price}/night
            </span>
            <span className="text-lg font-semibold text-luxury-gold">${estimate.toFixed(2)}</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Reservation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
