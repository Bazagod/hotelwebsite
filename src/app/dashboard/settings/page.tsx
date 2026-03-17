"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { Save, Loader2, User, Shield, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, token } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      });
      if (res.ok) {
        toast.success("Profile updated");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Network error");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      if (res.ok) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to change password");
      }
    } catch {
      toast.error("Network error");
    }
    setSaving(false);
  };

  return (
    <>
      <DashboardHeader title="Settings" subtitle="Manage your account and hotel configuration" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleUpdateProfile} className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-luxury-gold" />
            Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">First Name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="!bg-white/5 !border-white/15 !text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Last Name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="!bg-white/5 !border-white/15 !text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <Input
                value={user?.email ?? ""}
                disabled
                className="!bg-white/5 !border-white/15 !text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Role</label>
              <span className="px-3 py-1 rounded-full bg-luxury-gold/10 text-luxury-gold text-sm font-medium border border-luxury-gold/20 capitalize">
                {user?.roles?.[0] ?? "—"}
              </span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-luxury-gold text-charcoal font-medium text-sm hover:bg-luxury-gold-light transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Profile
            </button>
          </div>
        </form>

        <form onSubmit={handleChangePassword} className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-luxury-gold" />
            Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="!bg-white/5 !border-white/15 !text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="!bg-white/5 !border-white/15 !text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="!bg-white/5 !border-white/15 !text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-luxury-gold text-charcoal font-medium text-sm hover:bg-luxury-gold-light transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              Change Password
            </button>
          </div>
        </form>

        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-luxury-gold" />
            Hotel & Subscription
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Hotel Name</span>
              <span className="text-white">{user?.tenant?.name ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Currency</span>
              <span className="text-white">{user?.tenant?.currency ?? "USD"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Timezone</span>
              <span className="text-white">{user?.tenant?.timezone ?? "—"}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-luxury-gold/10 text-luxury-gold text-sm font-medium border border-luxury-gold/20">
                  Premium Plan
                </span>
                <span className="text-gray-500 text-xs">Multi-hotel, all modules, priority support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
