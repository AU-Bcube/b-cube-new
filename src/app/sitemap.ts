import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://b-cube.kr";

  return [
    { url: base, lastModified: new Date(), priority: 1.0 },
    { url: `${base}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/reviews`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/recruit`, lastModified: new Date(), priority: 0.7 },
  ];
}
