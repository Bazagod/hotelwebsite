"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, LogOut, Trash2, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { value: "rooms", label: "Chambres" },
  { value: "dining", label: "Restaurant" },
  { value: "lake", label: "Lac" },
  { value: "spa", label: "Spa" },
  { value: "events", label: "Événements" },
  { value: "nature", label: "Nature" },
];

type UploadedImage = {
  id: string;
  src: string;
  alt: string;
  category: string;
  createdAt?: string;
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState("nature");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/me");
    const data = await res.json();
    setAuthenticated(data.ok === true);
    return data.ok;
  }, []);

  const fetchImages = useCallback(async () => {
    const res = await fetch("/api/admin/images");
    if (res.ok) {
      const data = await res.json();
      setImages(data);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authenticated) fetchImages();
  }, [authenticated, fetchImages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.ok) {
      setAuthenticated(true);
      setPassword("");
    } else {
      setLoginError(data.error || "Erreur de connexion");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Choisissez une image.");
      return;
    }
    setUploadError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", alt || file.name);
    formData.append("category", category);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Échec de l’envoi");
        return;
      }
      setImages((prev) => [...prev, data.image]);
      setFile(null);
      setAlt("");
      setCategory("nature");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/images?id=${id}`, { method: "DELETE" });
      if (res.ok) setImages((prev) => prev.filter((img) => img.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <p className="text-cream/70">Chargement...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm glass-dark rounded-xl p-8 border border-white/10"
        >
          <div className="flex items-center gap-2 text-luxury-gold mb-6">
            <Lock className="w-5 h-5" />
            <h1 className="font-serif text-xl">Admin BAZAGOD</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-sm text-cream/80">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin"
              required
              className="bg-white/5 border-white/20"
            />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
          <p className="mt-4 text-cream/50 text-xs">
            Par défaut : <code className="bg-white/10 px-1 rounded">bazagod-admin-2024</code> (définir <code className="bg-white/10 px-1 rounded">ADMIN_SECRET</code> en production)
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-cream pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-cream/80 hover:text-luxury-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au site
            </Link>
            <h1 className="font-serif text-2xl md:text-3xl">Admin — Galerie</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-xl p-6 md:p-8 mb-10 border border-white/10"
        >
          <h2 className="font-serif text-xl mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-luxury-gold" />
            Ajouter une photo (depuis votre PC)
          </h2>
          <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm text-cream/80 mb-2">Fichier image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setFile(f || null);
                  if (f && !alt) setAlt(f.name.replace(/\.[^.]+$/, ""));
                }}
                className="block w-full text-sm text-cream/80 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-luxury-gold/20 file:text-luxury-gold file:font-medium"
              />
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">Description (alt)</label>
              <Input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Ex : Vue sur le lac Tanganyika"
                className="bg-white/5 border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-12 w-full max-w-xs rounded-sm border border-white/20 bg-white/5 px-4 py-2 text-cream focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
            <Button type="submit" disabled={uploading || !file}>
              {uploading ? "Envoi…" : "Enregistrer la photo"}
            </Button>
          </form>
        </motion.section>

        <section>
          <h2 className="font-serif text-xl mb-4">Photos ajoutées ({images.length})</h2>
          {images.length === 0 ? (
            <p className="text-cream/60">Aucune photo ajoutée. Utilisez le formulaire ci‑dessus.</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img) => (
                <li
                  key={img.id}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white/5 border border-white/10 group"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="200px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-cream text-xs font-medium truncate">{img.alt}</p>
                    <p className="text-cream/60 text-xs capitalize">{img.category}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      onClick={() => handleDelete(img.id)}
                      disabled={deletingId === img.id}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
