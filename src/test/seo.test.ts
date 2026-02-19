import { describe, it, expect } from "vitest";
import {
  formatPageTitle,
  getFullUrl,
  buildProjectMetaDescription,
  PRODUCTION_DOMAIN,
  SITE_NAME,
  SITE_ALTERNATE_NAME,
  DEFAULT_META,
  withBrandDescription,
} from "@/config/seo";
import { buildMetadata, generateWebSiteSchema } from "../../lib/seo";

describe("getFullUrl", () => {
  it("returns production domain with path", () => {
    expect(getFullUrl("/about-us")).toBe(`${PRODUCTION_DOMAIN}/about-us`);
  });

  it("returns production domain for root", () => {
    expect(getFullUrl("/")).toBe(PRODUCTION_DOMAIN);
  });

  it("returns production domain with root when no argument given", () => {
    expect(getFullUrl()).toBe(PRODUCTION_DOMAIN);
  });
});

describe("formatPageTitle", () => {
  it("returns default title for empty input", () => {
    expect(formatPageTitle("")).toBe(DEFAULT_META.title);
    expect(formatPageTitle(undefined)).toBe(DEFAULT_META.title);
  });

  it("returns default title for whitespace-only input", () => {
    expect(formatPageTitle("   ")).toBe(DEFAULT_META.title);
  });

  it("appends brand name when missing", () => {
    const result = formatPageTitle("About Us");
    expect(result).toContain("About Us");
    expect(result).toContain(SITE_NAME);
  });

  it("does not double-append brand name", () => {
    const input = `Kitchen Renovations | ${SITE_NAME}`;
    const result = formatPageTitle(input);
    const occurrences = result.split(SITE_NAME).length - 1;
    expect(occurrences).toBe(1);
  });

  it("truncates titles longer than 60 characters", () => {
    const longTitle =
      "A Very Long Title About Gold Coast Renovations That Exceeds The Maximum Length";
    const result = formatPageTitle(longTitle);
    expect(result.length).toBeLessThanOrEqual(60);
    expect(result).toMatch(/\.\.\.$/);
  });

  it("preserves short titles without truncation", () => {
    const result = formatPageTitle("Short");
    expect(result).not.toMatch(/\.\.\.$/);
  });
});

describe("default brand metadata", () => {
  it("includes both Concept Design Construct and CD Construct in default title", () => {
    expect(DEFAULT_META.title).toContain("Concept Design Construct");
    expect(DEFAULT_META.title).toContain("CD Construct");
    expect(DEFAULT_META.title.length).toBeLessThanOrEqual(60);
  });

  it("includes both brand terms in default description", () => {
    expect(DEFAULT_META.description).toContain("Concept Design Construct");
    expect(DEFAULT_META.description).toContain("CD Construct");
  });
});

describe("generateWebSiteSchema", () => {
  it("includes brand keywords for both name variants", () => {
    const schema = generateWebSiteSchema();
    expect(schema.alternateName).toBe(SITE_ALTERNATE_NAME);
    expect(Array.isArray(schema.keywords)).toBe(true);
    expect(schema.keywords).toContain("Concept Design Construct");
    expect(schema.keywords).toContain(SITE_ALTERNATE_NAME);
  });
});

describe("buildProjectMetaDescription", () => {
  it("appends contextual project details when summary lacks name/location", () => {
    const description = buildProjectMetaDescription({
      projectName: "Family Hub",
      category: "whole-home",
      location: "Helensvale",
      summary: "Complete home transformation",
    });
    expect(description).toContain("Complete home transformation.");
    expect(description).toContain("Family Hub");
    expect(description).toContain("Helensvale");
    expect(description).toContain("Concept Design Construct (CD Construct)");
  });

  it("keeps summary concise when name and location are already present", () => {
    const description = buildProjectMetaDescription({
      projectName: "Family Hub",
      category: "whole-home",
      location: "Helensvale",
      summary: "Family Hub renovation in Helensvale with design-led planning",
    });
    expect(description).toBe(
      "Family Hub renovation in Helensvale with design-led planning. Project delivered by Concept Design Construct (CD Construct).",
    );
  });
});

describe("withBrandDescription", () => {
  it("adds both brand variants when missing", () => {
    const description = withBrandDescription("Gold Coast renovation planning and delivery.");
    expect(description).toContain(SITE_NAME);
    expect(description).toContain(SITE_ALTERNATE_NAME);
  });

  it("preserves descriptions that already contain both brand terms", () => {
    const description = withBrandDescription(
      "Concept Design Construct (CD Construct) delivers design-led renovations on the Gold Coast.",
    );
    expect(description).toBe(
      "Concept Design Construct (CD Construct) delivers design-led renovations on the Gold Coast.",
    );
  });
});

describe("buildMetadata", () => {
  it("injects both brand names and keywords on public indexable pages", () => {
    const metadata = buildMetadata({
      title: "Gold Coast Renovation Services",
      description: "Explore renovation services for kitchens and bathrooms.",
      path: "/renovation-services",
    });

    expect(metadata.description).toContain(SITE_NAME);
    expect(metadata.description).toContain(SITE_ALTERNATE_NAME);
    const keywords = Array.isArray(metadata.keywords) ? metadata.keywords : [];
    expect(keywords).toContain(SITE_NAME);
    expect(keywords).toContain(SITE_ALTERNATE_NAME);
  });

  it("does not force brand injection on internal admin paths", () => {
    const metadata = buildMetadata({
      title: "Admin",
      description: "Internal administration area.",
      path: "/admin",
    });

    expect(metadata.description).toBe("Internal administration area.");
  });
});
