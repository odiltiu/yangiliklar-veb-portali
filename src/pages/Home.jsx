import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { categoryName } = useParams();

  // Siz bergan NewsAPI kaliti:
  const API_KEY = '3d42b84d37414d82b1149c5d383ad425';

useEffect(() => {
    setLoading(true);
    setError(null);

    const categoryParam = categoryName ? `&category=${categoryName}` : '&category=general';
    const targetUrl = `https://newsapi.org/v2/top-headlines?country=us${categoryParam}&apiKey=${API_KEY}`;
    
    // Barqaror ishlaydigan CORS proxy
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    fetch(proxyUrl)
      .then((res) => {
        if (!res.ok) throw new Error('API so`rovida xatolik yuz berdi');
        return res.json();
      })
      .then((data) => {
        if (data.status === 'ok') {
          setArticles(data.articles || []);
        } else {
          setError(data.message || 'Xatolik yuz berdi');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Maʼlumotlarni yuklashda xatolik boʻldi. Tarmoqni tekshirib qayta urinib koʻring.');
        setLoading(false);
      });
  }, [categoryName]);

  const filteredArticles = articles.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Searching..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <h2>NewsAPI'dan ma'lumotlar yuklanmoqda...</h2>}
      
      {error && <h3 style={{ color: 'red' }}>{error}</h3>}

      {!loading && !error && (
        <div className="news-grid">
          {filteredArticles.map((item, index) => (
            <div key={index} className="news-card">
              <div className="card-image-box" style={{ backgroundColor: '#009bf2' }}>
                {item.urlToImage && <img src={item.urlToImage} alt={item.title} />}
                <span className="category-badge">
                  {categoryName || 'General'}
                </span>
              </div>
              <div className="card-body">
                <Link to={`/news/${index}`} state={{ article: item }} className="card-title">
                  {item.title}
                </Link>
                <div className="card-footer">
                  <span>{item.author || 'Unknown Author'}</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button className="page-arrow">&lt;</button>
        <button className="page-num active">1</button>
        <button className="page-num">2</button>
        <button className="page-num">3</button>
        <button className="page-arrow active-arrow">&gt;</button>
      </div>
    </div>
  );
}