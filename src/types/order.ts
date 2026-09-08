export interface CartItemDTO {
  id: string;
  productId: string;
  variantId?: string | null;
  title: string;
  size?: string | null;
  price: number;
  quantity: number;
  imageUrl?: string;
  total: number;
}

export interface CartDTO {
  id: string;
  items: CartItemDTO[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
}
