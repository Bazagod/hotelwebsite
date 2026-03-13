// Toutes les images : Wikimedia Commons — Burundi (Bujumbura, lac Tanganyika, plage, paysages)
const WM = "https://upload.wikimedia.org/wikipedia/commons";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "rooms" | "dining" | "lake" | "spa" | "events" | "nature";
}

export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: `${WM}/5/59/Bujumbura_%26_Lake_Tanganyika.JPG`,
    alt: "Bujumbura et le lac Tanganyika",
    category: "lake",
  },
  {
    id: "2",
    src: `${WM}/8/86/Beach_in_Bujumbura.jpg`,
    alt: "Plage à Bujumbura, lac Tanganyika",
    category: "lake",
  },
  {
    id: "3",
    src: `${WM}/f/fa/View_of_bujumbura.JPG`,
    alt: "Vue sur Bujumbura et le lac",
    category: "nature",
  },
  {
    id: "4",
    src: `${WM}/4/40/Bujumbura.JPG`,
    alt: "Panorama de Bujumbura depuis les collines de Kiriri",
    category: "nature",
  },
  {
    id: "5",
    src: `${WM}/5/59/Bujumbura_%26_Lake_Tanganyika.JPG`,
    alt: "Rives du lac Tanganyika — Burundi",
    category: "rooms",
  },
  {
    id: "6",
    src: `${WM}/8/86/Beach_in_Bujumbura.jpg`,
    alt: "Côte nord du lac Tanganyika",
    category: "nature",
  },
  {
    id: "7",
    src: `${WM}/f/fa/View_of_bujumbura.JPG`,
    alt: "Vue lac et ville — BAZAGOD",
    category: "rooms",
  },
  {
    id: "8",
    src: `${WM}/4/40/Bujumbura.JPG`,
    alt: "Bujumbura, capitale du Burundi",
    category: "events",
  },
  {
    id: "9",
    src: `${WM}/8/86/Beach_in_Bujumbura.jpg`,
    alt: "Lac Tanganyika, Burundi",
    category: "lake",
  },
  {
    id: "10",
    src: `${WM}/5/59/Bujumbura_%26_Lake_Tanganyika.JPG`,
    alt: "Restaurant en bord de lac — BAZAGOD",
    category: "dining",
  },
  {
    id: "11",
    src: `${WM}/f/fa/View_of_bujumbura.JPG`,
    alt: "Détente face au lac Tanganyika",
    category: "spa",
  },
];
