import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Notification } from '../models';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    const unreadCount = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    res.json({ notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId: req.user.id },
    });

    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    await notification.update({ isRead: true });

    res.json({ message: 'Marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to mark as read' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );

    res.json({ message: 'All marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to mark all as read' });
  }
};
