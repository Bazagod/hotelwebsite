// Toutes les images : Wikimedia Commons — Burundi (Bujumbura, lac Tanganyika)
const WM = "https://upload.wikimedia.org/wikipedia/commons";

export interface Room {
  id: string;
  slug: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  pricePerNight: number;
  size: string;
  maxGuests: number;
  bedType: string;
  image: string;
  images: string[];
  amenities: string[];
  view: string;
}

export const rooms: Room[] = [
  {
    id: "1",
    slug: "lake-tanganyika-suite",
    name: "Lake Tanganyika Suite",
    nameFr: "Suite Lac Tanganyika",
    description:
      "Our signature suite overlooks the shores of Lake Tanganyika. Floor-to-ceiling windows frame the endless blue of Africa's deepest lake. Elegant interiors with local artisan touches and a private terrace.",
    descriptionFr:
      "Notre suite signature donne sur les rives du lac Tanganyika. De grandes baies vitrées encadrent l'infini bleu du plus profond lac d'Afrique. Intérieurs élégants avec touches d'artisans locaux et terrasse privée.",
    pricePerNight: 385,
    size: "65 m²",
    maxGuests: 3,
    bedType: "King bed",
    view: "Lake Tanganyika",
    image: `${WM}/5/59/Bujumbura_%26_Lake_Tanganyika.JPG`,
    images: [
      `${WM}/5/59/Bujumbura_%26_Lake_Tanganyika.JPG`,
      `${WM}/8/86/Beach_in_Bujumbura.jpg`,
      `${WM}/f/fa/View_of_bujumbura.JPG`,
    ],
    amenities: [
      "Private terrace",
      "Lake view",
      "Minibar",
      "Espresso machine",
      "Bathtub",
      "Rain shower",
      "24h room service",
    ],
  },
  {
    id: "2",
    slug: "bujumbura-executive",
    name: "Bujumbura Executive Room",
    nameFr: "Chambre Executive Bujumbura",
    description:
      "Sophisticated comfort in the heart of the capital. Wake to views of the city and distant hills. Perfect for business travelers with a dedicated work space and premium amenities.",
    descriptionFr:
      "Confort sophistiqué au cœur de la capitale. Réveillez-vous avec une vue sur la ville et les collines lointaines. Idéal pour les voyageurs d'affaires avec un espace de travail dédié.",
    pricePerNight: 245,
    size: "42 m²",
    maxGuests: 2,
    bedType: "King bed",
    view: "City & hills",
    image: `${WM}/4/40/Bujumbura.JPG`,
    images: [
      `${WM}/4/40/Bujumbura.JPG`,
      `${WM}/f/fa/View_of_bujumbura.JPG`,
      `${WM}/5/59/Bujumbura_%26_Lake_Tanganyika.JPG`,
    ],
    amenities: [
      "Work desk",
      "City view",
      "Smart TV",
      "Coffee maker",
      "Walk-in shower",
      "High-speed WiFi",
    ],
  },
  {
    id: "3",
    slug: "rusizi-garden-villa",
    name: "Rusizi Garden Villa",
    nameFr: "Villa Jardin Rusizi",
    description:
      "A private villa surrounded by lush gardens near the Rusizi River. Two bedrooms, living area, and your own plunge pool. Inspired by the tranquillity of Burundi's natural parks.",
    descriptionFr:
      "Une villa privée entourée de jardins luxuriants près de la rivière Rusizi. Deux chambres, salon et piscine privée. Inspirée par la tranquillité des parcs naturels du Burundi.",
    pricePerNight: 520,
    size: "120 m²",
    maxGuests: 5,
    bedType: "2 King beds",
    view: "Garden & pool",
    image: `${WM}/8/86/Beach_in_Bujumbura.jpg`,
    images: [
      `${WM}/8/86/Beach_in_Bujumbura.jpg`,
      `${WM}/5/59/Bujumbura_%26_Lake_Tanganyika.JPG`,
      `${WM}/f/fa/View_of_bujumbura.JPG`,
    ],
    amenities: [
      "Private pool",
      "Garden",
      "Living room",
      "Kitchenette",
      "Butler service",
      "Outdoor shower",
    ],
  },
  {
    id: "4",
    slug: "karera-deluxe",
    name: "Karera Falls Deluxe",
    nameFr: "Deluxe Chutes de la Karera",
    description:
      "Named after the stunning Karera waterfalls. This deluxe room blends modern luxury with subtle references to Burundi's landscapes. Spacious and serene.",
    descriptionFr:
      "Nommée d'après les magnifiques chutes de la Karera. Cette chambre deluxe allie luxe moderne et références subtiles aux paysages du Burundi. Spacieuse et sereine.",
    pricePerNight: 295,
    size: "48 m²",
    maxGuests: 2,
    bedType: "King or Twin",
    view: "Pool & garden",
    image: `${WM}/f/fa/View_of_bujumbura.JPG`,
    images: [
      `${WM}/f/fa/View_of_bujumbura.JPG`,
      `${WM}/8/86/Beach_in_Bujumbura.jpg`,
      `${WM}/4/40/Bujumbura.JPG`,
    ],
    amenities: [
      "Pool view",
      "Balcony",
      "Bathtub",
      "Minibar",
      "Safe",
      "Air conditioning",
    ],
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}
