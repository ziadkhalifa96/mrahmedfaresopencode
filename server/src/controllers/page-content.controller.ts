import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PageContent } from '../models';

export const getPageContent = async (req: any, res: Response) => {
  try {
    const { page } = req.params;
    const content = await PageContent.findAll({ where: { page } });

    const grouped: Record<string, any[]> = {};
    content.forEach((item: any) => {
      if (!grouped[item.section]) grouped[item.section] = [];
      grouped[item.section].push({
        id: item.id,
        key: item.key,
        valueEn: item.valueEn,
        valueAr: item.valueAr,
        metadata: item.metadata,
      });
    });

    res.json({ page, sections: grouped });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get page content' });
  }
};

export const getAllPageContent = async (req: AuthRequest, res: Response) => {
  try {
    const content = await PageContent.findAll({ order: [['page', 'ASC'], ['section', 'ASC'], ['key', 'ASC']] });
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get page content' });
  }
};

export const upsertPageContent = async (req: AuthRequest, res: Response) => {
  try {
    const { page, section, key, valueEn, valueAr, metadata } = req.body;
    if (!page || !section || !key || valueEn === undefined || valueAr === undefined) {
      return res.status(400).json({ error: 'page, section, key, valueEn, and valueAr are required' });
    }

    const [content, created] = await PageContent.upsert({
      page, section, key, valueEn, valueAr, metadata: metadata || null,
    }, { returning: true });

    res.status(created ? 201 : 200).json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to upsert page content' });
  }
};

export const deletePageContent = async (req: AuthRequest, res: Response) => {
  try {
    const content = await PageContent.findByPk(req.params.id as string);
    if (!content) return res.status(404).json({ error: 'Page content not found' });

    await content.destroy();
    res.json({ message: 'Page content deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete page content' });
  }
};
