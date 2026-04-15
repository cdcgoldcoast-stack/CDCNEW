export const REVIEW_STATS = {
  ratingValue: "4.9",
  reviewCount: "50",
  bestRating: "5",
  worstRating: "1",
} as const;

export const REVIEW_RATING_NUMBER = Number(REVIEW_STATS.ratingValue);
export const REVIEW_COUNT_NUMBER = Number(REVIEW_STATS.reviewCount);
