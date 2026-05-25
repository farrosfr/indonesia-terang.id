import data from "./data.json";

export const posts = data.posts;
export const categories = data.categories;

export const categoryPath = (slug) => {
  if (["riset", "studi-kelayakan", "pembelajaran"].includes(slug)) return `/layanan/${slug}/`;
  return `/${slug}/`;
};

export const postsByCategory = (slug) =>
  posts.filter((post) => post.categories.some((category) => category.slug === slug));

export const formatDate = (date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export const featuredPosts = posts.slice(0, 6);

export const serviceGroups = [
  {
    title: "Riset EBT",
    slug: "riset",
    description: "Kajian potensi energi baru terbarukan, pemetaan produk, dan riset lapangan untuk kebutuhan proyek.",
  },
  {
    title: "Studi Kelayakan",
    slug: "studi-kelayakan",
    description: "Analisis teknis dan bisnis untuk memastikan inisiatif energi berjalan realistis, terukur, dan berkelanjutan.",
  },
  {
    title: "Pembelajaran",
    slug: "pembelajaran",
    description: "Kelas Energy Hack untuk PV, kendaraan listrik, dan manajemen energi bersama praktisi.",
  },
];

export const focusStats = [
  ["1.000+", "titik listrik desa sebagai arah dampak"],
  ["3", "komunitas pembelajaran energi"],
  ["5", "jalur layanan riset, studi, edukasi, komunitas, program"],
];
