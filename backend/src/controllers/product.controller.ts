import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, metalType, priceRange, sort } = req.query;
    const products = await ProductService.getProducts({ category, metalType, priceRange }, sort as string);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.json(product);
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body; 
    
    let imageUrls: string[] = [];
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      imageUrls = files.map(file => file.path); // Cloudinary secure_url returned here natively
    } else if (req.body.image) {
      imageUrls.push(req.body.image); // Backward compatibility logic
    }

    const imagesToCreate = imageUrls.map((url, i) => ({ url, isPrimary: i === 0 }));

    const newProduct = await ProductService.createProduct(data, imagesToCreate);
    res.status(201).json({ id: newProduct.id });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_RELATIONS') {
      return res.status(400).json({ error: 'Invalid category, metalType, or tax' });
    }
    res.status(400).json({ error: 'Invalid payload' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const imageFiles = req.files as Express.Multer.File[];
    
    let deletedImageIds: string[] = [];
    if (data.deletedImageIds) {
      deletedImageIds = JSON.parse(data.deletedImageIds);
    }
    
    let newImagesToCreate;
    if (imageFiles && imageFiles.length > 0) {
      newImagesToCreate = imageFiles.map(f => {
        return { url: f.path, isPrimary: false };
      });
    }

    await ProductService.updateProduct(req.params.id, data, newImagesToCreate, deletedImageIds.length > 0 ? deletedImageIds : undefined);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: 'Invalid payload' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
};
