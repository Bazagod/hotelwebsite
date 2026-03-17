"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Package, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { inventoryApi, type InventoryItem, type InventoryTransaction } from "@/features/inventory/services/inventory-api";
import { getApiError } from "@/services/api-client";
import toast from "react-hot-toast";

type Tab = "items" | "transactions" | "categories";

export default function InventoryPage() {
  const [tab, setTab] = useState<Tab>("items");
  const [showLowStock, setShowLowStock] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["inventory-items", showLowStock],
    queryFn: () => inventoryApi.getItems({ low_stock: showLowStock || undefined, per_page: 50 }),
    enabled: tab === "items",
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["inventory-transactions"],
    queryFn: () => inventoryApi.getTransactions(),
    enabled: tab === "transactions",
  });

  const { data: categories } = useQuery({
    queryKey: ["inventory-categories"],
    queryFn: () => inventoryApi.getCategories(),
  });

  const itemColumns = [
    { key: "name", header: "Item", render: (i: InventoryItem) => (
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-luxury-gold shrink-0" />
        <div><p className="text-white font-medium">{i.name}</p>{i.sku && <p className="text-gray-500 text-xs">{i.sku}</p>}</div>
      </div>
    )},
    { key: "category", header: "Category", render: (i: InventoryItem) => i.category?.name ?? "—" },
    { key: "quantity", header: "Stock", render: (i: InventoryItem) => (
      <div className="flex items-center gap-2">
        <span className={i.is_low_stock ? "text-red-400 font-medium" : "text-white"}>{i.quantity} {i.unit}</span>
        {i.is_low_stock && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
      </div>
    )},
    { key: "min_quantity", header: "Min", render: (i: InventoryItem) => `${i.min_quantity} ${i.unit}` },
    { key: "unit_cost", header: "Unit Cost", render: (i: InventoryItem) => `$${Number(i.unit_cost).toFixed(2)}` },
    { key: "location", header: "Location", render: (i: InventoryItem) => i.location || "—" },
    { key: "actions", header: "", render: (i: InventoryItem) => (
      <Button size="sm" variant="ghost" onClick={() => setAdjustItem(i)} className="text-xs">Adjust</Button>
    )},
  ];

  const txColumns = [
    { key: "item", header: "Item", render: (t: InventoryTransaction) => t.item?.name ?? "—" },
    { key: "type", header: "Type", render: (t: InventoryTransaction) => (
      <div className="flex items-center gap-1.5">
        {t.type === "in" ? <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-400" /> : t.type === "out" ? <ArrowUpCircle className="w-3.5 h-3.5 text-red-400" /> : <Package className="w-3.5 h-3.5 text-blue-400" />}
        <StatusBadge status={t.type} />
      </div>
    )},
    { key: "quantity", header: "Qty", render: (t: InventoryTransaction) => <span className={t.type === "in" ? "text-emerald-400" : t.type === "out" ? "text-red-400" : "text-blue-400"}>{t.type === "in" ? "+" : t.type === "out" ? "-" : ""}{t.quantity}</span> },
    { key: "before_after", header: "Before → After", render: (t: InventoryTransaction) => `${t.quantity_before} → ${t.quantity_after}` },
    { key: "reason", header: "Reason", render: (t: InventoryTransaction) => t.reason || "—" },
    { key: "created_at", header: "Date", render: (t: InventoryTransaction) => new Date(t.created_at).toLocaleDateString() },
  ];

  return (
    <>
      <DashboardHeader title="Inventory Management" subtitle="Track supplies, equipment, and stock levels" />
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
        {(["items", "transactions", "categories"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-luxury-gold/20 text-luxury-gold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {t === "items" ? "Items" : t === "transactions" ? "Transactions" : "Categories"}
          </button>
        ))}
      </div>

      {tab === "items" && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" checked={showLowStock} onChange={(e) => setShowLowStock(e.target.checked)} className="rounded border-white/20 bg-white/5" />
              Low stock only
            </label>
            <div className="ml-auto"><Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewItem(true)}><Plus className="w-4 h-4" />Add Item</Button></div>
          </div>
          <DataTable columns={itemColumns} data={items?.data ?? []} keyExtractor={(i) => i.id} isLoading={itemsLoading} emptyMessage="No inventory items." />
        </>
      )}

      {tab === "transactions" && (
        <DataTable columns={txColumns} data={transactions?.data ?? []} keyExtractor={(t) => t.id} isLoading={txLoading} emptyMessage="No transactions yet." />
      )}

      {tab === "categories" && (
        <>
          <div className="flex justify-end mb-6"><Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewCat(true)}><Plus className="w-4 h-4" />Add Category</Button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(categories?.data ?? []).map((c: { id: number; name: string; description?: string; items_count?: number }) => (
              <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-white font-medium mb-1">{c.name}</h3>
                {c.description && <p className="text-gray-500 text-xs mb-2">{c.description}</p>}
                <p className="text-gray-400 text-sm">{c.items_count ?? 0} items</p>
              </div>
            ))}
          </div>
        </>
      )}

      <NewItemModal open={showNewItem} onClose={() => setShowNewItem(false)} categories={categories?.data ?? []} />
      <NewCategoryModal open={showNewCat} onClose={() => setShowNewCat(false)} />
      {adjustItem && <AdjustStockModal item={adjustItem} onClose={() => setAdjustItem(null)} />}
    </>
  );
}

function NewCategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState(""); const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await inventoryApi.createCategory({ name, description: desc || undefined }); toast.success("Category created."); qc.invalidateQueries({ queryKey: ["inventory-categories"] }); onClose(); setName(""); setDesc(""); }
    catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="New Category">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Name *</label><Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Description</label><Input value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? "..." : "Create"}</Button></div>
      </form>
    </Modal>
  );
}

function NewItemModal({ open, onClose, categories }: { open: boolean; onClose: () => void; categories: { id: number; name: string }[] }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", category_id: "", sku: "", quantity: "0", min_quantity: "5", unit: "piece", unit_cost: "0", location: "" });
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await inventoryApi.createItem({ name: form.name, category_id: parseInt(form.category_id), sku: form.sku || undefined, quantity: parseInt(form.quantity), min_quantity: parseInt(form.min_quantity), unit: form.unit, unit_cost: parseFloat(form.unit_cost), location: form.location || undefined });
      toast.success("Item added."); qc.invalidateQueries({ queryKey: ["inventory-items"] }); onClose();
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Add Inventory Item" className="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-gray-400 mb-1">Name *</label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">SKU</label><Input value={form.sku} onChange={(e) => set("sku", e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
        </div>
        <div><label className="block text-sm text-gray-400 mb-1">Category *</label><Select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} required><option value="">Select</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-gray-400 mb-1">Quantity</label><Input type="number" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Min Qty</label><Input type="number" value={form.min_quantity} onChange={(e) => set("min_quantity", e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Unit</label><Select value={form.unit} onChange={(e) => set("unit", e.target.value)}><option value="piece">Piece</option><option value="kg">Kg</option><option value="liter">Liter</option><option value="box">Box</option><option value="roll">Roll</option></Select></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-gray-400 mb-1">Unit Cost ($)</label><Input type="number" step="0.01" value={form.unit_cost} onChange={(e) => set("unit_cost", e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Location</label><Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Storage B" className="bg-white/5 border-white/15 h-10" /></div>
        </div>
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Item"}</Button></div>
      </form>
    </Modal>
  );
}

function AdjustStockModal({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const qc = useQueryClient();
  const [type, setType] = useState<"in" | "out" | "adjustment">("in");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await inventoryApi.adjustStock(item.id, { type, quantity: parseInt(quantity), reason: reason || undefined });
      toast.success("Stock adjusted."); qc.invalidateQueries({ queryKey: ["inventory-items"] }); qc.invalidateQueries({ queryKey: ["inventory-transactions"] }); onClose();
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  return (
    <Modal open={true} onClose={onClose} title={`Adjust: ${item.name}`} description={`Current stock: ${item.quantity} ${item.unit}`}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Type</label><Select value={type} onChange={(e) => setType(e.target.value as "in" | "out" | "adjustment")}><option value="in">Stock In</option><option value="out">Stock Out</option><option value="adjustment">Adjustment</option></Select></div>
        <div><label className="block text-sm text-gray-400 mb-1">Quantity *</label><Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Reason</label><Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Weekly restock" className="bg-white/5 border-white/15 h-10" /></div>
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? "..." : "Adjust Stock"}</Button></div>
      </form>
    </Modal>
  );
}
