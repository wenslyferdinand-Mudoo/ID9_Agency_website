// Brand constants — official ID9_AGENCY details
export const BRAND = {
  name: "ID9 Agency",
  fullName: "Impact Digital 9 Agency",
  tagline: "Be Impactful. Build Powerful Digital Brands.",
  email: "Contact.id9agency@gmail.com",
  whatsappNumber: "50931634848",
  whatsappUrl: "https://wa.me/50931634848",
  whatsappDisplay: "+509 31 63 4848",
  instagramHandle: "@id9_agency",
  instagramUrl: "https://www.instagram.com/id9_agency",
  catalogUrl: "https://wa.me/p/8721011224668261/50931634848",
  trainingGroupUrl: "https://chat.whatsapp.com/B61jdDk7Sn00yX2F2E8b5y?s=cl&p=a&iam=2",
  tiktokHandle: "@id9_agency",
  tiktokUrl: "https://vm.tiktok.com/ZS9F3FmSnqJ6c-m9Pph/",
  facebookHandle: "ID9_AGENCY",
  facebookUrl: "https://www.facebook.com/share/17bgvsS8ZN/",
  city: "Port-au-Prince, Haïti",
  founded: 2018,
};

export const whatsappLink = (text = "Hello Impact Digital 9 Agency, I'd like to discuss a project.") =>
  `${BRAND.whatsappUrl}?text=${encodeURIComponent(text)}`;
