import {NavLink} from "react-router-dom";

export default function Header() {
    const categories = [
        'Home', 'Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology'
    ];
    return (
        <header className="header-nav">
            <nav>
                {categories.map((cat) => (
                    <NavLink key={cat} 
                    to={cat === 'Home' ? '/' : `/category/${cat.toLowerCase()}`} 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        {cat}
                    </NavLink>
                ))}
            </nav>
        </header>
    );
}