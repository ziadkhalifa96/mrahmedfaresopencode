import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Booking, User } from '../models';

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;

    const { rows, count } = await Booking.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
      ],
      order: [['date', 'DESC']],
      limit: limitNum,
      offset,
    });

    res.json({ bookings: rows, total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get bookings' });
  }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findByPk(req.params.id as string);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const { status, maxSeats, dailyRoomUrl, location, notes } = req.body;
    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (maxSeats !== undefined) updates.maxSeats = parseInt(maxSeats);
    if (dailyRoomUrl !== undefined) updates.dailyRoomUrl = dailyRoomUrl;
    if (location !== undefined) updates.location = location;
    if (notes !== undefined) updates.notes = notes;

    await booking.update(updates);
    res.json({ booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update booking' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { type, date, time, duration, maxSeats, dailyRoomUrl, location, notes } = req.body;
    const booking = await Booking.create({
      userId: req.user!.id,
      type,
      date,
      time,
      duration: parseInt(duration) || 60,
      maxSeats: parseInt(maxSeats) || 1,
      dailyRoomUrl,
      location,
      notes,
    });

    res.status(201).json({ booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
};

export const deleteBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findByPk(req.params.id as string);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    await booking.destroy();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete booking' });
  }
};
