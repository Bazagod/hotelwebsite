import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { RoomShowcase } from "@/components/sections/RoomShowcase";
import { AmenitiesSection } from "@/components/sections/AmenitiesSection";

const GalleryGrid = dynamic(() => import("@/components/gallery/GalleryGrid").then((m) => m.GalleryGrid), {
  loading: () => <div className="py-24 bg-charcoal" />,
});
const TestimonialSlider = dynamic(() => import("@/components/testimonials/TestimonialSlider").then((m) => m.TestimonialSlider), {
  loading: () => <div className="py-24 bg-charcoal/90" />,
});
const MapSection = dynamic(() => import("@/components/sections/MapSection").then((m) => m.MapSection), {
  loading: () => <div className="py-24 bg-charcoal" />,
});
const BookingForm = dynamic(() => import("@/components/booking/BookingForm").then((m) => m.BookingForm));
const ContactForm = dynamic(() => import("@/components/contact/ContactForm").then((m) => m.ContactForm));

export default function Home() {
  return (
    <>
      <HeroSection />
      <RoomShowcase />
      <AmenitiesSection />
      <GalleryGrid />
      <TestimonialSlider />

      {/* Booking section */}
      <section id="booking" className="py-24 lg:py-32 bg-charcoal/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Reservations
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-cream font-light">
              Reserve your stay
            </h2>
            <p className="mt-4 text-cream/80">
              Request a reservation and our team will confirm within 24 hours.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <BookingForm />
          </div>
        </div>
      </section>

      <MapSection />

      {/* Contact section */}
      <section id="contact" className="py-24 lg:py-32 bg-charcoal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Contact
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-cream font-light">
              Get in touch
            </h2>
          </div>
          <div className="max-w-xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
