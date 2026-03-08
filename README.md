# QuizCraft — Full Stack SaaS 🎓
**Vite + React + Tailwind CSS + Supabase**

---

## 🗺️ All Routes

| URL | Page | Who |
|-----|------|-----|
| `/` | Landing Page | Everyone |
| `/login` | Login | Teachers |
| `/signup` | Signup | Teachers |
| `/dashboard` | My Quizzes | Teachers (protected) |
| `/create` | Create Quiz | Teachers (protected) |
| `/edit/:id` | Edit Quiz | Teachers (protected) |
| `/results/:id` | Student Results | Teachers (protected) |
| `/quiz/:shareId` | Take Quiz | Students (public) |

---

## 🚀 Setup (3 steps)

### 1. Add your Supabase keys
Open `src/lib/supabase.js` and replace:
```js
const SUPABASE_URL  = 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON = 'YOUR_ANON_KEY'
```

### 2. Install & run
```bash
npm install
npm run dev
```

### 3. Deploy to Vercel
```bash
git init && git add . && git commit -m "init"
# Push to GitHub, then import on vercel.com
```

---

## 💳 Add Payments
Replace "Start Free Trial" buttons in `Pricing.jsx` with your Lemon Squeezy link.
