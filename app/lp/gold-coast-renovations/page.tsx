import type { Metadata } from "next";
import GoldCoastRenovationsLP from "@/views/GoldCoastRenovationsLP";

export const metadata: Metadata = {
  title: "Gold Coast Home Renovations | Trusted & Licensed Local Contractor",
  description:
    "Looking for reliable home renovation services on the Gold Coast? We design & build stunning spaces. Affordable pricing. Book a free consultation today.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function Page() {
  return <GoldCoastRenovationsLP />;
}
