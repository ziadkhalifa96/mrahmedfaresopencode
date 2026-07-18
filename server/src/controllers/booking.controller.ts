import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Booking } from '../models';

export const getAvailableBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        status: 'confirmed',
      },
      order: [['date', 'ASC']],
    });

    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get bookings' });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });

    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get bookings' });
  }
};

export const bookSeat = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { bookingId } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.bookedSeats >= booking.maxSeats) {
      return res.status(400).json({ error: 'No available seats' });
    }

    await booking.update({ bookedSeats: booking.bookedSeats + 1 });

    const userBooking = await Booking.create({
      userId: req.user.id,
      type: booking.type,
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      maxSeats: 1,
      bookedSeats: 1,
      status: 'pending',
      dailyRoomUrl: booking.dailyRoomUrl,
      location: booking.location,
    });

    res.status(201).json({ message: 'Booked successfully', booking: userBooking });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to book' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      where: { id: bookingId, userId: req.user.id },
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    await booking.update({ status: 'cancelled' });

    res.json({ message: 'Booking cancelled' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to cancel booking' });
  }
};
