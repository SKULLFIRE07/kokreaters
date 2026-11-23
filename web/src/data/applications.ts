import type { PhotoSlug } from './photos';

/** Application names and order from the combined client brief, 23 November 2026 (v6). */
export const applications: { name: string; photo: PhotoSlug; href: string }[] = [
  { name: 'Whipped toppings and creams', photo: 'food-cream', href: '/industries/dairy-alternatives-toppings-creams' },
  { name: 'Non-dairy creamers', photo: 'food-creamer', href: '/industries/dairy-alternatives-toppings-creams' },
  { name: 'Bakery and patisserie', photo: 'food-croissant', href: '/industries#bakery-food-service' },
  { name: 'Chocolate, compounds and coatings', photo: 'food-chocolate', href: '/industries#cocoa-chocolate-confectionery' },
  { name: 'Fillings and spreads', photo: 'food-spread', href: '/industries#cocoa-chocolate-confectionery' },
  { name: 'Ice cream and frozen desserts', photo: 'food-icecream', href: '/industries/dairy-alternatives-toppings-creams' },
  { name: 'Snacks and fried foods', photo: 'food-fries', href: '/industries/food-beverage-products' },
  { name: 'Mayonnaise, dressings and sauces', photo: 'food-sauce', href: '/industries/food-beverage-products' },
  { name: 'Indian sweets and namkeen', photo: 'food-mithai', href: '/industries/food-beverage-products' },
  { name: 'Plant-based foods', photo: 'food-plantbased', href: '/industries#plant-based' },
];
