"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ChefHat } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { restaurantApi, type RestaurantOrder, type MenuItem } from "@/features/restaurant/services/restaurant-api";
import { getApiError } from "@/services/api-client";
import toast from "react-hot-toast";

type Tab = "orders" | "menu" | "categories";

export default function RestaurantPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("orders");
  const [statusFilter, setStatusFilter] = useState("");
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["restaurant-orders", statusFilter],
    queryFn: () => restaurantApi.getOrders({ status: statusFilter || undefined }),
    enabled: tab === "orders",
  });

  const { data: menu, isLoading: menuLoading } = useQuery({
    queryKey: ["restaurant-menu"],
    queryFn: () => restaurantApi.getMenu(),
    enabled: tab === "menu",
  });

  const { data: categories } = useQuery({
    queryKey: ["restaurant-categories"],
    queryFn: () => restaurantApi.getCategories(),
  });

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await restaurantApi.updateOrderStatus(id, status);
      toast.success("Order status updated.");
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });
    } catch { toast.error("Failed to update order."); }
  };

  const orderColumns = [
    { key: "order_number", header: "Order #", render: (o: RestaurantOrder) => <span className="font-mono text-xs text-luxury-gold">{o.order_number}</span> },
    { key: "table_number", header: "Table", render: (o: RestaurantOrder) => o.table_number || "—" },
    { key: "items_count", header: "Items", render: (o: RestaurantOrder) => o.items?.length ?? 0 },
    { key: "total_amount", header: "Total", render: (o: RestaurantOrder) => <span className="font-medium">${Number(o.total_amount).toFixed(2)}</span> },
    { key: "status", header: "Status", render: (o: RestaurantOrder) => <StatusBadge status={o.status} /> },
    {
      key: "actions", header: "", render: (o: RestaurantOrder) => (
        <div className="flex gap-1 justify-end">
          {o.status === "open" && <button onClick={() => handleStatusChange(o.id, "preparing")} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">Prepare</button>}
          {o.status === "preparing" && <button onClick={() => handleStatusChange(o.id, "served")} className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Served</button>}
          {o.status === "served" && <button onClick={() => handleStatusChange(o.id, "closed")} className="text-xs px-2 py-1 rounded bg-gray-500/10 text-gray-300 hover:bg-gray-500/20">Close</button>}
        </div>
      ),
    },
  ];

  const menuColumns = [
    { key: "name", header: "Item", render: (m: MenuItem) => <span className="text-white font-medium">{m.name}</span> },
    { key: "category", header: "Category", render: (m: MenuItem) => m.category?.name ?? "—" },
    { key: "price", header: "Price", render: (m: MenuItem) => <span>${Number(m.price).toFixed(2)}</span> },
    { key: "is_available", header: "Status", render: (m: MenuItem) => <StatusBadge status={m.is_available ? "available" : "unavailable"} /> },
  ];

  return (
    <>
      <DashboardHeader title="Restaurant & POS" subtitle="Manage menu, orders, and service" />
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
        {(["orders", "menu", "categories"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-luxury-gold/20 text-luxury-gold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {t === "orders" ? "Orders" : t === "menu" ? "Menu Items" : "Categories"}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-sm text-gray-300">
              <option value="">All Statuses</option>
              {["open", "preparing", "served", "closed", "cancelled"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <div className="ml-auto">
              <Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewOrder(true)}><Plus className="w-4 h-4" />New Order</Button>
            </div>
          </div>
          <DataTable columns={orderColumns} data={orders?.data ?? []} keyExtractor={(o) => o.id} isLoading={ordersLoading} emptyMessage="No orders yet." />
        </>
      )}

      {tab === "menu" && (
        <>
          <div className="flex justify-end mb-6">
            <Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewItem(true)}><Plus className="w-4 h-4" />Add Menu Item</Button>
          </div>
          <DataTable columns={menuColumns} data={menu?.data ?? []} keyExtractor={(m) => m.id} isLoading={menuLoading} emptyMessage="No menu items. Add your first item." />
        </>
      )}

      {tab === "categories" && (
        <>
          <div className="flex justify-end mb-6">
            <Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewCat(true)}><Plus className="w-4 h-4" />Add Category</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(categories?.data ?? []).map((c: { id: number; name: string; items_count?: number }) => (
              <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 mb-2"><ChefHat className="w-5 h-5 text-luxury-gold" /><h3 className="text-white font-medium">{c.name}</h3></div>
                <p className="text-gray-500 text-sm">{c.items_count ?? 0} items</p>
              </div>
            ))}
            {(categories?.data ?? []).length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No categories yet.</p>}
          </div>
        </>
      )}

      <NewOrderModal open={showNewOrder} onClose={() => setShowNewOrder(false)} menu={menu?.data ?? []} />
      <NewMenuItemModal open={showNewItem} onClose={() => setShowNewItem(false)} categories={categories?.data ?? []} />
      <NewCategoryModal open={showNewCat} onClose={() => setShowNewCat(false)} />
    </>
  );
}

function NewCategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await restaurantApi.createCategory({ name }); toast.success("Category created."); qc.invalidateQueries({ queryKey: ["restaurant-categories"] }); onClose(); setName(""); }
    catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="New Category">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Name *</label><Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button></div>
      </form>
    </Modal>
  );
}

function NewMenuItemModal({ open, onClose, categories }: { open: boolean; onClose: () => void; categories: { id: number; name: string }[] }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", category_id: "", price: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await restaurantApi.createMenuItem({ name: form.name, category_id: parseInt(form.category_id), price: parseFloat(form.price), description: form.description || undefined }); toast.success("Menu item added."); qc.invalidateQueries({ queryKey: ["restaurant-menu"] }); onClose(); setForm({ name: "", category_id: "", price: "", description: "" }); }
    catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Add Menu Item">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Name *</label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Category *</label>
          <Select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} required><option value="">Select</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
        </div>
        <div><label className="block text-sm text-gray-400 mb-1">Price *</label><Input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Description</label><Input value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Item"}</Button></div>
      </form>
    </Modal>
  );
}

function NewOrderModal({ open, onClose, menu }: { open: boolean; onClose: () => void; menu: MenuItem[] }) {
  const qc = useQueryClient();
  const [table, setTable] = useState("");
  const [items, setItems] = useState<{ menu_item_id: number; quantity: number; name: string; price: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addItem = (mi: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menu_item_id === mi.id);
      if (existing) return prev.map((i) => i.menu_item_id === mi.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menu_item_id: mi.id, quantity: 1, name: mi.name, price: mi.price }];
    });
  };

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.menu_item_id !== id));
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (items.length === 0) { setError("Add at least one item."); return; }
    setLoading(true); setError("");
    try {
      await restaurantApi.createOrder({ table_number: table || undefined, items: items.map((i) => ({ menu_item_id: i.menu_item_id, quantity: i.quantity })) });
      toast.success("Order created."); qc.invalidateQueries({ queryKey: ["restaurant-orders"] }); onClose(); setItems([]); setTable("");
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Order" className="max-w-2xl">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Table Number</label><Input value={table} onChange={(e) => setTable(e.target.value)} placeholder="e.g. T5" className="bg-white/5 border-white/15 h-10" /></div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Add Items</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {menu.filter((m) => m.is_available).map((m) => (
              <button type="button" key={m.id} onClick={() => addItem(m)} className="text-left text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-luxury-gold/30 transition-colors">
                <span className="text-white block truncate">{m.name}</span>
                <span className="text-luxury-gold">${Number(m.price).toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
        {items.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Order Items</label>
            {items.map((i) => (
              <div key={i.menu_item_id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white text-sm">{i.quantity}x {i.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">${(i.price * i.quantity).toFixed(2)}</span>
                  <button type="button" onClick={() => removeItem(i.menu_item_id)} className="text-red-400 text-xs hover:text-red-300">Remove</button>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-gray-400 text-sm">Estimated Total</span>
              <span className="text-luxury-gold font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>
        )}
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading || items.length === 0}>{loading ? "Creating..." : "Create Order"}</Button></div>
      </form>
    </Modal>
  );
}
