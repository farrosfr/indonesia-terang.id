import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const data = JSON.parse(readFileSync(new URL("./src/data.json", import.meta.url), "utf8"));

const pageRedirects = {
  "/index.php/sample-page/": "/",
  "/index.php/author/indonesiaterang/": "/berita/",
  "/index.php/7b3c2-blog-archive/": "/berita/",
  "/index.php/7b3c2-blog-archive/page/2/": "/berita/",
  "/index.php/7b3c2-contact/": "/kontak/",
  "/index.php/7b3c2-patterns/": "/berita/",
  "/index.php/7b3c2-typography/": "/berita/",
};

const categoryRedirects = Object.fromEntries(
  data.categories
    .filter((category) => ["layanan", "riset", "studi-kelayakan", "pembelajaran", "komunitas", "program"].includes(category.slug))
    .map((category) => {
      const parent = data.categories.find((item) => item.id === category.parent);
      const destination = parent?.slug === "layanan" ? `/layanan/${category.slug}/` : `/${category.slug}/`;
      return [`/index.php/category/${parent?.slug === "layanan" ? `layanan/${category.slug}` : category.slug}/`, destination];
    }),
);

const postRedirects = Object.fromEntries(
  data.posts.map((post) => [new URL(post.originalUrl).pathname, `/${post.slug}/`]),
);

export default defineConfig({
  site: "https://indonesia-terang.id",
  trailingSlash: "always",
  integrations: [sitemap()],
  redirects: {
    ...pageRedirects,
    ...categoryRedirects,
    ...postRedirects,
  },
});
