"use client";

import { useState, useEffect } from "react";

export interface SiteContent {
  hero: {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    backgroundImage: string;
  };
  hotel: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    description: string;
  };
  sections: Record<
    string,
    { subtitle?: string; title?: string; description?: string }
  >;
}

let cachedContent: SiteContent | null = null;
let fetchPromise: Promise<SiteContent | null> | null = null;

function fetchContent(): Promise<SiteContent | null> {
  if (cachedContent) return Promise.resolve(cachedContent);
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/data/site-content.json")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      cachedContent = data;
      return data;
    })
    .catch(() => null);

  return fetchPromise;
}

export function invalidateSiteContent() {
  cachedContent = null;
  fetchPromise = null;
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(cachedContent);
  const [loading, setLoading] = useState(!cachedContent);

  useEffect(() => {
    if (cachedContent) {
      setContent(cachedContent);
      setLoading(false);
      return;
    }
    fetchContent().then((data) => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  return { content, loading };
}
