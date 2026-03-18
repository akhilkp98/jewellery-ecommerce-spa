import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const SECRET_KEY = 'LuxeJewels_Secret_Key_For_Assignment'; 

const user = { 
  id: 1, 
  email: 'admin@test.com', 
  password: bcrypt.hashSync('123456', 8) 
};

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.parse(req.body);

    if (parsed.email !== user.email) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(parsed.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h'
    });

    res.json({ token, user: { email: user.email, name: 'Admin' } });
  } catch (error) {
    next(error);
  }
};
