import { describe, it, expect } from "vitest";
import {
  generateFAQSchema,
  generateProjectSchema,
  generateBreadcrumbSchema,
  generateItemListSchema,
  generateLocalBusinessSchema,
} from "@/lib/structured-data";
import { PRODUCTION_DOMAIN, SITE_NAME } from "@/config/seo";

describe("generateFAQSchema", () => {
  it("produces valid FAQPage schema", () => {
    const schema = generateFAQSchema([
      { question: "What is a renovation?", answer: "A home improvement project." },
      { question: "How long does it take?", answer: "It varies." },
    ]);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]["@type"]).toBe("Question");
    expect(schema.mainEntity[0].name).toBe("What is a renovation?");
    expect(schema.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe("A home improvement project.");
  });

  it("handles empty FAQ list", () => {
    const schema = generateFAQSchema([]);
    expect(schema.mainEntity).toHaveLength(0);
  });
});

describe("generateProjectSchema", () => {
  const baseProject = {
    name: "Family Hub",
    description: "A kitchen renovation",
    location: "Burleigh Heads",
    image: "https://example.com/image.jpg",
    category: "kitchen",
    path: "/renovation-projects/family-hub",
  };

  it("produces WebPage with CreativeWork mainEntity", () => {
    const schema = generateProjectSchema(baseProject);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("WebPage");
    expect(schema.url).toBe(`${PRODUCTION_DOMAIN}/renovation-projects/family-hub`);
    expect(schema.mainEntity["@type"]).toBe("CreativeWork");
    expect(schema.mainEntity.name).toBe("Family Hub");
    expect(schema.mainEntity.genre).toBe("kitchen");
  });

  it("uses absolute URL for relative images", () => {
    const schema = generateProjectSchema({
      ...baseProject,
      image: "/images/project.jpg",
    });
    expect(schema.image).toBe(`${PRODUCTION_DOMAIN}/images/project.jpg`);
  });

  it("preserves absolute image URLs", () => {
    const schema = generateProjectSchema(baseProject);
    expect(schema.image).toBe("https://example.com/image.jpg");
  });

  it("includes optional fields when provided", () => {
    const schema = generateProjectSchema({
      ...baseProject,
      publishedAt: "2024-01-15T00:00:00.000Z",
      modifiedAt: "2024-06-01T00:00:00.000Z",
      authorName: "John Builder",
      tags: ["kitchen", "modern"],
    });

    expect(schema.mainEntity.datePublished).toBe("2024-01-15T00:00:00.000Z");
    expect(schema.mainEntity.dateModified).toBe("2024-06-01T00:00:00.000Z");
    expect(schema.mainEntity.author.name).toBe("John Builder");
    expect(schema.mainEntity.keywords).toBe("kitchen, modern");
  });
});

describe("generateBreadcrumbSchema", () => {
  it("produces BreadcrumbList with correct positions", () => {
    const schema = generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Projects", url: "/renovation-projects" },
      { name: "Family Hub", url: "/renovation-projects/family-hub" },
    ]);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[2].position).toBe(3);
    expect(schema.itemListElement[0].item).toBe(`${PRODUCTION_DOMAIN}/`);
  });
});

describe("generateItemListSchema", () => {
  it("produces ItemList with CreativeWork items", () => {
    const schema = generateItemListSchema([
      { name: "Project A", url: "/projects/a", image: "/img/a.jpg", position: 1 },
      { name: "Project B", url: "/projects/b", image: "https://cdn.example.com/b.jpg", position: 2 },
    ]);

    expect(schema["@type"]).toBe("ItemList");
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0].item.name).toBe("Project A");
    expect(schema.itemListElement[0].item.url).toBe(`${PRODUCTION_DOMAIN}/projects/a`);
    expect(schema.itemListElement[0].item.image).toBe(`${PRODUCTION_DOMAIN}/img/a.jpg`);
    expect(schema.itemListElement[1].item.image).toBe("https://cdn.example.com/b.jpg");
  });
});

describe("generateLocalBusinessSchema", () => {
  it("produces valid LocalBusiness schema", () => {
    const schema = generateLocalBusinessSchema();

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema.name).toBe(SITE_NAME);
    expect(schema.url).toBe(PRODUCTION_DOMAIN);
    expect(schema.areaServed).toBeDefined();
    expect(schema.openingHoursSpecification).toBeDefined();
    expect(schema.hasOfferCatalog).toBeDefined();
  });
});
