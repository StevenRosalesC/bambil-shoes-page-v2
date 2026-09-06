export interface HomePageSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: {
    id?: number;
    url: string;
    alternativeText?: string;
  } | null;
}

export interface HomePageData {
  id?: number;
  documentId?: string;
  heroBadge?: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: {
    id?: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
  heroImageAlt?: string;
  heroCaptionTitle?: string;
  heroCaptionSubtitle?: string;
  seo?: HomePageSeo | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
