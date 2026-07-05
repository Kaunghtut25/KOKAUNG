# A9 Global - Free 24/7 Deployment Guide

## Architecture
```
GitHub Repo → Vercel (Frontend - 24/7) → Render (Backend - kept alive by UptimeRobot)
```

## What You Need
- [ ] Free GitHub account → https://github.com/signup
- [ ] Free Vercel account → https://vercel.com/signup (Login with GitHub)
- [ ] Free Render account → https://render.com/register (Login with GitHub)
- [ ] Free UptimeRobot account → https://uptimerobot.com/signUp

---

## Step 1: Push to GitHub

Open PowerShell and run:

```powershell
cd C:\Users\Dell\.openclaw-autoclaw\workspace\a9global-v2

# Initialize git
git init
git add -A
git commit -m "Initial commit - A9 Global Travels & Tours"

# Create repo on GitHub (public or private), then:
git remote add origin https://github.com/YOUR_USERNAME/a9global.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
5. Add Environment Variables:
   ```
   JWT_SECRET = a9global_jwt_secret_2026_change_me
   NODE_ENV   = production
   ```
6. Click **Create Web Service**
7. 📋 **Save the URL** (e.g., `https://a9global-api.onrender.com`)

Wait for deploy to finish (first time takes 3-5 minutes).

---

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repo → `a9global`
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
4. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL = https://YOUR_RENDER_URL.onrender.com
   ```
5. Click **Deploy**
6. 📋 **Save the Vercel URL** (e.g., `https://a9global.vercel.app`)

---

## Step 4: Setup UptimeRobot (Keep Render Alive)

1. Go to https://uptimerobot.com
2. Click **+ Add New Monitor**
3. Settings:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://YOUR_RENDER_URL.onrender.com/api/booking-receiver`
   - **Monitoring Interval**: 5 minutes
   - **Monitor Name**: A9 Backend Keep-alive
4. Click **Create Monitor**

✅ Done! Your backend will never sleep.

---

## Step 5: Connect Your Own Domain (Optional, Later)

1. Buy domain from Namecheap (e.g., `a9globaltravel.com`)
2. In Vercel → Settings → Domains → Add domain
3. Add DNS records in Namecheap (Vercel will tell you which)
4. In Render → Settings → Custom Domain → Add `api.yourdomain.com`

---

## What Happens When You Update Code

```powershell
# After making changes locally:
git add -A
git commit -m "Updated Navbar"
git push

# Vercel + Render auto-deploy within 1-2 minutes
```

---

## Cost Summary

| Service | Monthly Cost |
|---------|-------------|
| Vercel | $0 |
| Render | $0 |
| UptimeRobot | $0 |
| Domain (optional) | ~$10/year |
| **Total** | **$0/month** |
