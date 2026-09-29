export type Category = 'Skincare' | 'Makeup' | 'Haircare' | 'Fragrance' | 'Bath & Body';

export type SkinType = 'Dry' | 'Oily' | 'Sensitive' | 'Combination' | 'Normal';

export interface Shade {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  tagline: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage?: string;
  shades?: Shade[];
  sizes?: string[];
  skinTypes: SkinType[];
  concerns: string[];
  finish?: 'Dewy' | 'Velvet Matte' | 'Radiant' | 'Satin' | 'Natural';
  description: string;
  keyIngredients: string[];
  howToUse: string;
  badge?: 'Bestseller' | 'New' | 'Clean Beauty' | 'Award Winner' | 'Editor Pick';
  inStock: boolean;
  matchScore?: number;
  matchReason?: string;
}

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skinType: SkinType;
  undertone: 'Warm Golden' | 'Cool Rosy' | 'Neutral' | 'Olive';
  concerns: string[];
  aestheticPreference: string;
  rewardPoints: number;
  tier: 'Rose Gold Muse' | 'Platinum Radiance' | 'Diamond VIP';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShade?: string;
  selectedSize?: string;
  selected: boolean; // Seamless item selection checkbox
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Confirmed' | 'Dispatched' | 'In Transit' | 'Delivered';
  estimatedDelivery: string;
  trackingNumber: string;
}
