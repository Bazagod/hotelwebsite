"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { NewReservationModal } from "@/features/reservations/components/NewReservationModal";
import { reservationsApi, type ReservationFilters } from "@/features/reservations/services/reservations-api";
import type { Reservation } from "@/types/api";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "checked_out", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
];

export default function ReservationsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ReservationFilters>({ per_page: 15 });
  const [search, setSearch] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations", filters, search],
    queryFn: () => reservationsApi.list({ ...filters, search: search || undefined }),
  });

  const handleAction = async (id: number, action: "confirm" | "checkIn" | "checkOut" | "cancel") => {
    try {
      const actions = {
        confirm: reservationsApi.confirm,
        checkIn: (resId: number) => reservationsApi.checkIn(resId),
        checkOut: reservationsApi.checkOut,
        cancel: reservationsApi.cancel,
      };
      await actions[action](id);
      toast.success(`Reservation ${action.replace(/([A-Z])/g, " $1").toLowerCase()}ed successfully.`);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch {
      toast.error("Action failed. Please try again.");
    }
  };

  const columns = [
    {
      key: "confirmation_number",
      header: "Confirmation",
      render: (r: Reservation) => (
        <span className="font-mono text-xs font-medium text-luxury-gold">{r.confirmation_number}</span>
      ),
    },
    {
      key: "guest",
      header: "Guest",
      render: (r: Reservation) => (
        <div>
          <p className="text-white">{r.guest?.full_name ?? "—"}</p>
          {r.guest?.email && <p className="text-gray-500 text-xs">{r.guest.email}</p>}
        </div>
      ),
    },
    {
      key: "room_type",
      header: "Room Type",
      render: (r: Reservation) => r.room_type?.name ?? "—",
    },
    {
      key: "room",
      header: "Room",
      render: (r: Reservation) => (
        <span className={r.room ? "text-white" : "text-gray-500 italic"}>
          {r.room?.number ?? "Unassigned"}
        </span>
      ),
    },
    { key: "check_in_date", header: "Check-in" },
    { key: "check_out_date", header: "Check-out" },
    {
      key: "status",
      header: "Status",
      render: (r: Reservation) => <StatusBadge status={r.status} />,
    },
    {
      key: "total_amount",
      header: "Total",
      render: (r: Reservation) => (
        <span className="font-medium">${Number(r.total_amount).toFixed(2)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r: Reservation) => (
        <div className="flex gap-1 justify-end">
          {r.status === "pending" && (
            <button
              onClick={() => handleAction(r.id, "confirm")}
              className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              Confirm
            </button>
          )}
          {r.status === "confirmed" && (
            <button
              onClick={() => handleAction(r.id, "checkIn")}
              className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              Check In
            </button>
          )}
          {r.status === "checked_in" && (
            <button
              onClick={() => handleAction(r.id, "checkOut")}
              className="text-xs px-2.5 py-1 rounded-md bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 transition-colors"
            >
              Check Out
            </button>
          )}
          {(r.status === "pending" || r.status === "confirmed") && (
            <button
              onClick={() => handleAction(r.id, "cancel")}
              className="text-xs px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Reservations"
        subtitle={`${reservations?.meta?.total ?? 0} total reservations`}
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or confirmation..."
            className="h-9 w-full pl-9 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-luxury-gold/50"
          />
        </div>
        <select
          value={filters.status ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}
          className="h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-luxury-gold/50"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="ml-auto">
          <Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewModal(true)}>
            <Plus className="w-4 h-4" />
            New Reservation
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={reservations?.data ?? []}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        emptyMessage="No reservations found."
      />

      {reservations && reservations.meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: reservations.meta.last_page }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setFilters((f) => ({ ...f, page }))}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                page === reservations.meta.current_page
                  ? "bg-luxury-gold text-charcoal"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <NewReservationModal open={showNewModal} onClose={() => setShowNewModal(false)} />
    </>
  );
}
