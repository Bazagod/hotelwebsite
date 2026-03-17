"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import {
  Globe,
  Upload,
  Trash2,
  Save,
  ImageIcon,
  Type,
  Building2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import type { SiteContent } from "@/hooks/useSiteContent";

const TABS = [
  { id: "general", label: "Hotel Info", icon: Building2 },
  { id: "hero", label: "Hero Section", icon: Type },
  { id: "sections", label: "Section Titles", icon: Globe },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
] as const;

type TabId = (typeof TABS)[number]["id"];

type UploadedImage = {
  id: string;
  src: string;
  alt: string;
  category: string;
  createdAt: string;
};

export default function WebsiteManagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const { token } = useAuthStore();

  const [uploadCategory, setUploadCategory] = useState("general");
  const [uploadAlt, setUploadAlt] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/site-content").then((r) => r.ok ? r.json() : null),
      fetch("/api/admin/images").then((r) => r.ok ? r.json() : []),
    ]).then(([c, imgs]) => {
      setContent(c);
      setImages(Array.isArray(imgs) ? imgs : []);
      setLoading(false);
    });
  }, []);

  const saveContent = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        toast.success("Website content saved successfully");
      } else {
        toast.error("Failed to save content");
      }
    } catch {
      toast.error("Network error");
    }
    setSaving(false);
  };

  const uploadImage = async (file: File, category: string, alt: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("alt", alt || file.name);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.ok) {
        setImages((prev) => [...prev, data.image]);
        toast.success("Image uploaded");
        return data.image;
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
    return null;
  };

  const deleteImage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/images?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        toast.success("Image deleted");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleGalleryUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    await uploadImage(file, uploadCategory, uploadAlt);
    setUploadAlt("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploading(false);
  };

  const handleHeroBgUpload = async () => {
    const file = heroFileRef.current?.files?.[0];
    if (!file || !content) return;
    const img = await uploadImage(file, "hero", "Hero background");
    if (img) {
      setContent({ ...content, hero: { ...content.hero, backgroundImage: img.src } });
    }
    setUploading(false);
  };

  const updateField = (path: string, value: string) => {
    if (!content) return;
    const keys = path.split(".");
    const updated = JSON.parse(JSON.stringify(content));
    let obj = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setContent(updated);
  };

  if (loading) {
    return (
      <>
        <DashboardHeader title="Website" subtitle="Manage your public website content" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Website" subtitle="Manage your public website content and images" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-luxury-gold/20 text-luxury-gold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={saveContent}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-luxury-gold text-charcoal font-medium text-sm hover:bg-luxury-gold-light transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {activeTab === "general" && content && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-luxury-gold" />
              Hotel Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FieldEditor label="Hotel Name" value={content.hotel.name} onChange={(v) => updateField("hotel.name", v)} />
              <FieldEditor label="Tagline" value={content.hotel.tagline} onChange={(v) => updateField("hotel.tagline", v)} />
              <FieldEditor label="Address" value={content.hotel.address} onChange={(v) => updateField("hotel.address", v)} />
              <FieldEditor label="Phone" value={content.hotel.phone} onChange={(v) => updateField("hotel.phone", v)} />
              <FieldEditor label="Email" value={content.hotel.email} onChange={(v) => updateField("hotel.email", v)} />
              <FieldEditor label="Short Description" value={content.hotel.description} onChange={(v) => updateField("hotel.description", v)} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "hero" && content && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-luxury-gold" />
              Hero Section
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FieldEditor label="Subtitle (location)" value={content.hero.subtitle} onChange={(v) => updateField("hero.subtitle", v)} />
              <FieldEditor label="Title Line 1" value={content.hero.titleLine1} onChange={(v) => updateField("hero.titleLine1", v)} />
              <FieldEditor label="Title Line 2 (highlighted)" value={content.hero.titleLine2} onChange={(v) => updateField("hero.titleLine2", v)} />
              <div className="md:col-span-2">
                <FieldEditor label="Description" value={content.hero.description} onChange={(v) => updateField("hero.description", v)} multiline />
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <h4 className="text-white text-sm font-medium mb-3">Background Image</h4>
              {content.hero.backgroundImage && (
                <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden mb-4 border border-white/10">
                  <Image
                    src={content.hero.backgroundImage}
                    alt="Hero background"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <button
                    onClick={() => updateField("hero.backgroundImage", "")}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input
                  ref={heroFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroBgUpload}
                  className="hidden"
                />
                <button
                  onClick={() => heroFileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {content.hero.backgroundImage ? "Change Image" : "Upload Image"}
                </button>
                <span className="text-xs text-gray-500">Leave empty to use default Lake Tanganyika image</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "sections" && content && (
        <div className="space-y-6">
          {Object.entries(content.sections).map(([key, sec]) => (
            <div key={key} className="rounded-xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-luxury-gold uppercase tracking-wider text-xs font-medium mb-4">
                {key} section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldEditor label="Subtitle" value={sec.subtitle || ""} onChange={(v) => updateField(`sections.${key}.subtitle`, v)} />
                <FieldEditor label="Title" value={sec.title || ""} onChange={(v) => updateField(`sections.${key}.title`, v)} />
                {sec.description !== undefined && (
                  <div className="md:col-span-2">
                    <FieldEditor label="Description" value={sec.description || ""} onChange={(v) => updateField(`sections.${key}.description`, v)} multiline />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-luxury-gold" />
              Upload New Image
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Image File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-white/15 file:text-sm file:bg-white/5 file:text-gray-300 hover:file:bg-white/10 file:transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                >
                  {["rooms", "dining", "lake", "spa", "events", "nature", "general"].map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1.5">Alt Text</label>
                  <Input
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    placeholder="Image description"
                    className="!bg-white/5 !border-white/15 !text-white"
                  />
                </div>
                <button
                  onClick={handleGalleryUpload}
                  disabled={uploading}
                  className="mt-auto flex items-center gap-2 px-4 py-2.5 rounded-lg bg-luxury-gold text-charcoal font-medium text-sm hover:bg-luxury-gold-light transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-luxury-gold" />
              Uploaded Images ({images.length})
            </h3>
            {images.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">
                No images uploaded yet. Upload images above to manage your gallery.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <span className="text-xs text-white/80 px-2 text-center">{img.alt}</span>
                      <span className="text-xs text-luxury-gold capitalize">{img.category}</span>
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="mt-1 p-1.5 rounded-md bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function FieldEditor({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="flex w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 resize-none"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="!bg-white/5 !border-white/15 !text-white"
        />
      )}
    </div>
  );
}
