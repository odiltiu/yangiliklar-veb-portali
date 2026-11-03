# 📰 Yangiliklar Veb-Portali (News Portal)

Ushbu loyiha **React** va **React Router** yordamida yaratilgan bo'lib, yangiliklar tasmalarini toifalar bo'yicha ko'rish va har bir xabarning batafsil sahifasiga o'tish imkoniyatini beradi.

## 🚀 Texnologiyalar

- **React 19**
- **React Router DOM**
- **Zamonaviy CSS Dizayn**
- **Vite**

## 🌟 Imkoniyatlar

- Bosh sahifada so'nggi yangiliklar tasmasi
- Kategoriyalar (texnologiya, sport, dunyo va boshqalar) bo'yicha saralash
- Yangilikning tafsilot sahifasi (`/news/:bo'lim/:raqam`), sahifa yangilansa ham ochiladi
- Sarlavha bo'yicha qidiruv va sahifalash
- Responsiv va qulay navigatsiya tizimi

## 🔑 NewsAPI kaliti

Kalit kodda saqlanmaydi. [newsapi.org](https://newsapi.org/account) dan kalit oling va loyiha papkasida
`.env.local` fayl yarating (u git'ga yuklanmaydi):

```
VITE_NEWS_API_KEY=sizning_kalitingiz
```

## 💻 Ishga tushirish

```bash
# Kutubxonalarni o'rnatish
npm install

# Dev rejimida ishga tushirish
npm run dev

# Production uchun build
npm run build
```

---
Dasturchi: [Odil Husayn](https://github.com/odiltiu)
