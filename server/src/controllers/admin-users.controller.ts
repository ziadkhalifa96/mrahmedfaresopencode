import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { User } from '../models';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', search, role } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (role) where.role = role;

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'refreshToken'] },
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset,
    });

    res.json({ users: rows, total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get users' });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id as string, {
      attributes: { exclude: ['password', 'refreshToken'] },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id as string);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, email, phone, role, isVerified } = req.body;
    await user.update({ name, email, phone, role, isVerified });

    res.json({ user: { ...user.toJSON(), password: undefined, refreshToken: undefined } });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update user' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id as string);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Cannot delete admin user' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete user' });
  }
};
