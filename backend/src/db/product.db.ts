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
  productId?: number;
}

export let products: Product[] = [
    {
        "id": "2de145d2-f472-463d-a51d-b8923bc6c07d",
        "name": "Diamond Ring",
        "category": "rings",
        "metalType": "gold",
        "weight": 3,
        "currentMetalPrice": 7500,
        "makingCharges": 3500,
        "shippingCharges": 100,
        "availability": true,
        "tax": "GST (5%)",
        "price": 27225,
        "image": "https://m.media-amazon.com/images/I/31gwdu2HR2L.jpg",
        "description": "",
        "productId": 1
    },
    {
        "id": "e4b2d38e-0cfd-4a11-b0db-af52a921d6e1",
        "name": "Silver Necklace",
        "category": "necklaces",
        "metalType": "silver",
        "weight": 15,
        "currentMetalPrice": 900,
        "makingCharges": 2500,
        "shippingCharges": 150,
        "availability": true,
        "tax": "GST (5%)",
        "price": 16825,
        "image": "https://m.media-amazon.com/images/I/41Eqfk8gwKL._SY625_.jpg",
        "description": "",
        "productId": 2
    },
    {
        "id": "5cb81f8f-fb4b-4b19-afc3-722a4dcc1d79",
        "name": "Gold Bracelet",
        "category": "bracelets",
        "metalType": "gold",
        "weight": 8,
        "currentMetalPrice": 7500,
        "makingCharges": 4000,
        "shippingCharges": 100,
        "availability": false,
        "tax": "GST (5%)",
        "price": 67100,
        "image": "https://m.media-amazon.com/images/I/71jipQYR58L._SY695_.jpg",
        "description": "",
        "productId": 3
    },
    {
        "id": "11576b51-6b40-49fe-8f05-042f466a3a99",
        "name": "Rose Gold Necklace",
        "category": "necklaces",
        "metalType": "rose-gold",
        "weight": 10,
        "currentMetalPrice": 25,
        "makingCharges": 20,
        "shippingCharges": 10,
        "availability": false,
        "tax": "GST (3%)",
        "image": "https://m.media-amazon.com/images/I/51nIAqgnalL._SY625_.jpg",
        "description": "",
        "price": 287.5,
        "productId": 4
    },
    {
        "id": "c2ed0363-8d5e-485b-9043-61b50b3d4469",
        "name": "Platinum Ring",
        "category": "rings",
        "metalType": "platinum",
        "weight": 2,
        "currentMetalPrice": 20000,
        "makingCharges": 10,
        "shippingCharges": 10,
        "availability": true,
        "tax": "GST (5%)",
        "image": "https://m.media-amazon.com/images/I/51it9OVK+FL._SY695_.jpg",
        "description": "",
        "price": 42020,
        "productId": 5
    },
    {
        "id": "386f2a22-6729-4d95-a1cc-3966066050ef",
        "name": "Gold Chain",
        "category": "rings",
        "metalType": "gold",
        "weight": 20,
        "currentMetalPrice": 3000,
        "makingCharges": 200,
        "shippingCharges": 10,
        "availability": true,
        "tax": "GST (5%)",
        "image": "https://m.media-amazon.com/images/I/81-7ePzrfOL._SY695_.jpg",
        "description": "",
        "price": 63210,
        "productId": 6
    },
    {
        "id": "d4530290-96ec-4fd5-9883-843ae4dbd4a2",
        "name": "Gold and Diamond Earring",
        "category": "earrings",
        "metalType": "gold",
        "weight": 10,
        "currentMetalPrice": 2000,
        "makingCharges": 200,
        "shippingCharges": 20,
        "availability": true,
        "tax": "GST (5%)",
        "image": "https://m.media-amazon.com/images/I/41lgpr4QzoL._SY625_.jpg",
        "description": "",
        "price": 21220,
        "productId": 7
    },
    {
        "id": "7cfb08ab-4abf-4601-a4cc-bc1de99b2c33",
        "name": "Gold Neckaces",
        "category": "necklaces",
        "metalType": "gold",
        "weight": 20,
        "currentMetalPrice": 3000,
        "makingCharges": 300,
        "shippingCharges": 30,
        "availability": true,
        "tax": "GST (5%)",
        "image": "https://d25g9z9s77rn4i.cloudfront.net/uploads/product/194/1737539642_bdac2baf411a5259c0b3.jpg",
        "description": "",
        "price": 63330,
        "productId": 8
    },
    {
        "id": "eb9f0ab2-8326-48ae-ae66-3a15e2f86213",
        "name": "Rose Gold Bracelets",
        "category": "bracelets",
        "metalType": "rose-gold",
        "weight": 10,
        "currentMetalPrice": 2000,
        "makingCharges": 10,
        "shippingCharges": 100,
        "availability": true,
        "tax": "GST (5%)",
        "image": "https://www.wholesalecatalog.in/images/product/2024/10/simple-rose-gold-bracelet-vol-2-for-men-women-2024-10-21_16_26_13.jpg",
        "description": "",
        "price": 21110,
        "productId": 9
    }
];

// Helper to manually overwrite products during an update or delete
export const setProducts = (newProducts: Product[]) => {
  products = newProducts;
};
