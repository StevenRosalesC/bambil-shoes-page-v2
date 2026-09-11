# Bambil Shoes By Dario

> [Read in English](README.md) | Español

Una plataforma web de comercio electrónico elegante y de alto rendimiento para **Bambil Shoes By Dario**, taller de calzado artesanal ecuatoriano ubicado en Colonche (Comuna Bambil Collao), Santa Elena. El maestro artesano Darío Catuto confecciona cada par a mano utilizando cuero genuino de grano entero y materiales sintéticos de primera calidad.

Desarrollado con **Next.js (App Router)**, **React 19**, **Tailwind CSS v4** y gestión de contenido headless mediante **Strapi CMS v5**.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura y Flujo de Datos](#arquitectura-y-flujo-de-datos)
- [Primeros Pasos](#primeros-pasos)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Despliegue con Docker](#despliegue-con-docker)
- [Licencia](#licencia)

---

## Descripción General

Bambil Shoes combina la marroquinería artesanal tradicional con el diseño de calzado moderno y contemporáneo. Esta aplicación funciona como la tienda insignia digital de la marca, permitiendo a los visitantes explorar colecciones, conocer el proceso de fabricación del calzado, filtrar productos por materiales y categorías, y realizar pedidos personalizados directamente con el taller a través de WhatsApp.

---

## Características Principales

### 🛍️ Catálogo a Ancho Completo y Modal de Filtros
- **Precarga en el Servidor e Hidratación**: Carga inicial ultrarrápida impulsada por Next.js Server Components, hidratada en el cliente con TanStack Query.
- **Modal de Filtros Accesible**: Capa superpuesta accesible con búsqueda en tiempo real, selección de categorías, lista colapsable de materiales ("Ver más / Ver menos") y control deslizante de rango de precios.
- **Chips de Filtros Activos**: Etiquetas dinámicas sobre el catálogo que permiten eliminar filtros individuales con un solo clic o restablecerlos por completo.
- **Ordenamiento Inteligente**: Prioriza productos destacados y novedades bajo el criterio de "Recomendados", junto con opciones de orden por precio y alfabético.
- **Insignias de Producto**: Distintivos visuales destacados para `Nuevo`, `Destacado` y etiquetas de materiales.

### 🛒 Carrito Deslizable y Pedidos por WhatsApp
- Carrito lateral deslizable (`CartDrawer`) con control de cantidades, selección de tallas y cálculo del total en tiempo real.
- **Checkout Directo por WhatsApp**: Transforma el carrito de compras en un mensaje legible y detallado de WhatsApp enviado directamente al número de Darío Catuto configurado en Strapi CMS.

### 📖 Historia de la Marca y Proceso de Fabricación (Nosotros)
- Historia del maestro zapatero Darío Catuto y el taller en Bambil Collao.
- Misión, visión y valores fundamentales de la marca.
- Desglose paso a paso del proceso de fabricación artesanal (corte preciso, ensamblaje tradicional, acabado manual).

### 📍 Mapa Interactivo del Taller y Página de Contacto
- **Formulario de Contacto**: Consultas directas de clientes almacenadas en la colección `contact-messages` de Strapi con validación automática y respuesta en la interfaz.
- **Mapa Interactivo con Leaflet**: Ubicación del taller en Colonche, Santa Elena, con marcador personalizado, enlace a indicaciones en Google Maps y horarios de atención.

### 📱 Botón Flotante de WhatsApp (FAB)
- Botón de acción flotante presente en todas las páginas con bocadillo de texto expandible y mensaje predeterminado personalizable desde la configuración global de Strapi.

### 📸 Feed Social Dinámico
- Galería visual curada de Instagram vinculada directamente al patrocinio de Miss Ecuador y fotografías editoriales de la marca.

---

## Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack) |
| **Biblioteca UI** | [React 19](https://react.dev/) |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **CMS** | [Strapi CMS v5](https://strapi.io/) (`@strapi/client`) |
| **Estado del Cliente** | [Zustand v5](https://zustand.docs.pmnd.rs/) (Carrito y estado de UI) |
| **Gestión de Datos** | [@tanstack/react-query v5](https://tanstack.com/query/latest) |
| **Mapas** | [Leaflet](https://leafletjs.com/) y OpenStreetMap |
| **Iconos y Fuentes** | Material Symbols Outlined, Google Fonts (Playfair Display y Montserrat) |
| **Contenedores** | Docker (Construcción multietapa con salida standalone) |

---

## Arquitectura y Flujo de Datos

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

1. **Root Layout**: Consulta los datos globales de la tienda (marca, teléfono, dirección, horarios, redes sociales) en el servidor y los comparte en el árbol de componentes mediante `GlobalInfoProvider`.
2. **Página de Catálogo**: Realiza la precarga de productos y categorías en el servidor; hidrata `useProducts` y `useCategories` en el cliente para filtrado, búsqueda y ordenamiento instantáneo.
3. **Acción de Contacto**: `sendContactMessageAction` procesa el envío del formulario del cliente directamente hacia la colección `contact-messages` de Strapi.

---

## Primeros Pasos

### Requisitos Previos
- **Node.js**: `v20.x` o `v22.x`
- **npm**, **yarn**, o **pnpm**
- Una instancia en ejecución de **Strapi v5** (ej. `http://localhost:1337`)

### 1. Clonar el repositorio
```bash
git clone https://github.com/StevenRosalesC/bambil-shoes-page.git
cd bambil-shoes-page
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia la plantilla y ajusta los valores según tu entorno:
```bash
cp .env.example .env.local
```

### 4. Ejecutar el servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Variables de Entorno

Definidas en `.env.local` (y documentadas en `.env.example`):

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `STRAPI_API_URL` | URL base para la API de contenido de Strapi | `http://localhost:1337/api` |
| `NEXT_PUBLIC_STRAPI_URL` | Origen público de Strapi para resolver medios multimedia | `http://localhost:1337` |
| `NEXT_PUBLIC_SITE_URL` | Dominio canónico utilizado para metadatos y SEO | `http://localhost:3000` |

---

## Estructura del Proyecto

```
bambil-shoes-page/
├── actions/              # Server Actions de Next.js (consultas y mutaciones a Strapi)
│   ├── about.ts          # Consulta de contenido para la página Nosotros
│   ├── categories.ts     # Consulta de categorías con slug y paginación
│   ├── contact.ts        # Acción de envío de mensajes de contacto
│   ├── global.ts         # Consulta de información global de la tienda
│   ├── home.ts           # Consulta de hero e introducción del Home
│   ├── materials.ts      # Consulta de materiales (cuero y sintéticos)
│   ├── products.ts       # Consulta de productos, filtros y destacados
│   └── social-posts.ts   # Consulta de publicaciones de Instagram
├── app/                  # Páginas y rutas con Next.js App Router
│   ├── about/            # Página /about (Nosotros)
│   ├── catalog/          # Página /catalog (Catálogo)
│   ├── contact/          # Página /contact (Contacto)
│   ├── layout.tsx        # Layout global HTML y envoltura de Providers
│   └── page.tsx          # Página principal de inicio (Home)
├── components/           # Componentes de UI y funcionalidades
│   ├── CartDrawer.tsx    # Carrito deslizable y checkout por WhatsApp
│   ├── CatalogGrid.tsx   # Cuadrícula de productos, modal de filtros y chips
│   ├── CategoriesList.tsx# Secciones interactivas de categorías
│   ├── ContactGrid.tsx   # Formulario de contacto y tarjetas informativas
│   ├── ContactMap.tsx    # Contenedor interactivo del mapa Leaflet
│   ├── FeaturedProducts.tsx # Cuadrícula de productos destacados
│   ├── Footer.tsx        # Pie de página con enlaces y detalles del taller
│   ├── Hero.tsx          # Sección editorial principal (Hero)
│   ├── InstagramFeed.tsx # Feed fotográfico y prueba social
│   ├── Materials.tsx     # Sección de muestra de materiales
│   ├── Navbar.tsx        # Barra de navegación con contador de carrito
│   └── WhatsAppFAB.tsx   # Botón flotante de WhatsApp con mensaje dinámico
├── hooks/                # Hooks personalizados de React Query (useProducts, useCategories)
├── providers/            # Proveedores de contexto de cliente (GlobalInfoProvider, QueryProvider)
├── store/                # Almacenes de estado Zustand (useCartStore, useUIStore)
├── types/                # Interfaces de TypeScript y contratos de la API
├── public/               # Recursos estáticos y logotipos
├── Dockerfile            # Construcción Docker multietapa optimizada para producción
└── next.config.ts        # Configuración de Next.js y patrones remotos de imágenes
```

---

## Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local con Turbopack |
| `npm run build` | Compila la versión optimizada para producción con verificación de tipos |
| `npm run start` | Inicia el servidor standalone en modo producción |
| `npm run lint` | Ejecuta la verificación de ESLint en todos los archivos del proyecto |

---

## Despliegue con Docker

El proyecto incluye un `Dockerfile` multietapa configurado para la salida standalone de Next.js:

### 1. Construir la imagen de Docker
```bash
docker build \
  --build-arg STRAPI_API_URL="https://tu-dominio-strapi.com/api" \
  --build-arg NEXT_PUBLIC_STRAPI_URL="https://tu-dominio-strapi.com" \
  --build-arg NEXT_PUBLIC_SITE_URL="https://bambilshoes.com" \
  -t bambil-shoes-page:latest .
```

### 2. Ejecutar el contenedor
```bash
docker run -p 3000:3000 \
  -e STRAPI_API_URL="https://tu-dominio-strapi.com/api" \
  -e NEXT_PUBLIC_STRAPI_URL="https://tu-dominio-strapi.com" \
  -e NEXT_PUBLIC_SITE_URL="https://bambilshoes.com" \
  bambil-shoes-page:latest
```

---

## Licencia

Este proyecto es privado y propiedad de **Bambil Shoes By Dario**. Todos los derechos reservados.
