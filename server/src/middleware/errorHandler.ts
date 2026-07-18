import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ error: 'Validation error', errors });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e: any) => ({
      field: e.path,
      message: `${e.path} already exists`,
    }));
    return res.status(409).json({ error: 'Duplicate entry', errors });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: 'Referenced record not found' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({ error: message });
};
