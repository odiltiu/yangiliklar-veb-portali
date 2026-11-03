// NewsAPI bilan ishlash.
// Kalit kodda emas, .env.local faylida saqlanadi: VITE_NEWS_API_KEY=...
// Eslatma: brauzerda ishlaydigan ilovada kalit baribir foydalanuvchiga ko'rinadi.
// To'liq yashirish uchun so'rovni o'z serveringiz orqali yuborish kerak.
export const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export const CATEGORIES = [
  { slug: '', label: 'Bosh sahifa' },
  { slug: 'business', label: 'Biznes' },
  { slug: 'entertainment', label: "Ko'ngilochar" },
  { slug: 'general', label: 'Umumiy' },
  { slug: 'health', label: "Sog'liq" },
  { slug: 'science', label: 'Fan' },
  { slug: 'sports', label: 'Sport' },
  { slug: 'technology', label: 'Texnologiya' },
];

export const categoryLabel = (slug) =>
  CATEGORIES.find((c) => c.slug === (slug || ''))?.label || slug || 'Umumiy';

const CACHE_KEY = 'yangiliklar_cache';

// Yangilik sahifasi yangilansa ham ochilishi uchun oxirgi ro'yxatni saqlab qo'yamiz
export function cacheArticles(category, articles) {
  try {
    sessionStorage.setItem(`${CACHE_KEY}:${category || 'general'}`, JSON.stringify(articles));
  } catch {
    // saqlab bo'lmasa — faqat sahifa yangilanganda tafsilot ochilmaydi
  }
}

export function getCachedArticle(category, index) {
  try {
    const list = JSON.parse(sessionStorage.getItem(`${CACHE_KEY}:${category || 'general'}`) || '[]');
    return list[Number(index)] || null;
  } catch {
    return null;
  }
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('uz-UZ');
}
