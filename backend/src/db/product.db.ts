export interface Product {
  id: string;
  name: string;
  category: string;
  metalType: string;
  weight: number;
  currentMetalPrice: number;
  makingCharges: number;
  shippingCharges: number;
  availability: boolean;
  tax: string;
  price: number;
  image: string;
  description: string;
}

export let products: Product[] = [
  {
    id: '1',
    name: 'Diamond Ring',
    category: 'rings',
    metalType: 'gold',
    weight: 3,
    currentMetalPrice: 7500,
    makingCharges: 3500,
    shippingCharges: 100,
    availability: true,
    tax: 'GST (5%)',
    price: 27225,
    image: 'https://picsum.photos/id/119/400/400.jpg',
    description: ''
  },
  {
    id: '2',
    name: 'Silver Necklace',
    category: 'necklaces',
    metalType: 'silver',
    weight: 15,
    currentMetalPrice: 900,
    makingCharges: 2500,
    shippingCharges: 150,
    availability: true,
    tax: 'GST (5%)',
    price: 16825,
    image: 'https://picsum.photos/id/120/400/400.jpg',
    description: ''
  },
  {
    id: '3',
    name: 'Gold Bracelet',
    category: 'bracelets',
    metalType: 'gold',
    weight: 8,
    currentMetalPrice: 7500,
    makingCharges: 4000,
    shippingCharges: 100,
    availability: false,
    tax: 'GST (5%)',
    price: 67100,
    image: 'https://picsum.photos/id/122/400/400.jpg',
    description: ''
  }
];

// Helper to manually overwrite products during an update or delete
export const setProducts = (newProducts: Product[]) => {
  products = newProducts;
};
