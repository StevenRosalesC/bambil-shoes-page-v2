# Bambil Shoes By Dario

> English | [Leer en Español](README.es.md)

An elegant, high-performance e-commerce web platform for **Bambil Shoes By Dario**, an Ecuadorian artisanal footwear workshop based in Colonche (Comuna Bambil Collao), Santa Elena. Master artisan Darío Catuto crafts every pair by hand using genuine full-grain leather and premium materials.

Built with **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, and headless content management via **Strapi CMS v5**.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture & Data Flow](#architecture--data-flow)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Docker Deployment](#docker-deployment)
- [License](#license)

---

## Overview

Bambil Shoes unites ancestral maroquinerie craftsmanship with modern contemporary footwear design. This application serves as the brand's digital flagship store, allowing visitors to explore collections, learn about the shoemaking process, filter products by materials and categories, and complete customized orders directly with the workshop via WhatsApp.

---

## Key Features

### 🛍️ Full-Width Product Catalog & Filter Modal
- **Server-Side Prefetching & Hydration**: Fast initial load powered by Next.js Server Components, hydrated seamlessly on the client with TanStack Query.
- **Filter Modal Dialog**: Accessible overlay with instant search, category checkboxes, collapsible materials list ("Ver más / Ver menos"), and interactive price range slider.
- **Active Filter Chips**: Dynamic chips displayed on top of the catalog allowing single-click filter removal and instant resetting.
- **Smart Sorting**: Prioritizes featured and new arrivals under "Recomendados", with price and alphabetical ordering options.
- **Product Badges**: Prominent visual tags for `Nuevo` (New), `Destacado` (Featured), and material attributes.

### 🛒 Slide-Over Cart & WhatsApp Checkout
- Slide-over cart drawer (`CartDrawer`) with quantity controls, size badges, and real-time total calculation.
- **Direct WhatsApp Checkout**: Converts the shopping bag into a formatted, human-readable WhatsApp message dispatched directly to Darío Catuto's phone number configured in Strapi CMS.

### 📖 Brand Storytelling & Manufacturing Steps (About Page)
- Story of master shoemaker Darío Catuto and the workshop in Bambil Collao.
- Mission, vision, and core corporate values.
- Step-by-step breakdown of the artisanal manufacturing process (corte preciso, ensamblaje tradicional, acabado manual).

### 📍 Interactive Workshop Map & Contact Page
- **Contact Form**: Direct customer inquiries saved to Strapi's `contact-messages` collection with automated validation and UI feedback.
- **Leaflet Interactive Map**: Workshop pin in Colonche, Santa Elena with custom branded marker, directions link, and workshop hours.

### 📱 Floating WhatsApp Button (FAB)
- Accessible floating action button on all pages with expandable speech bubble and customizable default message powered by Strapi global settings.

### 📸 Dynamic Social Feed
- Curated Instagram showcase linking directly to Miss Ecuador sponsorship and brand photography.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **CMS** | [Strapi CMS v5](https://strapi.io/) (`@strapi/client`) |
| **Client State** | [Zustand v5](https://zustand.docs.pmnd.rs/) (Cart & UI stores) |
| **Data Fetching** | [@tanstack/react-query v5](https://tanstack.com/query/latest) |
| **Maps** | [Leaflet](https://leafletjs.com/) & OpenStreetMap |
| **Icons & Fonts** | Material Symbols Outlined, Google Fonts (Playfair Display & Montserrat) |
| **Containerization** | Docker (Multi-stage build with standalone output) |

---

## Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│                      Next.js App                       │
│                                                        │
│  RootLayout (Server Component)                         │
│   ├── getGlobalInfoAction() ───► Strapi CMS /api/global│
│   │                                                    │
│   └── GlobalInfoProvider (Context)                     │
│        ├── Navbar, WhatsAppFAB, Footer, CartDrawer     │
│        └── Pages (Home, About, Catalog, Contact)       │
│             ├── Server Actions (SSR Prefetch)          │
│             └── Hydrated Client Components             │
│                  └── TanStack Query Cache & Zustand    │
└────────────────────────────────────────────────────────┘
```

1. **Root Layout**: Fetches global store data (branding, phone, address, working hours, social networks) on the server and shares it across the client component tree via `GlobalInfoProvider`.
2. **Catalog Page**: Prefetches products and categories on the server; hydrates `useProducts` and `useCategories` client-side for sub-millisecond filtering, searching, and sorting.
3. **Contact Action**: `sendContactMessageAction` sends client form submissions to Strapi's `contact-messages` collection.

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **npm**, **yarn**, or **pnpm**
- Running **Strapi v5** instance (e.g. `http://localhost:1337`)

### 1. Clone the repository
```bash
git clone https://github.com/StevenRosalesC/bambil-shoes-page.git
cd bambil-shoes-page
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the template and adjust values if needed:
```bash
cp .env.example .env.local
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Defined in `.env.local` (and documented in `.env.example`):

| Variable | Description | Default |
| :--- | :--- | :--- |
| `STRAPI_API_URL` | Base URL for Strapi Content API | `http://localhost:1337/api` |
| `NEXT_PUBLIC_STRAPI_URL` | Public origin of Strapi for resolving uploaded media | `http://localhost:1337` |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain used for metadata and SEO | `http://localhost:3000` |

---

## Project Structure

```
bambil-shoes-page/
├── actions/              # Next.js Server Actions (Strapi API loaders & mutations)
│   ├── about.ts          # About page content fetcher
│   ├── categories.ts     # Categories fetcher with slug & pagination
│   ├── contact.ts        # Contact message submission action
│   ├── global.ts         # Global shop info action
│   ├── home.ts           # Home hero & intro fetcher
│   ├── materials.ts      # Leather & synthetic materials fetcher
│   ├── products.ts       # Products query, filtering & featured loaders
│   └── social-posts.ts   # Instagram posts fetcher
├── app/                  # Next.js App Router pages
│   ├── about/            # /about page
│   ├── catalog/          # /catalog page
│   ├── contact/          # /contact page
│   ├── layout.tsx        # Global HTML layout & Provider wrapper
│   └── page.tsx          # Home landing page
├── components/           # UI & Feature Components
│   ├── CartDrawer.tsx    # Slide-over shopping cart & WhatsApp checkout
│   ├── CatalogGrid.tsx   # Product grid, filter modal & active chips
│   ├── CategoriesList.tsx# Vertical interactive category slices
│   ├── ContactGrid.tsx   # Contact form & information cards
│   ├── ContactMap.tsx    # Interactive Leaflet map container
│   ├── FeaturedProducts.tsx # Featured products carousel/grid
│   ├── Footer.tsx        # Footer with links & workshop details
│   ├── Hero.tsx          # Editorial hero section
│   ├── InstagramFeed.tsx # Social proof photography feed
│   ├── Materials.tsx     # Materials showcase section
│   ├── Navbar.tsx        # Navigation bar with active cart counter
│   └── WhatsAppFAB.tsx   # Floating WhatsApp button with speech bubble
├── hooks/                # Custom React Query hooks (useProducts, useCategories)
├── providers/            # Client context providers (GlobalInfoProvider, QueryProvider)
├── store/                # Zustand stores (useCartStore, useUIStore)
├── types/                # TypeScript interfaces & API response contracts
├── public/               # Static assets & brand logos
├── Dockerfile            # Optimized production multi-stage Docker build
└── next.config.ts        # Next.js configuration & image remote patterns
```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with Turbopack |
| `npm run build` | Compiles optimized production build with type checking |
| `npm run start` | Runs the production standalone server |
| `npm run lint` | Runs ESLint check across all project files |

---

## Docker Deployment

The project includes a multi-stage `Dockerfile` configured for Next.js standalone output:

### 1. Build the Docker image
```bash
docker build \
  --build-arg STRAPI_API_URL="https://your-strapi-domain.com/api" \
  --build-arg NEXT_PUBLIC_STRAPI_URL="https://your-strapi-domain.com" \
  --build-arg NEXT_PUBLIC_SITE_URL="https://bambilshoes.com" \
  -t bambil-shoes-page:latest .
```

### 2. Run the container
```bash
docker run -p 3000:3000 \
  -e STRAPI_API_URL="https://your-strapi-domain.com/api" \
  -e NEXT_PUBLIC_STRAPI_URL="https://your-strapi-domain.com" \
  -e NEXT_PUBLIC_SITE_URL="https://bambilshoes.com" \
  bambil-shoes-page:latest
```

---

## License

This project is private and proprietary to **Bambil Shoes By Dario**. All rights reserved.
