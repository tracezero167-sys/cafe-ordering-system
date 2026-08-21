# Cafe Ordering System - Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [ ] Prisma schema updated to PostgreSQL ✓
- [ ] `.env.example` updated ✓
- [ ] `vercel.json` created ✓
- [ ] Code pushed to GitHub
- [ ] PostgreSQL database provisioned (Neon/Prisma Postgres/AWS RDS)
- [ ] All environment variables collected

## 📋 Environment Variables Required for Vercel

```
DATABASE_URL                 - PostgreSQL connection string
NEXTAUTH_SECRET             - Random 32+ character string
NEXTAUTH_URL                - https://your-domain.vercel.app
PUSHER_APP_ID              - (Optional) From Pusher dashboard
PUSHER_KEY                 - (Optional) From Pusher dashboard
PUSHER_SECRET              - (Optional) From Pusher dashboard
PUSHER_CLUSTER             - (Optional) Your Pusher cluster (e.g., mt1)
NEXT_PUBLIC_PUSHER_KEY     - (Optional) Public Pusher key
NEXT_PUBLIC_PUSHER_CLUSTER - (Optional) Your Pusher cluster
WHATSAPP_API_KEY           - (Optional) WhatsApp API
WHATSAPP_PHONE_NUMBER_ID   - (Optional) WhatsApp Phone ID
```

## 🚀 Quick Deploy Steps

1. **GitHub**: Push all changes
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Vercel Setup**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add all environment variables
   - Deploy

3. **Database Migrations** (After first deploy):
   - In Vercel dashboard, go to Settings → Functions
   - Or run via CLI: `vercel env pull && npx prisma migrate deploy`

## 🔧 Local Development

After setup, test locally:
```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Visit: http://localhost:3000

## 📞 Support
- Vercel Docs: https://vercel.com/docs/nextjs
- Prisma Docs: https://www.prisma.io/docs/
- NextAuth Docs: https://next-auth.js.org/
