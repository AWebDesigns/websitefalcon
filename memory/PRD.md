# Falcon Web Studio - Product Requirements Document

## Original Problem Statement
Build a modern, high-end website for a web design agency called **Falcon Web Studio**. Scandinavian minimal design (like Stripe/Linear), black, white, and electric blue accents.

## Core Features (Implemented)
- Hero section with CTAs
- Services section (Website Design, Redesign, Conversion Optimization)
- Portfolio 2x2 grid with individual image cycling (4-second transitions per card). WAbilvård card cycles through 3 user-provided screenshots.
- Process timeline (Strategy, Design, Development, Launch)
- Why Choose Us section
- Questions section with WhatsApp/Email
- CTA section for free demo
- Lead capture modal with form -> saves to MongoDB
- Password-protected admin dashboard at /admin
- Email notifications via Resend API
- EN/SV language switcher
- Flying falcon scroll animation
- Responsive design

## Tech Stack
- **Frontend:** React, TailwindCSS, framer-motion, lucide-react, shadcn/ui
- **Backend:** FastAPI, motor (async MongoDB), Resend
- **Database:** MongoDB

## Architecture
All frontend code is in `/app/frontend/src/App.js` (single-file SPA).
Backend is in `/app/backend/server.py`.

## API Endpoints
- `POST /api/leads` - Submit lead from modal form
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/leads` - Fetch leads (protected)

## Completed Work
- Full website with all sections
- Flying falcon animation
- Lead capture + admin dashboard
- Resend email notifications
- EN/SV translations
- Portfolio: 2x2 grid layout with per-card image cycling (4s interval)
- WAbilvård project: 3 screenshots cycling in first card

## Known Issues
- Resend notifications go to abbesalem977@gmail.com (free tier limitation). User needs to verify domain to switch to falconwebdesignit@gmail.com
- "Made with Emergent" badge is a platform watermark (cannot be removed in preview)

## Backlog
- P1: User will provide more portfolio images to replace remaining placeholders
- P2: Replace placeholder client logos in "Trusted by" section
- P2: Switch notification email after Resend domain verification
