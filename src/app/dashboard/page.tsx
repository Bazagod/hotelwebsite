"use client";

import { useQuery } from "@tanstack/react-query";
import { BedDouble, LogIn, LogOut, DollarSign, Percent, AlertCircle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { dashboardApi } from "@/features/dashboard/services/dashboard-api";
import type { DashboardData } from "@/types/api";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getData,
  });

  const recentColumns = [
    {
      key: "confirmation_number",
      header: "Confirmation",
      render: (item: DashboardData["recent_reservations"][0]) => (
        <span className="font-mono text-xs font-medium text-luxury-gold">{item.confirmation_number}</span>
      ),
    },
    { key: "guest_name", header: "Guest" },
    { key: "room_type", header: "Room Type" },
    { key: "check_in", header: "Check-in" },
    { key: "check_out", header: "Check-out" },
    {
      key: "status",
      header: "Status",
      render: (item: DashboardData["recent_reservations"][0]) => (
        <StatusBadge status={item.status} />
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (item: DashboardData["recent_reservations"][0]) => (
        <span className="font-medium">${item.total.toFixed(2)}</span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-white/5 rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <>
        <DashboardHeader title="Dashboard" />
        <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 font-medium mb-1">Failed to load dashboard</p>
          <p className="text-gray-500 text-sm mb-4">
            Make sure the Laravel API is running at the configured URL.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        subtitle={`Welcome back. Here's your hotel overview for ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Rooms" value={data?.rooms.total ?? 0} icon={BedDouble} />
        <StatCard
          title="Occupied"
          value={data?.rooms.occupied ?? 0}
          subtitle={`${data?.rooms.available ?? 0} available`}
          icon={BedDouble}
        />
        <StatCard title="Occupancy" value={`${data?.rooms.occupancy_rate ?? 0}%`} icon={Percent} />
        <StatCard title="Arrivals" value={data?.reservations.today_arrivals ?? 0} icon={LogIn} />
        <StatCard title="Departures" value={data?.reservations.today_departures ?? 0} icon={LogOut} />
        <StatCard
          title="Revenue"
          value={`$${(data?.revenue.monthly ?? 0).toLocaleString()}`}
          subtitle="This month"
          icon={DollarSign}
        />
      </div>

      {data?.occupancy_trend && (
        <div className="mb-8">
          <OccupancyChart data={data.occupancy_trend} totalRooms={data.rooms.total} />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Recent Reservations</h2>
          {(data?.reservations.pending ?? 0) > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
              {data?.reservations.pending} pending
            </span>
          )}
        </div>
        <DataTable
          columns={recentColumns}
          data={data?.recent_reservations ?? []}
          keyExtractor={(item) => item.id}
          emptyMessage="No recent reservations."
        />
      </div>
    </>
  );
}
