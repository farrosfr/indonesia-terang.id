import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";

const origin = "https://indonesia-terang.id";
const api = `${origin}/index.php/wp-json/wp/v2`;
const root = process.cwd();

const coverageCsv = join(root, "indonesia-terang.id-Coverage-Valid-2026-05-25", "Table.csv");

const htmlToText = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&hellip;/g, "...")
    .replace(/\s+/g, " ")
    .trim();

const toLocalUpload = (url = "") =>
  url.replace(`${origin}/wp-content/uploads/`, "/uploads/");

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed ${response.status}: ${url}`);
  return response.json();
}

async function download(url) {
  const clean = url.split("?")[0];
  if (!clean.includes("/wp-content/uploads/")) return;

  const relative = decodeURI(clean.split("/wp-content/uploads/")[1]);
  const target = join(root, "public", "uploads", relative);
  await mkdir(dirname(target), { recursive: true });

  const response = await fetch(clean);
  if (!response.ok) {
    console.warn(`skip ${response.status}: ${clean}`);
    return;
  }

  await pipeline(response.body, createWriteStream(target));
}

const [postsRaw, pagesRaw, categoriesRaw] = await Promise.all([
  fetchJson(`${api}/posts?per_page=100&_embed`),
  fetchJson(`${api}/pages?per_page=100&_embed`),
  fetchJson(`${api}/categories?per_page=100`),
]);

const categories = categoriesRaw.map((category) => ({
  id: category.id,
  name: htmlToText(category.name),
  slug: category.slug,
  parent: category.parent,
  link: category.link,
}));

const categoryById = new Map(categories.map((category) => [category.id, category]));

const posts = postsRaw
  .filter((post) => !["post-1", "post-2", "post-4", "5-habits-of-insanely-creative-people-i-am-the-post-title", "hello-world-2"].includes(post.slug))
  .map((post) => {
    const featured = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
    return {
      id: post.id,
      slug: post.slug,
      title: htmlToText(post.title.rendered),
      date: post.date,
      excerpt: htmlToText(post.excerpt.rendered).replace(/\s*Selengkapnya .*/i, ""),
      image: toLocalUpload(featured),
      originalImage: featured,
      originalUrl: post.link,
      categories: post.categories
        .map((id) => categoryById.get(id))
        .filter(Boolean)
        .map(({ id, name, slug, parent }) => ({ id, name, slug, parent })),
      content: post.content.rendered
        .replaceAll(`${origin}/wp-content/uploads/`, "/uploads/")
        .replaceAll(`${origin}/index.php/`, "/"),
    };
  });

const pages = pagesRaw.map((page) => ({
  id: page.id,
  slug: page.slug,
  title: htmlToText(page.title.rendered),
  originalUrl: page.link,
  content: page.content.rendered
    .replaceAll(`${origin}/wp-content/uploads/`, "/uploads/")
    .replaceAll(`${origin}/index.php/`, "/"),
}));

const indexed = (await import("node:fs/promises"))
  .readFile(coverageCsv, "utf8")
  .then((csv) =>
    csv
      .split(/\r?\n/)
      .slice(1)
      .map((line) => line.split(",")[0])
      .filter(Boolean),
  )
  .catch(() => []);

const uploadUrls = new Set();
for (const item of [...postsRaw, ...pagesRaw]) {
  const text = JSON.stringify(item);
  for (const match of text.matchAll(/https:\/\/indonesia-terang\.id\/wp-content\/uploads\/[^"',\\\s<>]+/g)) {
    uploadUrls.add(match[0]);
  }
}

await Promise.all([...uploadUrls].map(download));

await writeFile(
  join(root, "src", "data.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), origin, categories, posts, pages, indexed }, null, 2),
);

console.log(`Synced ${posts.length} posts, ${pages.length} pages, ${categories.length} categories, ${uploadUrls.size} uploads.`);
