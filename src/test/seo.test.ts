import { describe, it, expect } from "vitest";
import {
  formatPageTitle,
  getFullUrl,
  PRODUCTION_DOMAIN,
  SITE_NAME,
  DEFAULT_META,
} from "@/config/seo";

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
