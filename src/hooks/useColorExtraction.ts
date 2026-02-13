import { useState, useCallback, useRef } from "react";

/**
 * Lab-based color extraction using standard color quantization
 * Extracts the top 5 most dominant colors from images using:
 * 1. Downscaling for performance
 * 2. RGB to Lab color space conversion (perceptual uniformity)
 * 3. Histogram-based quantization with bucket merging
 * 4. Ranking by pixel count
 */

// sRGB to Lab conversion utilities
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  // Using D65 illuminant
  const x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375;
  const y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750;
  const z = lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041;

  return [x, y, z];
}

function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // D65 reference white
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const fx = x / xn;
  const fy = y / yn;
  const fz = z / zn;

  const epsilon = 0.008856;
  const kappa = 903.3;

  const f = (t: number) => (t > epsilon ? Math.cbrt(t) : (kappa * t + 16) / 116);

  const fxr = f(fx);
  const fyr = f(fy);
  const fzr = f(fz);

  const L = 116 * fyr - 16;
  const a = 500 * (fxr - fyr);
  const b = 200 * (fyr - fzr);

  return [L, a, b];
}

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

// Lab to RGB conversion (for final output)
function labToXyz(L: number, a: number, b: number): [number, number, number] {
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const epsilon = 0.008856;
  const kappa = 903.3;

  const xr = Math.pow(fx, 3) > epsilon ? Math.pow(fx, 3) : (116 * fx - 16) / kappa;
  const yr = L > kappa * epsilon ? Math.pow((L + 16) / 116, 3) : L / kappa;
  const zr = Math.pow(fz, 3) > epsilon ? Math.pow(fz, 3) : (116 * fz - 16) / kappa;

  return [xr * xn, yr * yn, zr * zn];
}

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(1, v)) * 255);
}

function xyzToRgb(x: number, y: number, z: number): [number, number, number] {
  const r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  const b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(b)];
}

function labToRgb(L: number, a: number, b: number): [number, number, number] {
  const [x, y, z] = labToXyz(L, a, b);
  return xyzToRgb(x, y, z);
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function labChroma(lab: [number, number, number]): number {
  return Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]);
}

function scoreBucket(bucket: { lab: [number, number, number]; count: number }): number {
  const [L] = bucket.lab;
  const chroma = labChroma(bucket.lab);
  let score = bucket.count;

  // Prioritize large, low-to-mid chroma areas (walls/fixtures/furniture).
  if (chroma < 10) score *= 1.35;
  else if (chroma < 22) score *= 1.15;
  else if (chroma > 45) score *= 0.75;

  // De-emphasize extreme highlights/shadows while still allowing one.
  if (L > 92) score *= 0.6;
  else if (L > 85) score *= 0.85;
  if (L < 10) score *= 0.6;
  else if (L < 18) score *= 0.85;

  return score;
}

// Calculate Delta E (CIE76) - perceptual color difference
function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  if (!lab1 || !lab2 || lab1.length !== 3 || lab2.length !== 3) {
    return Infinity; // Return large distance for invalid inputs
  }
  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
    Math.pow(lab1[1] - lab2[1], 2) +
    Math.pow(lab1[2] - lab2[2], 2)
  );
}

interface ColorBucket {
  labSum: [number, number, number];
  count: number;
}

// Quantize Lab values to bucket keys (reduces color space)
function quantizeLab(L: number, a: number, b: number, binSize: number = 10): string {
  const qL = Math.floor(L / binSize) * binSize;
  const qA = Math.floor((a + 128) / binSize) * binSize - 128;
  const qB = Math.floor((b + 128) / binSize) * binSize - 128;
  return `${qL},${qA},${qB}`;
}

