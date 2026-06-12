# Padmashree College Full-Stack Web Portal

A complete, modern, and production-ready full-stack website for Padmashree College (Tinkune, Kathmandu, Nepal). This application is built as a single-repo Next.js web application utilizing dynamic page renders, email/newsletter broadcast services, direct image storage uploads, database validation models, and a protected administrative back office panel.

## Features

- **Responsive Landing Page**: Sleek design featuring Navy & Gold college colors, an interactive statistics showcase, a custom dynamic particle background animation, testimonials slider, filterable events list, countdown timer CTA, and accordion-based frequently asked questions.
- **Academic Program Details**: Individual program dynamic routes (`/programs/[slug]`) for **BIT, BCA, BHM, BBA**, and **B.Tech Food** with curated details, features, duration, and direct link actions to apply.
- **Online Admission Form**: Secure client-validated application submission system (`/apply`) connected with real-time status updates and email notification alerts.
- **Interactive Galleries & Notices**: Lightweight public gallery view with lightbox, paginated news notice board (`/news`), and academic event feeds (`/events`).
- **Protected Admin Panel**:
  - Secure credential-based administrator login.
  - Interactive dashboard overview outlining overall registration stats, email notice alerts, subscriber numbers, and recent admission tables.
  - Complete CRUD modules with pop-up models for **News Notices**, **Upcoming Events**, and **Student Reviews**.
  - Advanced **Admission Desk** to filter submissions, view student contact forms, modify request stages (`pending` -> `reviewed`/`accepted`/`rejected`), and run tabular CSV dumps.
  - Direct image buffer streams to Cloudinary in **Gallery Hub** uploads.
  - Integrated **Newsletter Composer** allowing subject editing, markdown text entry, and scheduled background SMTP broadcasts.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider)
- **Styling**: Tailwind CSS v4 & custom keyframe animations
- **SMTP Engine**: Nodemailer
- **Media Hosting**: Cloudinary API

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **NPM**: `v10.x` or higher
- **PostgreSQL**: A running local or cloud instance.

### 2. Installation
Clone or navigate to the project directory and install the workspace dependencies:

```bash
cd padmashree-college
npm install
```

### 3. Environment Configurations
Duplicate `.env.example` to create a local environment file `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and input your actual credentials:
- **DATABASE_URL**: The connection string for your PostgreSQL database.
- **NEXTAUTH_SECRET**: Generate one by running `openssl rand -base64 32`.
- **NEXTAUTH_URL**: Canonical root URL of the deployment (e.g., `http://localhost:3000` for local or your custom domain/Vercel URL for production).
- **EMAIL_USER** & **EMAIL_PASS**: SMTP credentials for system alerts (e.g. Gmail App Passwords).
- **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET**: Credentials for Cloudinary image uploading.
- **CLOUDINARY_UPLOAD_PRESET**: Unsigned or signed upload preset name configured in Cloudinary (required for direct frontend or serverless stream uploads).

### 4. Database Setup & Seeding
Prisma manages the database schema and initialization. Generate the Prisma Client and run the database migration to build the PostgreSQL tables:

```bash
# Generate client and run database schemas
npm run prisma:migrate

# Seed initial system settings, academic programs, and the default admin user
npm run prisma:seed
```

#### Database Models Configuration
Our database has been upgraded with the following structures in `prisma/schema.prisma`:
- **GalleryAlbum**: Holds the metadata for photo galleries (`id`, `title`, `description`, `coverImage`, `createdAt`, `updatedAt`).
- **GalleryPhoto**: Represents images nested inside an album (`id`, `albumId` referencing `GalleryAlbum` with cascade deletion, `imageUrl`, `caption`, `order` for drag/drop custom sequencing).
- **News**: Stores announcements and events (`id`, `title`, `slug` unique, `content` supporting Tiptap Rich HTML, `excerpt`, `coverImage`, `category` supporting `ANNOUNCEMENT` or `EVENT`, `eventDate` required for events, `published` boolean, `createdAt`, `updatedAt`).

#### Seed Admin Credentials
- **Email**: `admin@padmashreecollege.edu.np`
- **Password**: `PadmashreeAdmin123!`

*(Make sure to change these credentials immediately upon logging into the admin console)*

### 5. Running the Application

To launch the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

To build and launch the optimized production bundle:
```bash
npm run build
npm run start
```

---

## Directory Structure

```
padmashree-college/
├── app/                      # Next.js App Router Pages & API Routes
│   ├── (public)/             # Main website pages (Hero, Program pages, etc.)
│   ├── admin/                # Back-office admin views (protected)
│   ├── api/                  # Backend REST Endpoint Controllers
│   ├── globals.css           # Styling theme config (Tailwind v4 theme variables)
│   ├── layout.tsx            # Global layout configuration
│   └── providers.tsx         # NextAuth session context bindings
├── components/               # Shareable Layout and Interface Components
│   ├── home/                 # Component widgets inside the main home page
│   ├── layout/               # Nav, Footer, and Notification wrappers
│   └── ui/                   # Re-usable buttons, dialog cards, loader modals, toasts
├── hooks/                    # Reusable React hooks
├── lib/                      # Database clients, auth providers, email, and Cloudinary clients
├── prisma/                   # Database schemas and initialization seeds
└── README.md                 # Project handbook
```

---

## Deployment Guide

### Database (Railway / Supabase)
1. Provision a **PostgreSQL** instance on Railway or Supabase.
2. Copy the external transaction connection URL string.
3. Supply the database string as `DATABASE_URL` environment variable.

### Web Server (Vercel)
1. Import this repository into Vercel.
2. Add all environment keys configured in `.env.local` to the Vercel Environment Variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `NEXTAUTH_SECRET` (custom JWT token signing secret)
   - `NEXTAUTH_URL` (set to your canonical Vercel production domain, e.g. `https://your-app.vercel.app`)
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `ADMIN_EMAIL` (SMTP settings for dynamic alerts)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET` (Cloudinary integrations)
3. Configure the Build Settings:
   - Framework preset: `Next.js`
   - Build command: `npx prisma generate && npm run build`
4. Deploy the repository.
