/**
 * Centralised suburb/location configuration
 *
 * Used by Footer, service page "Areas We Serve" sections,
 * and any component that needs the full list of suburb pages.
 */

export interface SuburbLink {
  label: string;
  href: string;
}

export const ALL_SUBURB_LINKS: SuburbLink[] = [
  { label: "Broadbeach", href: "/broadbeach-renovations" },
  { label: "Burleigh Heads", href: "/burleigh-heads-renovations" },
  { label: "Surfers Paradise", href: "/surfers-paradise-renovations" },
  { label: "Mermaid Beach", href: "/mermaid-beach-renovations" },
  { label: "Palm Beach", href: "/palm-beach-renovations" },
  { label: "Robina", href: "/robina-renovations" },
  { label: "Southport", href: "/southport-renovations" },
  { label: "Helensvale", href: "/helensvale-renovations" },
  { label: "Hope Island", href: "/hope-island-renovations" },
  { label: "Coomera", href: "/coomera-renovations" },
  { label: "Nerang", href: "/nerang-renovations" },
  { label: "Coolangatta", href: "/coolangatta-renovations" },
  { label: "Currumbin", href: "/currumbin-renovations" },
  { label: "Miami", href: "/miami-renovations" },
  { label: "Mudgeeraba", href: "/mudgeeraba-renovations" },
  { label: "Varsity Lakes", href: "/varsity-lakes-renovations" },
  { label: "Bundall", href: "/bundall-renovations" },
  { label: "Runaway Bay", href: "/runaway-bay-renovations" },
  { label: "Sanctuary Cove", href: "/sanctuary-cove-renovations" },
  { label: "Upper Coomera", href: "/upper-coomera-renovations" },
];

/** Top suburbs shown in the footer navigation column */
export const FOOTER_SUBURB_LINKS: SuburbLink[] = ALL_SUBURB_LINKS.slice(0, 6);
