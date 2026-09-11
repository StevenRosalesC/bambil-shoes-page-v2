export interface CorporateValue {
  id?: number;
  title: string;
  description: string;
  icon: string;
}

export interface ManufacturingStep {
  id?: number;
  stepNumber: number;
  title: string;
  description?: string;
  image?: {
    id?: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
}

export interface AboutPageData {
  id?: number;
  documentId?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBanner?: {
    id?: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
  mission: string;
  vision?: string;
  founderPhoto?: {
    id?: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
  corporateValues?: CorporateValue[];
  manufacturingSteps?: ManufacturingStep[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
