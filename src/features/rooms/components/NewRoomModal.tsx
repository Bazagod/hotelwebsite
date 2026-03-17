"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { roomsApi } from "@/features/rooms/services/rooms-api";
import { getApiError } from "@/services/api-client";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewRoomModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    number: "",
    room_type_id: "",
    floor: "1",
    status: "available",
    notes: "",
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
      await roomsApi.create({
        number: form.number,
        room_type_id: parseInt(form.room_type_id),
        floor: parseInt(form.floor),
        status: form.status,
        notes: form.notes || undefined,
      });
      toast.success("Room added successfully.");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
      setForm({ number: "", room_type_id: "", floor: "1", status: "available", notes: "" });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Room" description="Register a new room in the system">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Room Number *</label>
            <Input value={form.number} onChange={(e) => set("number", e.target.value)} required placeholder="e.g. 401" className="bg-white/5 border-white/15 h-10" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Floor *</label>
            <Select value={form.floor} onChange={(e) => set("floor", e.target.value)}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Floor {n}</option>)}
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Room Type *</label>
          <Select value={form.room_type_id} onChange={(e) => set("room_type_id", e.target.value)} required>
            <option value="">Select room type</option>
            {roomTypes?.data?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — ${t.base_price}/night
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Initial Status</label>
          <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={2}
            className="flex w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 resize-none"
            placeholder="Optional notes"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">{error}</div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Room"}</Button>
        </div>
      </form>
    </Modal>
  );
}
