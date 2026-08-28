import { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/catalogo", "/categorias", "/produto"],
      disallow: ["/admin", "/api"],
    },
    sitemap: `${env.appUrl}/sitemap.xml`,
  };
}
