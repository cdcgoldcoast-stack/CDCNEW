import type { Metadata } from "next";
import dynamic from "next/dynamic";

const HERO_IMAGE =
  "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Living-renovation-Helensvale.webp";

const GoldCoastRenovationsLP = dynamic(
  () => import("@/views/GoldCoastRenovationsLP"),
  { loading: () => <div className="min-h-screen bg-background animate-pulse" /> }
);

export const metadata: Metadata = {
  title: "Gold Coast Renovations | Free Quote | CD Construct",
  description:
    "Get a free renovation quote from QBCC licensed Gold Coast builders. Kitchen, bathroom & whole-home experts. Call 0413 468 928.",
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
