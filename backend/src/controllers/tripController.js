const { Trip, CheckIn, User } = require('../models');
const { Op } = require('sequelize');

const createTrip = async (req, res) => {
  try {
    const { title, description, origin, destination, departureTime, price, capacity } = req.body;

    if (req.user.userType !== 'driver' && req.user.userType !== 'company') {
      return res.status(403).json({ error: 'Only drivers and companies can create trips' });
    }

    const trip = await Trip.create({
      driverId: req.user.id,
      title,
      description,
      origin,
      destination,
      departureTime,
      price,
      capacity: capacity || 10,
      status: 'scheduled'
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Error creating trip' });
  }
};

const getTrips = async (req, res) => {
  try {
    const { status, date, origin, destination } = req.query;
    const where = {};

    if (status) where.status = status;
    if (origin) where.origin = { [Op.iLike]: `%${origin}%` };
    if (destination) where.destination = { [Op.iLike]: `%${destination}%` };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.departureTime = { [Op.between]: [startOfDay, endOfDay] };
    }

    const trips = await Trip.findAll({
      where,
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'phone']
        },
        {
          model: CheckIn,
          as: 'checkIns',
          attributes: ['id', 'status']
        }
      ],
      order: [['departureTime', 'ASC']]
    });

    const tripsWithCapacity = trips.map(trip => {
      const tripData = trip.toJSON();
      const confirmedCheckIns = tripData.checkIns.filter(c => c.status === 'confirmed').length;
      return {
        ...tripData,
        availableSeats: tripData.capacity - confirmedCheckIns,
        confirmedPassengers: confirmedCheckIns
      };
    });

    res.json({ trips: tripsWithCapacity });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Error fetching trips' });
  }
};

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByPk(id, {
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'phone']
        },
        {
          model: CheckIn,
          as: 'checkIns',
          include: [
            {
              model: User,
              as: 'passenger',
              attributes: ['id', 'name', 'phone']
            }
          ]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const tripData = trip.toJSON();
    const confirmedCheckIns = tripData.checkIns.filter(c => c.status === 'confirmed').length;

    res.json({
      trip: {
        ...tripData,
        availableSeats: tripData.capacity - confirmedCheckIns,
        confirmedPassengers: confirmedCheckIns
      }
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Error fetching trip' });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const trip = await Trip.findByPk(id);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.driverId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this trip' });
    }

    await trip.update(updates);

    res.json({
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Error updating trip' });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByPk(id);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.driverId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this trip' });
    }

    await trip.destroy();

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Error deleting trip' });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    const trip = await Trip.findByPk(id);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.driverId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this trip' });
    }

    await trip.update({
      currentLocation: {
        latitude,
        longitude,
        timestamp: new Date()
      }
    });

    // Emit location update via Socket.IO (handled in server.js)
    req.app.io.to(`trip-${id}`).emit('locationUpdate', {
      tripId: id,
      latitude,
      longitude,
      timestamp: new Date()
    });

    res.json({
      message: 'Location updated successfully',
      location: trip.currentLocation
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Error updating location' });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  updateLocation
};
