export interface Amenity {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  icon: string;
}

export const amenities: Amenity[] = [
  {
    id: "1",
    title: "Infinity Pool",
    titleFr: "Piscine à débordement",
    description: "Swim with views of Lake Tanganyika. Our infinity pool blends into the horizon.",
    descriptionFr: "Nagez avec une vue sur le lac Tanganyika. Notre piscine à débordement se fond dans l'horizon.",
    icon: "waves",
  },
  {
    id: "2",
    title: "Spa & Wellness",
    titleFr: "Spa & Bien-être",
    description: "Traditional and modern treatments. Relax with massages inspired by local ingredients.",
    descriptionFr: "Soins traditionnels et modernes. Détendez-vous avec des massages inspirés des ingrédients locaux.",
    icon: "spa",
  },
  {
    id: "3",
    title: "Lakefront Restaurant",
    titleFr: "Restaurant en bord de lac",
    description: "Fine dining with Burundian and international cuisine. Fresh fish from the lake.",
    descriptionFr: "Gastronomie burundaise et internationale. Poisson frais du lac.",
    icon: "utensils",
  },
  {
    id: "4",
    title: "Private Beach",
    titleFr: "Plage privée",
    description: "Exclusive access to our stretch of Lake Tanganyika shoreline.",
    descriptionFr: "Accès exclusif à notre portion de rivage du lac Tanganyika.",
    icon: "umbrella-beach",
  },
  {
    id: "5",
    title: "Fitness Center",
    titleFr: "Centre de fitness",
    description: "State-of-the-art gym with lake views. Open 24 hours.",
    descriptionFr: "Salle de sport moderne avec vue sur le lac. Ouvert 24h/24.",
    icon: "dumbbell",
  },
  {
    id: "6",
    title: "Concierge",
    titleFr: "Concierge",
    description: "Tours to Rusizi National Park, Karera Falls, and Bujumbura. We arrange everything.",
    descriptionFr: "Excursions au parc national de la Rusizi, chutes de la Karera et Bujumbura. Nous organisons tout.",
    icon: "compass",
  },
];
