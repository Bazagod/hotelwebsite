# BAZAGOD – Luxury Hotel Website

A luxury hotel website for **BAZAGOD**, set on the shores of **Lake Tanganyika** in **Bujumbura, Burundi**. Built with a minimal, elegant UI inspired by high-end hospitality brands.

## Tech Stack

- **Next.js 14** (App Router)
- **React** & **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Shadcn-style UI** (Button, Card, Input)
- **Lucide React** (icons)

## Features

- **Full-screen hero** with cinematic visuals
- **Room showcase** with cards linking to detail pages
- **Room details** per room (Lake Tanganyika Suite, Bujumbura Executive, Rusizi Garden Villa, Karera Falls Deluxe)
- **Booking form** (check-in/out, guests, contact)
- **Amenities** (pool, spa, restaurant, beach, fitness, concierge)
- **Gallery** with category filter
- **Testimonials** slider
- **Interactive map** (OpenStreetMap, Bujumbura)
- **Contact form**
- **Responsive** layout (mobile, tablet, desktop)

## Design

- Dark theme with cream text and gold accents
- Glassmorphism (backdrop blur, subtle borders)
- Large typography (Playfair Display, Cormorant Garamond)
- Smooth scroll and Framer Motion animations

## Data

Content is themed around **Burundi**:

- Location: Bujumbura, Lake Tanganyika
- Room names: Lake Tanganyika Suite, Bujumbura Executive, Rusizi Garden Villa, Karera Falls Deluxe
- Testimonials from local and international guests
- Contact: Avenue du Lac Tanganyika, Bujumbura

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── rooms/[slug]/page.tsx
├── components/
│   ├── layout/Navbar.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── Footer.tsx
│   │   ├── RoomShowcase.tsx
│   │   ├── AmenitiesSection.tsx
│   │   ├── MapSection.tsx
│   ├── rooms/
│   │   ├── RoomCard.tsx
│   │   └── RoomDetails.tsx
│   ├── booking/BookingForm.tsx
│   ├── gallery/GalleryGrid.tsx
│   ├── testimonials/TestimonialSlider.tsx
│   ├── contact/ContactForm.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
└── lib/
    ├── utils.ts
    └── data/
        ├── rooms.ts
        ├── testimonials.ts
        ├── amenities.ts
        └── gallery.ts
```

## Build

```bash
npm run build
npm start
```
