import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/catalogo", "/categorias", "/produtos"],
      disallow: ["/admin", "/api", "/minha-conta", "/checkout", "/carrinho"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
