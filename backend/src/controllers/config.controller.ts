import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const getTaxes = async (req: Request, res: Response) => {
  try {
    const taxes = await prisma.taxConfig.findMany({
      orderBy: { rate: 'asc' }
    });
    res.json(taxes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch taxes' });
  }
};

export const createTax = async (req: Request, res: Response) => {
  try {
    const { name, rate, isActive } = req.body;
    const tax = await prisma.taxConfig.create({
      data: { name, rate: parseFloat(rate), isActive: isActive !== false }
    });
    res.status(201).json(tax);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create tax' });
  }
};

export const updateTax = async (req: Request, res: Response) => {
  try {
    const { name, rate, isActive } = req.body;
    const tax = await prisma.taxConfig.update({
      where: { id: req.params.id },
      data: { 
        ...(name && { name }),
        ...(rate !== undefined && { rate: parseFloat(rate) }),
        ...(isActive !== undefined && { isActive: isActive !== false })
      }
    });
    res.json(tax);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update tax' });
  }
};

export const deleteTax = async (req: Request, res: Response) => {
  try {
    await prisma.taxConfig.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete tax (it might be in use by products)' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getMetalTypes = async (req: Request, res: Response) => {
  try {
    const metals = await prisma.metalType.findMany({ orderBy: { name: 'asc' } });
    res.json(metals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metal types' });
  }
};
