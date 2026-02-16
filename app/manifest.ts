import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Concept Design Construct",
    short_name: "CDC Renovations",
    description:
      "Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f2e8",
    theme_color: "#f3f2e8",
    lang: "en-AU",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
