import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Notification, User } from '../models';
import { Op } from 'sequelize';

export const sendNotification = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { userIds, title, titleAr, message, messageAr, type, link } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    let targetUsers: number[] = [];

    if (userIds && userIds.length > 0) {
      targetUsers = userIds;
    } else {
      const allUsers = await User.findAll({ attributes: ['id'], where: { role: 'student' } });
      targetUsers = allUsers.map((u: any) => u.id);
    }

    if (targetUsers.length === 0) {
      return res.status(400).json({ error: 'No users found to send notifications to' });
    }

    const notifications = targetUsers.map((userId) => ({
      userId,
      title: title || '',
      titleAr: titleAr || title || '',
      message: message || '',
      messageAr: messageAr || message || '',
      type: type || 'system',
      link: link || null,
      isRead: false,
    }));

    await Notification.bulkCreate(notifications);

    res.status(201).json({ message: `Notification sent to ${targetUsers.length} user(s)` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to send notification' });
  }
};

export const getAllNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const notifications = await Notification.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 100,
    });

    res.json({ notifications });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get notifications' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findByPk(req.params.id as string);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    await notification.destroy();
    res.json({ message: 'Notification deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete notification' });
  }
};
