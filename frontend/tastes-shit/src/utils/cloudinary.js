/**
 * cloudinary.js — Frontend Cloudinary URL Helper
 *
 * Layer 2 of the SaaS image pipeline:
 * Stored URL → Add Cloudinary transformation params → Browser gets optimized file
 *
 * What this does:
 * - f_auto  → Cloudinary serves WebP to Chrome, AVIF to newer browsers, JPEG to old ones
 * - q_auto  → Cloudinary picks best quality per device/connection (smart compression)
 * - w_XXXX  → Resize to needed width (don't serve 1600px on a 400px card)
 *
 * Result: Same high-quality feel, 40-60% less bandwidth used
 */

/**
 * Add Cloudinary optimizations to a stored image URL
 *
 * @param {string} url      - Raw Cloudinary URL from DB
 * @param {number} width    - Target display width in px (used for resizing)
 * @returns {string}        - Optimized URL
 *
 * @example
 * // Card thumbnail (small)
 * getOptimizedImageUrl(recipe.image, 400)
 * // → https://res.cloudinary.com/.../upload/f_auto,q_auto,w_400/...
 *
 * // Recipe detail hero (large)
 * getOptimizedImageUrl(recipe.image, 1200)
 * // → https://res.cloudinary.com/.../upload/f_auto,q_auto,w_1200/...
 */
export function getOptimizedImageUrl(url, width = 800) {
  if (!url) return "";

  // Only transform Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;

  // Already has transformations — don't double-add
  if (url.includes("/upload/f_auto")) return url;

  // Insert transformation params after /upload/
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_fill/`
  );
}

/**
 * Preset sizes for common use cases
 * Use these instead of raw numbers for consistency
 */
export const IMG_SIZES = {
  thumbnail:   200,  // Category circle, avatar
  card:        400,  // Recipe card in grid
  cardLarge:   600,  // Trending recipe card (wider)
  hero:       1200,  // Recipe detail page hero image
  full:       1600,  // Full quality (system recipe upload script)
};
