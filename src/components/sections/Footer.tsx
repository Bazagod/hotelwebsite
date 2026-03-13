"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const footerLinks = {
  stay: [
    { label: "Rooms & Suites", href: "/#rooms" },
    { label: "Reservations", href: "/#booking" },
    { label: "Amenities", href: "/#amenities" },
  ],
  explore: [
    { label: "Gallery", href: "/#gallery" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Contact", href: "/#contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-3xl font-semibold text-cream">
              BAZAGOD
            </Link>
            <p className="mt-4 text-cream/70 text-sm leading-relaxed max-w-xs">
              Luxury on the shores of Lake Tanganyika. Bujumbura, Burundi.
            </p>
          </div>

          <div>
            <h4 className="text-luxury-gold uppercase tracking-widest text-xs font-medium mb-4">
              Stay
            </h4>
            <ul className="space-y-3">
              {footerLinks.stay.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/80 hover:text-luxury-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-luxury-gold uppercase tracking-widest text-xs font-medium mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/80 hover:text-luxury-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-luxury-gold uppercase tracking-widest text-xs font-medium mb-4">
              Contact
            </h4>
            <ul className="space-y-4 text-cream/80 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-luxury-gold mt-0.5 shrink-0" />
                <span>
                  Avenue du Lac Tanganyika<br />
                  Bujumbura, Burundi
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
                <a href="tel:+25722251234" className="hover:text-luxury-gold transition-colors">
                  +257 22 25 12 34
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-luxury-gold shrink-0" />
                <a href="mailto:reservations@bazagod.bi" className="hover:text-luxury-gold transition-colors">
                  reservations@bazagod.bi
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-xs">
            © {new Date().getFullYear()} BAZAGOD. All rights reserved.
          </p>
          <p className="text-cream/40 text-xs">
            Burundi · Lac Tanganyika
          </p>
        </div>
      </div>
    </footer>
  );
}
