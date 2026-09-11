export interface SocialPostData {
  id?: number;
  documentId?: string;
  image?: {
    id?: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
  alt: string;
  url: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
