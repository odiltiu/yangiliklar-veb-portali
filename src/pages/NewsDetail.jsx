
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function NewsDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  if (!article) {
    return (
      <div className="home-container" style={{ textAlign: 'center' }}>
        <h2>Yangilik topilmadi!</h2>
        <Link to="/">Bosh sahifaga qaytish</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="detail-hero">
        <div className="detail-hero-inner">
          <button onClick={() => navigate(-1)} className="back-btn">
            ⬅ Orqaga
          </button>
          <p className="publish-date">
            Published at {new Date(article.publishedAt || Date.now()).toLocaleDateString()}
          </p>
          <h1 className="detail-hero-title">{article.title}</h1>
          <div className="author-box">
            <div className="author-avatar" />
            <span>{article.author || 'Cameron Williamson'}</span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <p><b>{article.description}</b></p>
        <br />
        <p>{article.content || article.description}</p>
      </div>
    </div>
  );
}