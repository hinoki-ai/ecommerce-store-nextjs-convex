import { ID, Timestamp, SEOData, Image, AuditInfo } from './common';

export interface Category {
  id: ID;
  name: string;
  nameJA?: string;
  slug: string;
  description?: string;
  parentId?: ID;
  sortOrder: number;
  isActive: boolean;
  icon?: string;
  color?: string;
  image?: Image;
  seo: SEOData;
  children?: Category[];
  audit: AuditInfo;
}