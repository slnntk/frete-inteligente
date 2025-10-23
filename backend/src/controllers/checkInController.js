const { CheckIn, Trip, User } = require('../models');

const createCheckIn = async (req, res) => {
  try {
    const { tripId, pickupLocation } = req.body;

    // Verify trip exists and has available seats
    const trip = await Trip.findByPk(tripId, {
      include: [
        {
          model: CheckIn,
          as: 'checkIns',
          where: { status: 'confirmed' },
          required: false
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const confirmedCheckIns = trip.checkIns.length;
    if (confirmedCheckIns >= trip.capacity) {
      return res.status(400).json({ error: 'Trip is full' });
    }

    // Check if user already has a check-in for this trip
    const existingCheckIn = await CheckIn.findOne({
      where: {
        tripId,
        passengerId: req.user.id
      }
    });

    if (existingCheckIn) {
      return res.status(400).json({ 
        error: 'You already have a check-in for this trip' 
      });
    }

    const checkIn = await CheckIn.create({
      tripId,
      passengerId: req.user.id,
      status: 'confirmed',
      pickupLocation,
      checkInTime: new Date()
    });

    // Emit check-in notification via Socket.IO
    req.app.io.to(`trip-${tripId}`).emit('newCheckIn', {
      checkInId: checkIn.id,
      passengerName: req.user.name,
      tripId
    });

    res.status(201).json({
      message: 'Check-in successful',
      checkIn
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Error creating check-in' });
  }
};

const getMyCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.findAll({
      where: { passengerId: req.user.id },
      include: [
        {
          model: Trip,
          as: 'trip',
          include: [
            {
              model: User,
              as: 'driver',
              attributes: ['id', 'name', 'phone']
            }
          ]
        }
      ],
      order: [['checkInTime', 'DESC']]
    });

    res.json({ checkIns });
  } catch (error) {
    console.error('Get check-ins error:', error);
    res.status(500).json({ error: 'Error fetching check-ins' });
  }
};

const cancelCheckIn = async (req, res) => {
  try {
    const { id } = req.params;

    const checkIn = await CheckIn.findByPk(id);

    if (!checkIn) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    if (checkIn.passengerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this check-in' });
    }

    await checkIn.update({ status: 'cancelled' });

    // Emit cancellation notification via Socket.IO
    req.app.io.to(`trip-${checkIn.tripId}`).emit('checkInCancelled', {
      checkInId: checkIn.id,
      tripId: checkIn.tripId
    });

    res.json({
      message: 'Check-in cancelled successfully',
      checkIn
    });
  } catch (error) {
    console.error('Cancel check-in error:', error);
    res.status(500).json({ error: 'Error cancelling check-in' });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const checkIn = await CheckIn.findByPk(id, {
      include: [
        {
          model: Trip,
          as: 'trip'
        }
      ]
    });

    if (!checkIn) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    // Only driver/company or the passenger can update payment status
    if (checkIn.trip.driverId !== req.user.id && checkIn.passengerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update payment status' });
    }

    await checkIn.update({ paymentStatus });

    res.json({
      message: 'Payment status updated successfully',
      checkIn
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: 'Error updating payment status' });
  }
};

const getTripCheckIns = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Only driver/company can see all check-ins
    if (trip.driverId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view trip check-ins' });
    }

    const checkIns = await CheckIn.findAll({
      where: { tripId },
      include: [
        {
          model: User,
          as: 'passenger',
          attributes: ['id', 'name', 'phone', 'email']
        }
      ],
      order: [['pickupOrder', 'ASC'], ['checkInTime', 'ASC']]
    });

    res.json({ checkIns });
  } catch (error) {
    console.error('Get trip check-ins error:', error);
    res.status(500).json({ error: 'Error fetching trip check-ins' });
  }
};

module.exports = {
  createCheckIn,
  getMyCheckIns,
  cancelCheckIn,
  updatePaymentStatus,
  getTripCheckIns
};
