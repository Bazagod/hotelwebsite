// Avatars : images du Burundi (Wikimedia Commons) — paysages / culture
const WM = "https://upload.wikimedia.org/wikipedia/commons";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  content: string;
  contentFr: string;
  rating: number;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marie-Claire Niyonzima",
    role: "Business Executive",
    location: "Bujumbura",
    content:
      "BAZAGOD is the finest hotel in Bujumbura. The Lake Tanganyika Suite was unforgettable. Waking up to that view—nothing compares.",
    contentFr:
      "BAZAGOD est le plus bel hôtel de Bujumbura. La Suite Lac Tanganyika était inoubliable. Se réveiller avec cette vue—rien ne compare.",
    rating: 5,
    image: `${WM}/8/86/Beach_in_Bujumbura.jpg`,
  },
  {
    id: "2",
    name: "Jean-Pierre Habonimana",
    role: "Diplomat",
    location: "Gitega",
    content:
      "From the moment we arrived, the staff made us feel like royalty. The Rusizi Garden Villa is perfect for families. We will return.",
    contentFr:
      "Dès notre arrivée, le personnel nous a traités comme des rois. La Villa Jardin Rusizi est parfaite pour les familles. Nous reviendrons.",
    rating: 5,
    image: `${WM}/5/59/Bujumbura_%26_Lake_Tanganyika.JPG`,
  },
  {
    id: "3",
    name: "Sarah & David Mitchell",
    role: "Tourists",
    location: "London, UK",
    content:
      "Our honeymoon at BAZAGOD exceeded every expectation. The sunsets over Lake Tanganyika, the spa, the food—Burundi has a hidden gem.",
    contentFr:
      "Notre lune de miel à BAZAGOD a dépassé toutes nos attentes. Les couchers de soleil sur le lac Tanganyika, le spa, la cuisine—le Burundi a un joyau caché.",
    rating: 5,
    image: `${WM}/f/fa/View_of_bujumbura.JPG`,
  },
  {
    id: "4",
    name: "Éric Ndayisenga",
    role: "Event Planner",
    location: "Bujumbura",
    content:
      "We hosted our annual gala at BAZAGOD. The ballroom, the catering, the lakefront setting—our guests are still talking about it.",
    contentFr:
      "Nous avons organisé notre gala annuel à BAZAGOD. La salle de bal, le traiteur, le cadre en bord de lac—nos invités en parlent encore.",
    rating: 5,
    image: `${WM}/4/40/Bujumbura.JPG`,
  },
];
