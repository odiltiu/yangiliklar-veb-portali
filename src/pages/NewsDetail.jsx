import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDate, getCachedArticle } from '../lib/news';

export default function NewsDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, index } = useParams();
  // Tuzatildi: oldin ma'lumot faqat location.state'dan olinardi va sahifa yangilansa
  // yoki havola ulashilsa "Yangilik topilmadi" chiqardi
  const article = location.state?.article || getCachedArticle(category, index);

  // To'g'ridan-to'g'ri ochilgan bo'lsa "Orqaga" saytdan chiqib ketmasin
  const goBack = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'));

  if (!article) {
    return (
      <div className="home-container" style={{ textAlign: 'center' }}>
        <h2>Yangilik topilmadi</h2>
        <p>Havola eskirgan bo'lishi mumkin.</p>
        <Link to="/">Bosh sahifaga qaytish</Link>
      </div>
    );
  }

  // NewsAPI matnni qisqartirib "[+1234 chars]" qo'shadi — uni olib tashlaymiz
  const content = (article.content || '').replace(/\s*\[\+\d+ chars\]$/, '');

  return (
    <article>
      <div className="detail-hero">
        <div className="detail-hero-inner">
          <button type="button" onClick={goBack} className="back-btn">
            ⬅ Orqaga
          </button>
          {article.publishedAt && <p className="publish-date">E'lon qilingan: {formatDate(article.publishedAt)}</p>}
          <h1 className="detail-hero-title">{article.title}</h1>
          <div className="author-box">
            <div className="author-avatar" aria-hidden="true" />
            <span>{article.author || article.source?.name || "Muallif ko'rsatilmagan"}</span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        {article.description && <p><b>{article.description}</b></p>}
        {content && content !== article.description && <p style={{ marginTop: 16 }}>{content}</p>}
        {article.url && (
          <p style={{ marginTop: 24 }}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              To'liq maqolani manbada o'qish{article.source?.name ? ` (${article.source.name})` : ''} →
            </a>
          </p>
        )}
      </div>
    </article>
  );
}
