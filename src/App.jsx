import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';

const MainLayout = () => (
  <div>
    <Header />
    <main>
      <Outlet />
    </main>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:categoryName" element={<Home />} />
          <Route path="news/:category/:index" element={<NewsDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}