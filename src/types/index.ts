// ======================
// Core Types
// ======================

export type Language = "ar" | "en";

export interface Store {
  id: string;
  name: string;
  slug: string; // used in public URL: /menu/[slug]
  loyverseStoreId?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  storeId: string;
  loyverseCategoryId?: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  storeId: string;
  categoryId: string;
  loyverseItemId?: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  sortOrder: number;
  modifiers?: ModifierGroup[];
}

export interface ModifierGroup {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  min: number;
  max: number;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  price: number;
}

// ======================
// Loyverse API Types (simplified)
// ======================

export interface LoyverseItem {
  id: string;
  item_name: string;
  description?: string;
  category_id?: string;
  price?: number;
  formated_name?: string;
  image_url?: string;
}

export interface LoyverseCategory {
  id: string;
  name: string;
}
