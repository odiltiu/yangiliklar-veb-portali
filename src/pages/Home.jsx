import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_KEY, cacheArticles, categoryLabel, formatDate } from '../lib/news';

const PAGE_SIZE = 9;

export default function Home() {
  const { categoryName } = useParams();
  const category = categoryName || 'general';

  // Natija qaysi bo'lim uchun ekanini ham saqlaymiz: bo'lim almashganda
  // "yuklanmoqda" holati effekt ichida setState qilmasdan hisoblanadi
  const [result, setResult] = useState({ category: null, articles: [], error: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState({ category, n: 1 });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!API_KEY) return;
    const controller = new AbortController();
    const targetUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=100&apiKey=${API_KEY}`;
    // NewsAPI'ning bepul tarifi brauzerdan to'g'ridan-to'g'ri so'rovga ruxsat bermaydi, shuning uchun proksi
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    fetch(proxyUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`API so'rovida xatolik (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (data.status !== 'ok') throw new Error(data.message || 'Xatolik yuz berdi');
        const articles = (data.articles || []).filter((a) => a.title && a.title !== '[Removed]');
        cacheArticles(category, articles);
        setResult({ category, articles, error: null });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setResult({ category, articles: [], error: err.message || "Ma'lumotlarni yuklab bo'lmadi" });
      });

    return () => controller.abort();
  }, [category, reloadKey]);

  const loading = API_KEY && result.category !== category;
  const error = !API_KEY
    ? "NewsAPI kaliti topilmadi. Loyiha papkasida .env.local faylini yarating: VITE_NEWS_API_KEY=kalitingiz"
    : result.error;

  const q = searchTerm.trim().toLowerCase();
  // Asl indeksni saqlaymiz — tafsilot sahifasi shu bo'yicha ochiladi
  const filtered = result.articles
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !q || item.title.toLowerCase().includes(q));

  // Bo'lim yoki qidiruv o'zgarsa, 1-sahifaga qaytamiz
  const currentPage = page.category === `${category}|${q}` ? page.n : 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const goTo = (n) => {
    setPage({ category: `${category}|${q}`, n });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <div className="search-box">
        <label htmlFor="news-search" className="sr-only">Yangilik qidirish</label>
        <input
          id="news-search"
          type="search"
          placeholder="Sarlavha bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <h2 role="status">Yangiliklar yuklanmoqda...</h2>}

      {!loading && error && (
        <div role="alert" className="error-box">
          <p>{error}</p>
          {API_KEY && (
            <button type="button" className="page-num" onClick={() => { setResult((r) => ({ ...r, category: null })); setReloadKey((k) => k + 1); }}>
              Qayta urinish
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && <p className="empty-note">Yangilik topilmadi.</p>}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="news-grid">
            {pageItems.map(({ item, index }) => (
              <article key={item.url || index} className="news-card">
                <div className="card-image-box" style={{ backgroundColor: '#009bf2' }}>
                  {item.urlToImage && (
                    <img
                      src={item.urlToImage}
                      alt=""
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <span className="category-badge">{categoryLabel(categoryName)}</span>
                </div>
                <div className="card-body">
                  <Link to={`/news/${category}/${index}`} state={{ article: item }} className="card-title">
                    {item.title}
                  </Link>
                  <div className="card-footer">
                    <span>{item.author || item.source?.name || "Muallif ko'rsatilmagan"}</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Tuzatildi: oldin sahifalash tugmalari soxta edi va hech narsa qilmasdi */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Sahifalar">
              <button type="button" className="page-arrow" onClick={() => goTo(safePage - 1)} disabled={safePage === 1} aria-label="Oldingi sahifa">
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`page-num ${n === safePage ? 'active' : ''}`}
                  onClick={() => goTo(n)}
                  aria-current={n === safePage ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}
              <button type="button" className="page-arrow" onClick={() => goTo(safePage + 1)} disabled={safePage === totalPages} aria-label="Keyingi sahifa">
                &gt;
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
