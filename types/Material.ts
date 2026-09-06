export interface MaterialBenefit {
  id?: number;
  text: string;
}

export interface MaterialData {
  id?: number;
  documentId?: string;
  name: string;
  description: string;
  icon: string;
  textureImage?: {
    id?: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
  benefits?: MaterialBenefit[];
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
