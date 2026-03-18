export type ProductCategory = 'all' | 'rings' | 'necklaces' | 'earrings' | 'bracelets';

export type MetalType = 'all' | 'gold' | 'silver' | 'rose-gold' | 'platinum';

export type PriceRange = 'all' | '0-500' | '500-1000' | '1000-2500' | '2500+';

export interface ProductFilters {
  category: ProductCategory;
  metalType: MetalType;
  priceRange: PriceRange;
}