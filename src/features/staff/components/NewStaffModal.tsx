"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { staffApi } from "@/features/staff/services/staff-api";
import { getApiError } from "@/services/api-client";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewStaffModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    department_id: "",
    salary: "",
    salary_type: "monthly",
    hire_date: new Date().toISOString().split("T")[0],
    emergency_contact: "",
    emergency_phone: "",
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => staffApi.listDepartments(),
    enabled: open,
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await staffApi.create({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        position: form.position,
        department_id: form.department_id ? parseInt(form.department_id) : undefined,
        salary: form.salary ? parseFloat(form.salary) : undefined,
        salary_type: form.salary_type,
        hire_date: form.hire_date,
        emergency_contact: form.emergency_contact || undefined,
        emergency_phone: form.emergency_phone || undefined,
      });
      toast.success("Staff member added successfully.");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
      setForm({
        first_name: "", last_name: "", email: "", phone: "", position: "",
        department_id: "", salary: "", salary_type: "monthly",
        hire_date: new Date().toISOString().split("T")[0],
        emergency_contact: "", emergency_phone: "",
      });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Staff Member" description="Register a new team member" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset className="space-y-3">
          <legend className="text-xs text-gray-500 uppercase tracking-wider mb-2">Personal Information</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name *</label>
              <Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} required className="bg-white/5 border-white/15 h-10" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Name *</label>
              <Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} required className="bg-white/5 border-white/15 h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="bg-white/5 border-white/15 h-10" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="bg-white/5 border-white/15 h-10" />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-xs text-gray-500 uppercase tracking-wider mb-2">Employment Details</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Position *</label>
              <Input value={form.position} onChange={(e) => set("position", e.target.value)} required placeholder="e.g. Receptionist" className="bg-white/5 border-white/15 h-10" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Department</label>
              <Select value={form.department_id} onChange={(e) => set("department_id", e.target.value)}>
                <option value="">Select department</option>
                {departments?.data?.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Salary</label>
              <Input type="number" step="0.01" value={form.salary} onChange={(e) => set("salary", e.target.value)} placeholder="0.00" className="bg-white/5 border-white/15 h-10" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Salary Type</label>
              <Select value={form.salary_type} onChange={(e) => set("salary_type", e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Hire Date *</label>
              <Input type="date" value={form.hire_date} onChange={(e) => set("hire_date", e.target.value)} required className="bg-white/5 border-white/15 h-10" />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-xs text-gray-500 uppercase tracking-wider mb-2">Emergency Contact</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contact Name</label>
              <Input value={form.emergency_contact} onChange={(e) => set("emergency_contact", e.target.value)} className="bg-white/5 border-white/15 h-10" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contact Phone</label>
              <Input value={form.emergency_phone} onChange={(e) => set("emergency_phone", e.target.value)} className="bg-white/5 border-white/15 h-10" />
            </div>
          </div>
        </fieldset>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">{error}</div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Staff Member"}</Button>
        </div>
      </form>
    </Modal>
  );
}
