"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { NewStaffModal } from "@/features/staff/components/NewStaffModal";
import { staffApi, type StaffFilters } from "@/features/staff/services/staff-api";
import type { Staff } from "@/types/api";

export default function StaffPage() {
  const [filters] = useState<StaffFilters>({ per_page: 20 });
  const [search, setSearch] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);

  const { data: staffList, isLoading } = useQuery({
    queryKey: ["staff", filters, search],
    queryFn: () => staffApi.list({ ...filters, search: search || undefined }),
  });

  const columns = [
    {
      key: "full_name",
      header: "Name",
      render: (s: Staff) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
            <span className="text-luxury-gold text-xs font-medium">
              {s.first_name[0]}{s.last_name[0]}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{s.full_name}</p>
            {s.email && <p className="text-gray-500 text-xs">{s.email}</p>}
          </div>
        </div>
      ),
    },
    { key: "position", header: "Position" },
    {
      key: "department",
      header: "Department",
      render: (s: Staff) => s.department?.name ?? "—",
    },
    {
      key: "phone",
      header: "Phone",
      render: (s: Staff) => s.phone ?? "—",
    },
    { key: "hire_date", header: "Hire Date" },
    {
      key: "is_active",
      header: "Status",
      render: (s: Staff) => <StatusBadge status={s.is_active ? "active" : "inactive"} />,
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Staff Management"
        subtitle={`${staffList?.meta?.total ?? 0} team members`}
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff..."
            className="h-9 w-full pl-9 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-luxury-gold/50"
          />
        </div>
        <div className="ml-auto">
          <Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewModal(true)}>
            <Plus className="w-4 h-4" />
            Add Staff
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={staffList?.data ?? []}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        emptyMessage="No staff members found."
      />

      <NewStaffModal open={showNewModal} onClose={() => setShowNewModal(false)} />
    </>
  );
}
