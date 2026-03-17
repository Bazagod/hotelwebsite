"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BedDouble, CalendarCheck, Users, ChefHat,
  Package, DollarSign, Building2, Settings, LogOut, ChevronLeft,
  ChevronRight, Menu, X, Globe,
} from "lucide-react";
import { useState, useEffect, createContext, useContext } from "react";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Rooms", href: "/dashboard/rooms", icon: BedDouble },
  { name: "Reservations", href: "/dashboard/reservations", icon: CalendarCheck },
  { name: "Staff", href: "/dashboard/staff", icon: Users },
  { name: "Restaurant", href: "/dashboard/restaurant", icon: ChefHat },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Accounting", href: "/dashboard/accounting", icon: DollarSign },
  { name: "Conference", href: "/dashboard/conference", icon: Building2 },
  { name: "Website", href: "/dashboard/website", icon: Globe },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarContextValue {
  collapsed: boolean;
  mobileOpen: boolean;
}

const SidebarContext = createContext<SidebarContextValue>({ collapsed: false, mobileOpen: false });
export const useSidebar = () => useContext(SidebarContext);

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 shrink-0">
        {!collapsed && (
          <Link href="/dashboard" className="font-serif text-xl text-luxury-gold font-semibold">
            BAZAGOD
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors hidden lg:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-luxury-gold/20 text-luxury-gold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3 shrink-0">
        {!collapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-white truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <SidebarContext.Provider value={{ collapsed, mobileOpen }}>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0f172a] border border-white/10 text-gray-400 hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-[#0f172a] border-r border-white/10 flex flex-col transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-[#0f172a] border-r border-white/10 transition-all duration-300 flex-col hidden lg:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </SidebarContext.Provider>
  );
}
