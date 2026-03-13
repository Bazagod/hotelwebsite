import { notFound } from "next/navigation";
import { getRoomBySlug } from "@/lib/data/rooms";
import { RoomDetails } from "@/components/rooms/RoomDetails";
import { BookingForm } from "@/components/booking/BookingForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) return { title: "Room not found" };
  return {
    title: `${room.name} | BAZAGOD Hotel`,
    description: room.description,
  };
}

export default async function RoomPage({ params }: PageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();
  return (
    <main className="min-h-screen bg-charcoal">
      <RoomDetails room={room} />
      <section id="booking" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl text-cream text-center mb-10">
              Reserve this room
            </h2>
            <BookingForm roomId={room.id} roomName={room.name} />
          </div>
        </div>
      </section>
    </main>
  );
}
