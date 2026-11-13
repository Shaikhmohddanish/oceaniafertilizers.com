import type { Product } from '@/content/types';

/**
 * A product can be ordered from the site once it is published and has at least
 * one pack size to choose. Product cards show their Order button, and product
 * pages their order form, by this rule; submitOrderRequest checks the same
 * thing on the server.
 */
export function canOrder(product: Pick<Product, 'status' | 'packSizes'>): boolean {
  return product.status === 'published' && product.packSizes.length > 0;
}
