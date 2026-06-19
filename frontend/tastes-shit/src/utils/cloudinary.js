// Helper to optimize Cloudinary image URLs based on screen size
// f_auto = auto format (webp/avif), q_auto = auto quality, w_ = width

export function getOptimizedImageUrl(url, width = 800) {
  if (!url) return "";

  if (!url.includes("res.cloudinary.com")) return url;

  if (url.includes("/upload/f_auto")) return url;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_fill/`
  );
}

// Standard sizes used across the app for consistent image quality
export const IMG_SIZES = {
  thumbnail: 200,
  card: 400,
  cardLarge: 600,
  hero: 1200,
  full: 1600,
};