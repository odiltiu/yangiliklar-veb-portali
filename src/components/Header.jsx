import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../lib/news';

export default function Header() {
  return (
    <header className="header-nav">
      <nav aria-label="Yangiliklar bo'limlari">
        {CATEGORIES.map((cat) => (
          <NavLink
            key={cat.slug || 'home'}
            to={cat.slug ? `/category/${cat.slug}` : '/'}
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {cat.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
