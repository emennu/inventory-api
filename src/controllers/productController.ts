// Product CRUD operations with pagination and role-based access
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, stockCount } = req.body;
    const userId = (req as any).userId;

    if (!name || price === undefined) {
      res.status(400).json({ error: 'Name and price are required' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stockCount: stockCount ? parseInt(stockCount) : 0,
        createdBy: userId,
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.product.count(),
    ]);

    res.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { name, description, price, stockCount } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        stockCount: stockCount ? parseInt(stockCount) : undefined,
      },
    });

    res.json({ product });
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await prisma.product.delete({ where: { id } });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}