import type { Metadata } from "next";
import dynamic from "next/dynamic";

const HERO_IMAGE =
  "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Living-renovation-Helensvale.webp";

const GoldCoastRenovationsLP = dynamic(
  () => import("@/views/GoldCoastRenovationsLP"),
  { loading: () => <div className="min-h-screen bg-background animate-pulse" /> }
);

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
  return (
    <>
      <link rel="preload" as="image" href={HERO_IMAGE} fetchPriority="high" />
      <GoldCoastRenovationsLP />
    </>
  );
}
