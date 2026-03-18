import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { products, setProducts, Product } from '../db/product.db';
import { ProductSchema } from '../validators/product.validator';
import { calculatePrice } from '../utils/calculator';

export const getProducts = (req: Request, res: Response) => {
  const { category, metalType, priceRange, sort } = req.query;
  
  let filtered = [...products];
  
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (metalType && metalType !== 'all') {
    filtered = filtered.filter(p => p.metalType === metalType);
  }
  if (priceRange && priceRange !== 'all') {
    const rangeStr = priceRange as string;
    const [minStr, maxStr] = rangeStr.split('-');
    const min = parseInt(minStr, 10);
    
    if (maxStr) {
      const max = parseInt(maxStr, 10);
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    } else if (rangeStr.endsWith('+')) {
      filtered = filtered.filter(p => p.price >= min);
    }
  }

  if (sort) {
    if (sort === 'priceLow') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'priceHigh') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'nameAsc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'nameDesc') filtered.sort((a, b) => b.name.localeCompare(a.name));
  }
  
  res.json(filtered);
};

export const getProductById = (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
};

export const createProduct = (req: Request, res: Response) => {
  try {
    const data = ProductSchema.parse(req.body);
    const price = calculatePrice(data.weight, data.currentMetalPrice, data.makingCharges, data.shippingCharges, data.tax);
    
    const newProduct: Product = {
      id: uuidv4(),
      ...data,
      description: data.description || '',
      price
    };
    
    setProducts([...products, newProduct]);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ error: error.errors || 'Invalid payload' });
  }
};

export const updateProduct = (req: Request, res: Response) => {
  try {
    const data = ProductSchema.parse(req.body);
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    const price = calculatePrice(data.weight, data.currentMetalPrice, data.makingCharges, data.shippingCharges, data.tax);
    
    const updatedProduct = {
      ...products[index],
      ...data,
      description: data.description || '',
      price
    };
    
    const newProducts = [...products];
    newProducts[index] = updatedProduct;
    setProducts(newProducts);
    
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ error: error.errors || 'Invalid payload' });
  }
};

export const deleteProduct = (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  
  const newProducts = products.filter(p => p.id !== req.params.id);
  setProducts(newProducts);
  res.status(204).send();
};
