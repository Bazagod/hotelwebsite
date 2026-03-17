"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, BedDouble, Filter } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { NewRoomModal } from "@/features/rooms/components/NewRoomModal";
import { roomsApi, type RoomFilters } from "@/features/rooms/services/rooms-api";
import type { Room } from "@/types/api";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
  { value: "reserved", label: "Reserved" },
  { value: "cleaning", label: "Cleaning" },
];

export default function RoomsPage() {
  const [filters, setFilters] = useState<RoomFilters>({ per_page: 20 });
  const [showNewModal, setShowNewModal] = useState(false);

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["rooms", filters],
    queryFn: () => roomsApi.list(filters),
  });

  const columns = [
    {
      key: "number",
      header: "Room",
      render: (room: Room) => (
        <div className="flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-luxury-gold" />
          <span className="font-medium text-white">{room.number}</span>
        </div>
      ),
    },
    {
      key: "room_type",
      header: "Type",
      render: (room: Room) => room.room_type?.name ?? "—",
    },
    { key: "floor", header: "Floor" },
    {
      key: "status",
      header: "Status",
      render: (room: Room) => <StatusBadge status={room.status} />,
    },
    {
      key: "is_clean",
      header: "Housekeeping",
      render: (room: Room) => (
        <span className={room.is_clean ? "text-emerald-400" : "text-amber-400"}>
          {room.is_clean ? "Clean" : "Needs cleaning"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Rate/Night",
      render: (room: Room) => (
        <span>${room.room_type?.base_price?.toFixed(2) ?? "—"}</span>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Room Management"
        subtitle={`${rooms?.meta?.total ?? 0} rooms total`}
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filters.status ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}
            className="h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-luxury-gold/50"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          <Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewModal(true)}>
            <Plus className="w-4 h-4" />
            Add Room
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rooms?.data ?? []}
        keyExtractor={(room) => room.id}
        isLoading={isLoading}
        emptyMessage="No rooms found. Add your first room to get started."
      />

      {rooms && rooms.meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: rooms.meta.last_page }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setFilters((f) => ({ ...f, page }))}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                page === rooms.meta.current_page
                  ? "bg-luxury-gold text-charcoal"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <NewRoomModal open={showNewModal} onClose={() => setShowNewModal(false)} />
    </>
  );
}
