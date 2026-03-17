"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Building2, Users, Clock } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { conferenceApi, type ConferenceRoom, type ConferenceBooking } from "@/features/conference/services/conference-api";
import { getApiError } from "@/services/api-client";
import toast from "react-hot-toast";

type Tab = "bookings" | "rooms";

export default function ConferencePage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("bookings");
  const [statusFilter, setStatusFilter] = useState("");
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [showNewRoom, setShowNewRoom] = useState(false);

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["conference-bookings", statusFilter],
    queryFn: () => conferenceApi.getBookings({ status: statusFilter || undefined }),
    enabled: tab === "bookings",
  });

  const { data: rooms } = useQuery({
    queryKey: ["conference-rooms"],
    queryFn: () => conferenceApi.getRooms(),
  });

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await conferenceApi.updateBookingStatus(id, status);
      toast.success("Booking status updated.");
      queryClient.invalidateQueries({ queryKey: ["conference-bookings"] });
    } catch { toast.error("Failed to update."); }
  };

  const bookingColumns = [
    { key: "event_name", header: "Event", render: (b: ConferenceBooking) => <span className="text-white font-medium">{b.event_name}</span> },
    { key: "room", header: "Room", render: (b: ConferenceBooking) => b.conference_room?.name ?? "—" },
    { key: "organizer", header: "Organizer", render: (b: ConferenceBooking) => (
      <div><p className="text-white text-sm">{b.organizer_name}</p>{b.organizer_email && <p className="text-gray-500 text-xs">{b.organizer_email}</p>}</div>
    )},
    { key: "date", header: "Date" },
    { key: "time", header: "Time", render: (b: ConferenceBooking) => `${b.start_time?.slice(0, 5)} — ${b.end_time?.slice(0, 5)}` },
    { key: "attendees", header: "Guests", render: (b: ConferenceBooking) => <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gray-400" />{b.attendees}</span> },
    { key: "total_amount", header: "Total", render: (b: ConferenceBooking) => <span className="font-medium">${Number(b.total_amount).toFixed(2)}</span> },
    { key: "status", header: "Status", render: (b: ConferenceBooking) => <StatusBadge status={b.status} /> },
    { key: "actions", header: "", render: (b: ConferenceBooking) => (
      <div className="flex gap-1 justify-end">
        {b.status === "pending" && <button onClick={() => handleStatusChange(b.id, "confirmed")} className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Confirm</button>}
        {b.status === "confirmed" && <button onClick={() => handleStatusChange(b.id, "completed")} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">Complete</button>}
        {(b.status === "pending" || b.status === "confirmed") && <button onClick={() => handleStatusChange(b.id, "cancelled")} className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20">Cancel</button>}
      </div>
    )},
  ];

  return (
    <>
      <DashboardHeader title="Conference & Events" subtitle="Manage meeting rooms and event bookings" />
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
        {(["bookings", "rooms"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-luxury-gold/20 text-luxury-gold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {t === "bookings" ? "Bookings" : "Rooms"}
          </button>
        ))}
      </div>

      {tab === "bookings" && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-sm text-gray-300">
              <option value="">All Statuses</option>
              {["pending", "confirmed", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <div className="ml-auto"><Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewBooking(true)}><Plus className="w-4 h-4" />New Booking</Button></div>
          </div>
          <DataTable columns={bookingColumns} data={bookings?.data ?? []} keyExtractor={(b) => b.id} isLoading={bookingsLoading} emptyMessage="No bookings yet." />
        </>
      )}

      {tab === "rooms" && (
        <>
          <div className="flex justify-end mb-6"><Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewRoom(true)}><Plus className="w-4 h-4" />Add Room</Button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(rooms?.data ?? []).map((r: ConferenceRoom) => (
              <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 mb-3"><Building2 className="w-5 h-5 text-luxury-gold" /><h3 className="text-white font-medium text-lg">{r.name}</h3></div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400"><Users className="w-4 h-4" />Capacity: {r.capacity}</div>
                  <div className="flex items-center gap-2 text-gray-400"><Clock className="w-4 h-4" />${Number(r.hourly_rate).toFixed(0)}/hr · ${Number(r.daily_rate).toFixed(0)}/day</div>
                  {r.equipment && r.equipment.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">{r.equipment.map((eq, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-gray-400">{eq}</span>)}</div>
                  )}
                </div>
              </div>
            ))}
            {(rooms?.data ?? []).length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No conference rooms. Add one to get started.</p>}
          </div>
        </>
      )}

      <NewBookingModal open={showNewBooking} onClose={() => setShowNewBooking(false)} rooms={rooms?.data ?? []} />
      <NewRoomModal open={showNewRoom} onClose={() => setShowNewRoom(false)} />
    </>
  );
}

function NewRoomModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", capacity: "", hourly_rate: "", daily_rate: "", description: "", equipment: "" });
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await conferenceApi.createRoom({ name: form.name, capacity: parseInt(form.capacity), hourly_rate: parseFloat(form.hourly_rate), daily_rate: parseFloat(form.daily_rate), description: form.description || undefined, equipment: form.equipment ? form.equipment.split(",").map((s) => s.trim()) : undefined });
      toast.success("Room added."); qc.invalidateQueries({ queryKey: ["conference-rooms"] }); onClose(); setForm({ name: "", capacity: "", hourly_rate: "", daily_rate: "", description: "", equipment: "" });
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Add Conference Room">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Name *</label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Tanganyika Hall" className="bg-white/5 border-white/15 h-10" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Capacity *</label><Input type="number" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-gray-400 mb-1">Hourly Rate ($) *</label><Input type="number" step="0.01" value={form.hourly_rate} onChange={(e) => set("hourly_rate", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Daily Rate ($) *</label><Input type="number" step="0.01" value={form.daily_rate} onChange={(e) => set("daily_rate", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        </div>
        <div><label className="block text-sm text-gray-400 mb-1">Equipment (comma-separated)</label><Input value={form.equipment} onChange={(e) => set("equipment", e.target.value)} placeholder="Projector, Whiteboard, Sound system" className="bg-white/5 border-white/15 h-10" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Description</label><Input value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? "..." : "Add Room"}</Button></div>
      </form>
    </Modal>
  );
}

function NewBookingModal({ open, onClose, rooms }: { open: boolean; onClose: () => void; rooms: ConferenceRoom[] }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ conference_room_id: "", organizer_name: "", organizer_email: "", event_name: "", date: "", start_time: "09:00", end_time: "17:00", attendees: "" });
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const selectedRoom = rooms.find((r) => r.id === parseInt(form.conference_room_id));
  const hours = form.start_time && form.end_time ? Math.max(0, (parseInt(form.end_time.split(":")[0]) - parseInt(form.start_time.split(":")[0]))) : 0;
  const estimate = selectedRoom && hours > 0 ? hours * Number(selectedRoom.hourly_rate) : null;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await conferenceApi.createBooking({ conference_room_id: parseInt(form.conference_room_id), organizer_name: form.organizer_name, organizer_email: form.organizer_email || undefined, event_name: form.event_name, date: form.date, start_time: form.start_time, end_time: form.end_time, attendees: parseInt(form.attendees) });
      toast.success("Booking created."); qc.invalidateQueries({ queryKey: ["conference-bookings"] }); onClose(); setForm({ conference_room_id: "", organizer_name: "", organizer_email: "", event_name: "", date: "", start_time: "09:00", end_time: "17:00", attendees: "" });
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="New Booking" className="max-w-2xl">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Conference Room *</label>
          <Select value={form.conference_room_id} onChange={(e) => set("conference_room_id", e.target.value)} required><option value="">Select room</option>{rooms.map((r) => <option key={r.id} value={r.id}>{r.name} (cap. {r.capacity})</option>)}</Select>
        </div>
        <div><label className="block text-sm text-gray-400 mb-1">Event Name *</label><Input value={form.event_name} onChange={(e) => set("event_name", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-gray-400 mb-1">Organizer Name *</label><Input value={form.organizer_name} onChange={(e) => set("organizer_name", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Organizer Email</label><Input type="email" value={form.organizer_email} onChange={(e) => set("organizer_email", e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-gray-400 mb-1">Date *</label><Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Start *</label><Input type="time" value={form.start_time} onChange={(e) => set("start_time", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">End *</label><Input type="time" value={form.end_time} onChange={(e) => set("end_time", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        </div>
        <div><label className="block text-sm text-gray-400 mb-1">Attendees *</label><Input type="number" value={form.attendees} onChange={(e) => set("attendees", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        {estimate !== null && (
          <div className="rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-400">{hours}h × ${Number(selectedRoom?.hourly_rate).toFixed(0)}/hr</span>
            <span className="text-lg font-semibold text-luxury-gold">${estimate.toFixed(2)}</span>
          </div>
        )}
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? "..." : "Create Booking"}</Button></div>
      </form>
    </Modal>
  );
}
