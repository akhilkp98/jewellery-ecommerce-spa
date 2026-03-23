import { prisma } from '../db/prisma';

export class ProductService {
  static async getProducts(filters: any, sort?: string) {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
        ...(filters.category && filters.category !== 'all' ? { category: { name: filters.category } } : {}),
        ...(filters.metalType && filters.metalType !== 'all' ? { metalType: { name: filters.metalType } } : {})
      },
      include: {
        category: true,
        metalType: true,
        tax: true,
        images: true
      }
    });

    let mappedProducts = products.map((p: any) => {
      const metalPrice = p.metalPrice || p.metalType.pricePerGram;
      const basePrice = p.weight * metalPrice;
      const taxableAmount = basePrice + p.makingCharges;
      const taxValue = taxableAmount * (p.tax.rate / 100);
      const finalPrice = taxableAmount + p.shippingCharges + taxValue;

      return {
        id: p.id,
        name: p.name,
        category: p.category.name,
        metalType: p.metalType.name,
        currentMetalPrice: metalPrice,
        weight: p.weight,
        makingCharges: p.makingCharges,
        shippingCharges: p.shippingCharges,
        availability: p.availability,
        description: p.description,
        tax: p.tax.name,
        price: finalPrice,
        image: p.images.length > 0 ? p.images[0].url : '',
        images: p.images
      };
    });

    if (filters.priceRange && filters.priceRange !== 'all') {
      const [minStr, maxStr] = filters.priceRange.split('-');
      const min = parseInt(minStr, 10);
      if (maxStr) {
        const max = parseInt(maxStr, 10);
        mappedProducts = mappedProducts.filter((p: any) => p.price >= min && p.price <= max);
      } else if (filters.priceRange.endsWith('+')) {
        mappedProducts = mappedProducts.filter((p: any) => p.price >= min);
      }
    }

    if (sort) {
      if (sort === 'priceLow') mappedProducts.sort((a: any, b: any) => a.price - b.price);
      if (sort === 'priceHigh') mappedProducts.sort((a: any, b: any) => b.price - a.price);
      if (sort === 'nameAsc') mappedProducts.sort((a: any, b: any) => a.name.localeCompare(b.name));
      if (sort === 'nameDesc') mappedProducts.sort((a: any, b: any) => b.name.localeCompare(a.name));
    }

    return mappedProducts;
  }

  static async getProductById(id: string) {
    const p = await prisma.product.findUnique({
      where: { id, isDeleted: false },
      include: { category: true, metalType: true, tax: true, images: true }
    });
    
    if (!p) throw new Error('NOT_FOUND');

    const metalPrice = p.metalPrice || p.metalType.pricePerGram;
    const basePrice = p.weight * metalPrice;
    const taxableAmount = basePrice + p.makingCharges;
    const taxValue = taxableAmount * (p.tax.rate / 100);
    const finalPrice = taxableAmount + p.shippingCharges + taxValue;

    return {
        id: p.id,
        name: p.name,
        category: p.category.name,
        metalType: p.metalType.name,
        currentMetalPrice: metalPrice,
        weight: p.weight,
        makingCharges: p.makingCharges,
        shippingCharges: p.shippingCharges,
        availability: p.availability,
        description: p.description,
        tax: p.tax.name,
        price: finalPrice,
        image: p.images.length > 0 ? p.images[0].url : '',
        images: p.images
    };
  }

  static async createProduct(data: any, incomingImages: {url: string, isPrimary: boolean}[]) {
    const category = await prisma.category.findUnique({ where: { name: data.category } });
    const metalType = await prisma.metalType.findUnique({ where: { name: data.metalType } });
    const tax = await prisma.taxConfig.findFirst({ where: { name: data.tax } });
    
    if (!category || !metalType || !tax) {
      throw new Error('INVALID_RELATIONS');
    }

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        weight: parseFloat(data.weight),
        makingCharges: parseFloat(data.makingCharges),
        shippingCharges: parseFloat(data.shippingCharges),
        metalPrice: parseFloat(data.currentMetalPrice || 0),
        availability: String(data.availability) === 'true',
        description: data.description || '',
        categoryId: category.id,
        metalTypeId: metalType.id,
        taxId: tax.id,
        images: incomingImages.length > 0 ? { create: incomingImages } : undefined
      }
    });

    return newProduct;
  }

  static async updateProduct(id: string, data: any, newImages?: {url: string, isPrimary: boolean}[], deletedImageIds?: string[]) {
    const category = data.category ? await prisma.category.findUnique({ where: { name: data.category } }) : null;
    const metalType = data.metalType ? await prisma.metalType.findUnique({ where: { name: data.metalType } }) : null;
    const tax = data.tax ? await prisma.taxConfig.findFirst({ where: { name: data.tax } }) : null;

    if (deletedImageIds && deletedImageIds.length > 0) {
      await prisma.productImage.deleteMany({
        where: { id: { in: deletedImageIds } }
      });
    }

    return prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        ...(data.weight && { weight: parseFloat(data.weight) }),
        ...(data.makingCharges && { makingCharges: parseFloat(data.makingCharges) }),
        ...(data.shippingCharges && { shippingCharges: parseFloat(data.shippingCharges) }),
        ...(data.currentMetalPrice && { metalPrice: parseFloat(data.currentMetalPrice) }),
        ...(data.availability !== undefined && { availability: String(data.availability) === 'true' }),
        description: data.description,
        ...(category && { categoryId: category.id }),
        ...(metalType && { metalTypeId: metalType.id }),
        ...(tax && { taxId: tax.id }),
        ...(newImages && { images: { create: newImages } })
      }
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isDeleted: true }
    });
  }
}
