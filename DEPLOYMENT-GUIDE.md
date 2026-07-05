# A9 Global Travels & Tours — Free Deployment Guide
# ===============================================

## ဘာတွေလိုအပ်လဲ

- **GitHub account** (အခမဲ့) — code တင်ဖို့
- **Render account** (အခမဲ့) — [render.com](https://render.com) → Sign up with GitHub
- **Vercel account** (အခမဲ့) — [vercel.com](https://vercel.com) → Sign up with GitHub

**တစ်ပြားမှ ကုန်ကျစရာမလိုပါ!**

---

## Step 1: GitHub မှာ Repo ဖန်တီးပါ

(Mac/Windows terminal မှာ အဆင့်ဆင့်လုပ်ပါ)

`ash
cd C:\Users\Dell\.openclaw-autoclaw\workspace\a9global-v2

# Git repo စဖွဲ့
git init
git add .
git commit -m "A9 Global Travel v2 — initial commit"

# GitHub မှာ repo အသစ်ဖန်တီးပြီး push
git remote add origin https://github.com/YOUR_USERNAME/a9global.git
git branch -M main
git push -u origin main
`

---

## Step 2: Render မှာ Backend Deploy

1. **render.com** ကိုသွား → Dashboard → **New Web Service**
2. GitHub repo ကို ချိတ်ပါ
3. Settings:
   - **Name:** a9global-api
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build Command:** npm install
   - **Start Command:** node server.js
   - **Plan:** Free

4. **Environment Variables:**
   `
   PORT=10000
   JWT_SECRET=a9global_jwt_secret_key_change_in_production
   JWT_EXPIRE=30d
   `

5. **Create Web Service** နှိပ်ပါ

6. Deploy ပြီးရင် Render ပေးတဲ့ URL ကိုမှတ်ပါ (ဥပမာ https://a9global-api.onrender.com)
   - ဒါက backend API URL ဖြစ်မယ်

7. **Seed Data:** Render ရဲ့ Shell tab မှာ:
   `ash
   node seed.js
   `

---

## Step 3: Vercel မှာ Frontend Deploy

1. **vercel.com** သွား → **New Project**
2. GitHub repo ကို import လုပ်
3. Settings:
   - **Root Directory:** frontend
   - **Framework Preset:** Next.js
   - **Build Command:** next build
   - **Output Directory:** .next

4. **Environment Variables:**
   `
   NEXT_PUBLIC_API_URL=https://YOUR_RENDER_URL.onrender.com/api
   `
   (Render URL ကို Step 2 က URL နဲ့ အစားထိုးပါ)

5. **Deploy** နှိပ်ပါ

6. Vercel က URL ပေးပါလိမ့်မယ် (ဥပမာ https://a9global.vercel.app)

---

## Step 4: Cloudflare DNS (Domain ရှိရင်)

1. Cloudflare Dashboard → DNS → Records
2. A9 Global domain ရဲ့ CNAME record ကို Vercel URL ဆီ ညွှန်ပါ
3. Cloudflare Proxy (orange cloud) ON ထားပါ

---

## Free Tier Limits

| Service | Limit | လုံလောက်မှု |
|---|---|---|
| **Render** | 750 hrs/month, 512MB RAM, sleeps after 15min idle | လုံလောက် ✅ |
| **Vercel** | 100GB bandwidth, unlimited deployments | အလုံအလောက် ✅ |
| **GitHub** | Unlimited public repos | ✅ |

**Sleep ဖြေရှင်းနည်း:** [UptimeRobot](https://uptimerobot.com) (free) မှာ Render URL ကို ၅ မိနစ်တစ်ခါ ping စေပါ။

---

## Troubleshooting

**Frontend က data မပြတာလား?**
→ Vercel မှာ NEXT_PUBLIC_API_URL env var မှန်မမှန် ပြန်စစ်

**Backend sleep ဖြစ်နေလား?**
→ UptimeRobot မှာ Monitor အသစ်လုပ်၊ HTTP(s) type, Render URL ရိုက်၊ ၅ မိနစ် interval

**Seed data မရှိဘူးလား?**
→ Render Shell မှာ 
ode seed.js run

---

## Admin Login

- **URL:** https://YOUR_VERCEL_URL.vercel.app/admin
- **Email:** admin@a9global.com
- **Password:** admin123

⚠️ Deploy ပြီးရင် production မှာ password ချက်ချင်းပြောင်းပါ!