// Try loading image with different approaches for CORS
async function loadImageWithFallback(imageUrl: string): Promise<HTMLImageElement | null> {
  // First try direct load with crossOrigin
  const tryLoad = (url: string, useCors: boolean): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      if (useCors) {
        img.crossOrigin = "anonymous";
      }
      
      const timeout = setTimeout(() => {
        resolve(null);
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(null);
      };
      
      img.src = url;
    });
  };

  // Try direct load with CORS
  let img = await tryLoad(imageUrl, true);
  if (img) return img;

  // Try without CORS (won't work for canvas but might load)
  img = await tryLoad(imageUrl, false);
  if (img) return img;

  // Try with a CORS proxy for external images
  if (imageUrl.startsWith("http") && !imageUrl.includes("localhost")) {
    // Use images.weserv.nl as a CORS proxy
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&w=100&h=100`;
    img = await tryLoad(proxyUrl, true);
    if (img) return img;
  }

  return null;
}

async function extractColorsFromImage(
  imageUrl: string
): Promise<{ lab: [number, number, number]; count: number }[]> {
  try {
    const img = await loadImageWithFallback(imageUrl);
    
    if (!img) {
      console.warn("Could not load image for color extraction:", imageUrl);
      return [];
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      return [];
    }

    // Downscale to max 100px for performance
    const scale = Math.min(1, 100 / Math.max(img.width, img.height));
    canvas.width = Math.max(1, Math.floor(img.width * scale));
    canvas.height = Math.max(1, Math.floor(img.height * scale));

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let imageData: ImageData;
    try {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
      // CORS error - canvas is tainted
      console.warn("CORS error accessing image data:", imageUrl);
      return [];
    }

    const pixels = imageData.data;
    const buckets: Record<string, ColorBucket> = {};

    // Sample every pixel (image is already downscaled)
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      const [L, labA, labB] = rgbToLab(r, g, b);
      const key = quantizeLab(L, labA, labB, 8);

      if (!buckets[key]) {
        buckets[key] = { labSum: [0, 0, 0], count: 0 };
      }
      buckets[key].labSum[0] += L;
      buckets[key].labSum[1] += labA;
      buckets[key].labSum[2] += labB;
      buckets[key].count++;
    }

    // Convert buckets to array with centroid Lab values
    const result = Object.values(buckets)
      .filter(bucket => bucket.count > 0)
      .map((bucket) => ({
        lab: [
          bucket.labSum[0] / bucket.count,
          bucket.labSum[1] / bucket.count,
          bucket.labSum[2] / bucket.count,
        ] as [number, number, number],
        count: bucket.count,
      }));

    return result;
  } catch (error) {
    console.warn("Error extracting colors from image:", imageUrl, error);
    return [];
  }
}

function mergeSimilarBuckets(
  buckets: { lab: [number, number, number]; count: number }[],
  threshold: number = 15
): { lab: [number, number, number]; count: number }[] {
  if (buckets.length === 0) return [];

  // Filter out invalid buckets
  const validBuckets = buckets.filter(
    b => b && b.lab && Array.isArray(b.lab) && b.lab.length === 3 && b.count > 0
  );

  if (validBuckets.length === 0) return [];

  // Sort by count descending
  const sorted = [...validBuckets].sort((a, b) => b.count - a.count);
  const merged: { lab: [number, number, number]; count: number }[] = [];

  for (const bucket of sorted) {
    let foundMerge = false;

    for (const existing of merged) {
      const distance = deltaE(bucket.lab, existing.lab);
      if (distance < threshold) {
        // Merge into existing bucket (weighted average)
        const totalCount = existing.count + bucket.count;
        existing.lab = [
          (existing.lab[0] * existing.count + bucket.lab[0] * bucket.count) / totalCount,
          (existing.lab[1] * existing.count + bucket.lab[1] * bucket.count) / totalCount,
          (existing.lab[2] * existing.count + bucket.lab[2] * bucket.count) / totalCount,
        ];
        existing.count = totalCount;
        foundMerge = true;
        break;
      }
    }

    if (!foundMerge) {
      merged.push({ 
        lab: [...bucket.lab] as [number, number, number], 
        count: bucket.count 
      });
    }
  }

  return merged;
}

export function useColorExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const extractionCache = useRef<Record<string, { lab: [number, number, number]; count: number }[]>>({});

  const extractFromImages = useCallback(async (imageUrls: string[]): Promise<string[]> => {
    if (imageUrls.length === 0) {
      return [];
    }

    setIsExtracting(true);

    try {
      // Extract color buckets from all images
      const allBucketPromises = imageUrls.map(async (url) => {
        // Check cache
        if (extractionCache.current[url] && extractionCache.current[url].length > 0) {
          return extractionCache.current[url];
        }

        const buckets = await extractColorsFromImage(url);
        if (buckets.length > 0) {
          extractionCache.current[url] = buckets;
        }
        return buckets;
      });

      const allBucketArrays = await Promise.all(allBucketPromises);

      // Combine all buckets from all images
      const combinedBuckets: { lab: [number, number, number]; count: number }[] = [];
      
      for (const bucketArray of allBucketArrays) {
        if (bucketArray && Array.isArray(bucketArray)) {
          for (const bucket of bucketArray) {
            if (bucket && bucket.lab && bucket.count > 0) {
              combinedBuckets.push(bucket);
            }
          }
        }
      }

      if (combinedBuckets.length === 0) {
        return [];
      }

      // Merge similar buckets across all images
      const mergedBuckets = mergeSimilarBuckets(combinedBuckets, 12);

      if (mergedBuckets.length === 0) {
        return [];
      }

      const scoredBuckets = mergedBuckets.map((bucket) => ({
        ...bucket,
        chroma: labChroma(bucket.lab),
        lightness: bucket.lab[0],
        score: scoreBucket(bucket),
      }));

      // Take top buckets and ensure they're distinct
      const finalColors: string[] = [];
      const finalLabs: [number, number, number][] = [];
      let pickedLight = false;
      let pickedDark = false;

      scoredBuckets.sort((a, b) => b.score - a.score);

      for (const bucket of scoredBuckets) {
        if (finalColors.length >= 5) break;

        if (!bucket || !bucket.lab) continue;

        if (bucket.lightness > 92 && pickedLight) continue;
        if (bucket.lightness < 10 && pickedDark) continue;

        // Check if this color is distinct from already selected colors
        const isDistinct = finalLabs.every((existing) => deltaE(existing, bucket.lab) >= 20);

        if (isDistinct) {
          const [r, g, b] = labToRgb(bucket.lab[0], bucket.lab[1], bucket.lab[2]);
          finalColors.push(rgbToHex(r, g, b));
          finalLabs.push([...bucket.lab] as [number, number, number]);
          if (bucket.lightness > 92) pickedLight = true;
          if (bucket.lightness < 10) pickedDark = true;
        }
      }

      if (finalColors.length < 5) {
        for (const bucket of scoredBuckets) {
          if (finalColors.length >= 5) break;
          if (!bucket || !bucket.lab) continue;
          const isDistinct = finalLabs.every((existing) => deltaE(existing, bucket.lab) >= 18);
          if (!isDistinct) continue;
          const [r, g, b] = labToRgb(bucket.lab[0], bucket.lab[1], bucket.lab[2]);
          finalColors.push(rgbToHex(r, g, b));
          finalLabs.push([...bucket.lab] as [number, number, number]);
        }
      }

      return finalColors;
    } catch (error) {
      console.error("Color extraction error:", error);
      return [];
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    extractionCache.current = {};
  }, []);

  return {
    extractFromImages,
    isExtracting,
    clearCache,
  };
}
