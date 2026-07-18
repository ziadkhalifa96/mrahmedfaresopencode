import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SiteSetting, Announcement } from '../models';

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await SiteSetting.findAll();
    const settingsObj: Record<string, any> = {};
    settings.forEach((s: any) => { settingsObj[s.key] = s.value; });
    res.json({ settings: settingsObj });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get settings' });
  }
};

export const updateSetting = async (req: AuthRequest, res: Response) => {
  try {
    const key = req.params.key as string;
    const { value } = req.body;

    const [setting, created] = await SiteSetting.findOrCreate({
      where: { key },
      defaults: { key, value },
    });

    if (!created) await setting.update({ value });

    res.json({ setting });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update setting' });
  }
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await Announcement.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ announcements });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get announcements' });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { message, messageAr, isActive, link } = req.body;
    const announcement = await Announcement.create({
      message, messageAr,
      isActive: isActive !== false,
      link,
    });
    res.status(201).json({ announcement });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create announcement' });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id as string);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    const { message, messageAr, isActive, link } = req.body;
    const updates: any = {};
    if (message !== undefined) updates.message = message;
    if (messageAr !== undefined) updates.messageAr = messageAr;
    if (isActive !== undefined) updates.isActive = isActive;
    if (link !== undefined) updates.link = link;

    await announcement.update(updates);
    res.json({ announcement });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update announcement' });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id as string);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    await announcement.destroy();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete announcement' });
  }
};
