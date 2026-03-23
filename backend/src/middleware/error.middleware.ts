import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const errorLogDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(errorLogDir)) {
    fs.mkdirSync(errorLogDir);
  }
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${err.stack}\n\n`;
  fs.appendFileSync(path.join(errorLogDir, 'error.log'), logMessage);

  console.error(err.stack);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: err.errors[0]?.message || 'Validation Error'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
