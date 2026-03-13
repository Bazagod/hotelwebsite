"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#rooms", label: "Rooms" },
  { href: "/#amenities", label: "Amenities" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "glass-dark py-3" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl sm:text-3xl font-semibold text-cream tracking-wide">
            BAZAGOD
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-widest text-cream/90 hover:text-luxury-gold transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/#booking"
              className="inline-flex items-center justify-center h-9 px-4 text-xs rounded-sm border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 transition-colors"
            >
              Reserve
            </Link>
          </div>

          <button
            aria-label="Toggle menu"
            className="md:hidden p-2 text-cream"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-charcoal/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
          >
            <button
              aria-label="Close menu"
              className="absolute top-6 right-6 text-cream"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={28} />
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-serif text-2xl text-cream hover:text-luxury-gold transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#booking"
              onClick={() => setIsMobileOpen(false)}
              className="inline-flex items-center justify-center h-11 px-8 rounded-sm bg-luxury-gold text-charcoal hover:bg-luxury-gold-light font-medium transition-colors"
            >
              Reserve
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
