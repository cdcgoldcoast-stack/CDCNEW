/**
 * Utility functions for generating URL-safe slugs
 */

/**
 * Generate a URL-safe slug from a project name
 * Removes special characters, converts to lowercase, replaces spaces with hyphens
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    // Replace & with 'and'
    .replace(/&/g, 'and')
    // Remove special characters except spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
};

/**
 * Match a slug against a project name
 * Returns true if the slug could have been generated from the name
 */
export const slugMatches = (slug: string, name: string): boolean => {
  return generateSlug(name) === slug;
};
