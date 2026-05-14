// Brand constants shared across UI
export const BRAND = {
  name: "ID9_AGENCY",
  fullName: "Impact Digital 9",
  tagline: "Be Impactful. Build Powerful Digital Brands.",
  email: "hello@id9agency.com",
  whatsapp: "+15551234567", // placeholder — replace with real number
  whatsappDisplay: "+1 (555) 123-4567",
  instagram: "@id9_agency",
  instagramUrl: "https://instagram.com/id9_agency",
  city: "Port-au-Prince, Haïti",
  founded: 2018,
};

export const whatsappLink = (text = "Hello ID9_AGENCY, I'd like to discuss a project.") =>
  `https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Work" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
];
