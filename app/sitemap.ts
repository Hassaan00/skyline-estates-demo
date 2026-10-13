import type { MetadataRoute } from "next";
import { properties, brand } from "@/lib/data";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/properties", "/app", ...properties.map((p) => "/properties/" + p.id)].map((p) => ({ url: brand.url + p, lastModified: new Date() })); }
