const express = require('express');
const { body } = require('express-validator');
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  updateLocation
} = require('../controllers/tripController');
const { auth, checkUserType } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createTripValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('origin').trim().notEmpty().withMessage('Origin is required'),
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('departureTime').isISO8601().withMessage('Valid departure time is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1')
];

const updateLocationValidation = [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
];

// Routes
router.post('/', auth, checkUserType('driver', 'company'), createTripValidation, createTrip);
router.get('/', auth, getTrips);
router.get('/:id', auth, getTripById);
router.put('/:id', auth, checkUserType('driver', 'company'), updateTrip);
router.delete('/:id', auth, checkUserType('driver', 'company'), deleteTrip);
router.post('/:id/location', auth, checkUserType('driver', 'company'), updateLocationValidation, updateLocation);

module.exports = router;
