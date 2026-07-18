import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Announcement, SiteSetting } from '../models';

export const getPublicAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await Announcement.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });
    res.json({ announcements });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get announcements' });
  }
};

export const getPublicSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await SiteSetting.findAll({
      attributes: ['key', 'value'],
    });
    const settingsObj: Record<string, any> = {};
    settings.forEach((s: any) => { settingsObj[s.key] = s.value; });
    res.json({ settings: settingsObj });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get settings' });
  }
};
