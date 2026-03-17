"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, DollarSign, TrendingUp, TrendingDown, FileText, CreditCard, Receipt } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { accountingApi, type Invoice, type Payment, type Expense } from "@/features/accounting/services/accounting-api";
import { getApiError } from "@/services/api-client";
import toast from "react-hot-toast";

type Tab = "overview" | "invoices" | "payments" | "expenses";

export default function AccountingPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [showNewExpense, setShowNewExpense] = useState(false);

  const { data: summary } = useQuery({ queryKey: ["accounting-summary"], queryFn: accountingApi.getSummary });
  const { data: invoices, isLoading: invLoading } = useQuery({ queryKey: ["accounting-invoices"], queryFn: () => accountingApi.getInvoices(), enabled: tab === "invoices" || tab === "overview" });
  const { data: payments, isLoading: payLoading } = useQuery({ queryKey: ["accounting-payments"], queryFn: () => accountingApi.getPayments(), enabled: tab === "payments" || tab === "overview" });
  const { data: expenses, isLoading: expLoading } = useQuery({ queryKey: ["accounting-expenses"], queryFn: () => accountingApi.getExpenses(), enabled: tab === "expenses" || tab === "overview" });

  const invoiceColumns = [
    { key: "invoice_number", header: "Invoice #", render: (i: Invoice) => <span className="font-mono text-xs text-luxury-gold">{i.invoice_number}</span> },
    { key: "guest", header: "Guest", render: (i: Invoice) => i.guest?.full_name ?? "—" },
    { key: "total_amount", header: "Amount", render: (i: Invoice) => <span className="font-medium">${Number(i.total_amount).toFixed(2)}</span> },
    { key: "status", header: "Status", render: (i: Invoice) => <StatusBadge status={i.status} /> },
    { key: "issue_date", header: "Issued" },
    { key: "due_date", header: "Due" },
  ];

  const paymentColumns = [
    { key: "amount", header: "Amount", render: (p: Payment) => <span className="text-emerald-400 font-medium">${Number(p.amount).toFixed(2)}</span> },
    { key: "method", header: "Method", render: (p: Payment) => <StatusBadge status={p.method} /> },
    { key: "guest", header: "Guest", render: (p: Payment) => p.guest?.full_name ?? "—" },
    { key: "reference", header: "Reference", render: (p: Payment) => p.reference || "—" },
    { key: "status", header: "Status", render: (p: Payment) => <StatusBadge status={p.status} /> },
    { key: "created_at", header: "Date", render: (p: Payment) => new Date(p.created_at).toLocaleDateString() },
  ];

  const expenseColumns = [
    { key: "category", header: "Category", render: (e: Expense) => <StatusBadge status={e.category} /> },
    { key: "description", header: "Description", render: (e: Expense) => <span className="text-white">{e.description}</span> },
    { key: "amount", header: "Amount", render: (e: Expense) => <span className="text-red-400 font-medium">${Number(e.amount).toFixed(2)}</span> },
    { key: "vendor", header: "Vendor", render: (e: Expense) => e.vendor || "—" },
    { key: "date", header: "Date" },
  ];

  return (
    <>
      <DashboardHeader title="Accounting" subtitle="Revenue, payments, invoices, and expenses" />

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Monthly Revenue" value={`$${(summary.total_revenue ?? 0).toLocaleString()}`} icon={TrendingUp} />
          <StatCard title="Monthly Expenses" value={`$${(summary.total_expenses ?? 0).toLocaleString()}`} icon={TrendingDown} />
          <StatCard title="Net Income" value={`$${(summary.net_income ?? 0).toLocaleString()}`} icon={DollarSign} />
          <StatCard title="Outstanding" value={summary.outstanding_invoices ?? 0} subtitle="unpaid invoices" icon={FileText} />
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
        {(["overview", "invoices", "payments", "expenses"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-luxury-gold/20 text-luxury-gold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-3"><h3 className="text-white font-medium flex items-center gap-2"><CreditCard className="w-4 h-4 text-luxury-gold" />Recent Payments</h3></div>
            <DataTable columns={paymentColumns} data={(payments?.data ?? []).slice(0, 5)} keyExtractor={(p) => p.id} isLoading={payLoading} emptyMessage="No payments yet." />
          </section>
          <section>
            <div className="flex items-center justify-between mb-3"><h3 className="text-white font-medium flex items-center gap-2"><Receipt className="w-4 h-4 text-luxury-gold" />Recent Expenses</h3></div>
            <DataTable columns={expenseColumns} data={(expenses?.data ?? []).slice(0, 5)} keyExtractor={(e) => e.id} isLoading={expLoading} emptyMessage="No expenses yet." />
          </section>
        </div>
      )}

      {tab === "invoices" && (
        <DataTable columns={invoiceColumns} data={invoices?.data ?? []} keyExtractor={(i) => i.id} isLoading={invLoading} emptyMessage="No invoices." />
      )}

      {tab === "payments" && (
        <>
          <div className="flex justify-end mb-6"><Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewPayment(true)}><Plus className="w-4 h-4" />Record Payment</Button></div>
          <DataTable columns={paymentColumns} data={payments?.data ?? []} keyExtractor={(p) => p.id} isLoading={payLoading} emptyMessage="No payments." />
        </>
      )}

      {tab === "expenses" && (
        <>
          <div className="flex justify-end mb-6"><Button size="sm" className="flex items-center gap-2" onClick={() => setShowNewExpense(true)}><Plus className="w-4 h-4" />Add Expense</Button></div>
          <DataTable columns={expenseColumns} data={expenses?.data ?? []} keyExtractor={(e) => e.id} isLoading={expLoading} emptyMessage="No expenses." />
        </>
      )}

      <NewPaymentModal open={showNewPayment} onClose={() => setShowNewPayment(false)} />
      <NewExpenseModal open={showNewExpense} onClose={() => setShowNewExpense(false)} />
    </>
  );
}

function NewPaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ guest_id: "", amount: "", method: "cash", reference: "", notes: "" });
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await accountingApi.createPayment({ guest_id: parseInt(form.guest_id), amount: parseFloat(form.amount), method: form.method, reference: form.reference || undefined, notes: form.notes || undefined });
      toast.success("Payment recorded."); qc.invalidateQueries({ queryKey: ["accounting-payments"] }); qc.invalidateQueries({ queryKey: ["accounting-summary"] }); onClose(); setForm({ guest_id: "", amount: "", method: "cash", reference: "", notes: "" });
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Record Payment">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Guest ID *</label><Input type="number" value={form.guest_id} onChange={(e) => set("guest_id", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Amount ($) *</label><Input type="number" step="0.01" value={form.amount} onChange={(e) => set("amount", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Method</label><Select value={form.method} onChange={(e) => set("method", e.target.value)}><option value="cash">Cash</option><option value="card">Credit Card</option><option value="bank_transfer">Bank Transfer</option><option value="mobile_money">Mobile Money</option></Select></div>
        <div><label className="block text-sm text-gray-400 mb-1">Reference</label><Input value={form.reference} onChange={(e) => set("reference", e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? "..." : "Record Payment"}</Button></div>
      </form>
    </Modal>
  );
}

function NewExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ category: "supplies", description: "", amount: "", date: new Date().toISOString().split("T")[0], vendor: "", notes: "" });
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await accountingApi.createExpense({ category: form.category, description: form.description, amount: parseFloat(form.amount), date: form.date, vendor: form.vendor || undefined, notes: form.notes || undefined });
      toast.success("Expense added."); qc.invalidateQueries({ queryKey: ["accounting-expenses"] }); qc.invalidateQueries({ queryKey: ["accounting-summary"] }); onClose(); setForm({ category: "supplies", description: "", amount: "", date: new Date().toISOString().split("T")[0], vendor: "", notes: "" });
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Add Expense">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Category</label>
          <Select value={form.category} onChange={(e) => set("category", e.target.value)}>{["supplies", "maintenance", "utilities", "food_beverage", "salaries", "marketing", "other"].map((c) => <option key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}</Select>
        </div>
        <div><label className="block text-sm text-gray-400 mb-1">Description *</label><Input value={form.description} onChange={(e) => set("description", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-gray-400 mb-1">Amount ($) *</label><Input type="number" step="0.01" value={form.amount} onChange={(e) => set("amount", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Date *</label><Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required className="bg-white/5 border-white/15 h-10" /></div>
        </div>
        <div><label className="block text-sm text-gray-400 mb-1">Vendor</label><Input value={form.vendor} onChange={(e) => set("vendor", e.target.value)} className="bg-white/5 border-white/15 h-10" /></div>
        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? "..." : "Add Expense"}</Button></div>
      </form>
    </Modal>
  );
}
