// Brand constants — official ID9_AGENCY details
export const BRAND = {
  name: "ID9_AGENCY",
  fullName: "Impact Digital 9",
  tagline: "Be Impactful. Build Powerful Digital Brands.",
  email: "Contact.id9agency@gmail.com",
  whatsappNumber: "50931634848",
  whatsappUrl: "https://wa.me/50931634848",
  whatsappDisplay: "+509 31 63 4848",
  instagramHandle: "@id9_agency",
  instagramUrl: "https://www.instagram.com/id9_agency",
  tiktokHandle: "@id9_agency",
  tiktokUrl: "https://vm.tiktok.com/ZS9F3FmSnqJ6c-m9Pph/",
  facebookHandle: "ID9_AGENCY",
  facebookUrl: "https://www.facebook.com/share/17bgvsS8ZN/",
  city: "Port-au-Prince, Haïti",
  founded: 2018,
};

export const whatsappLink = (text = "Hello ID9_AGENCY, I'd like to discuss a project.") =>
  `${BRAND.whatsappUrl}?text=${encodeURIComponent(text)}`;
