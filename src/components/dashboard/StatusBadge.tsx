import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  occupied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  maintenance: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  reserved: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  cleaning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  checked_in: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  checked_out: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  no_show: "bg-red-500/10 text-red-400 border-red-500/20",
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  partial: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  refunded: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
