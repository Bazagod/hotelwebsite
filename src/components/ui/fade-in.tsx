"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  as?: "div" | "section" | "header" | "nav";
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
  as: Tag = "div",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "-40px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const translate = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: "",
  }[direction];

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "transition-all ease-out",
        isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${translate}`,
        className
      )}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}
