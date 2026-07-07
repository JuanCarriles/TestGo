import type { APIRoute } from 'astro';
import { client } from '../lib/sanity';
import { queries } from '../lib/queries';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://gogineco.com';

  // Fetch dynamic pages from Sanity
  const [especialidades, profesionales] = await Promise.all([
    client.fetch<{ slug: string; _updatedAt: string }[]>(
      `*[_type == "especialidad" && activo != false]{ "slug": slug.current, _updatedAt }`
    ).catch(() => []),
    client.fetch<{ slug: string; _updatedAt: string }[]>(
      `*[_type == "profesional"]{ "slug": slug.current, _updatedAt }`
    ).catch(() => []),
  ]);

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/equipo', priority: '0.8', changefreq: 'weekly' },
    { url: '/especialidades', priority: '0.8', changefreq: 'weekly' },
    { url: '/nosotros', priority: '0.7', changefreq: 'monthly' },
    { url: '/trabaja-con-nosotros', priority: '0.6', changefreq: 'monthly' },
  ];

  const now = new Date().toISOString();

  const urls = [
    // Static pages
    ...staticPages.map((page) => `
    <url>
      <loc>${baseUrl}${page.url}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`),

    // Especialidades
    ...especialidades.map((esp) => `
    <url>
      <loc>${baseUrl}/especialidades/${esp.slug}</loc>
      <lastmod>${esp._updatedAt || now}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`),

    // Profesionales
    ...profesionales.map((prof) => `
    <url>
      <loc>${baseUrl}/equipo/${prof.slug}</loc>
      <lastmod>${prof._updatedAt || now}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`),
  ].join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
