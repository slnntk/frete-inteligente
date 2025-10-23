const express = require('express');
const { body } = require('express-validator');
const {
  createCheckIn,
  getMyCheckIns,
  cancelCheckIn,
  updatePaymentStatus,
  getTripCheckIns
} = require('../controllers/checkInController');
const { auth, checkUserType } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createCheckInValidation = [
  body('tripId').isUUID().withMessage('Valid trip ID is required'),
  body('pickupLocation').optional().trim()
];

const updatePaymentValidation = [
  body('paymentStatus').isIn(['pending', 'paid', 'refunded']).withMessage('Invalid payment status')
];

// Routes
router.post('/', auth, createCheckInValidation, createCheckIn);
router.get('/my', auth, getMyCheckIns);
router.put('/:id/cancel', auth, cancelCheckIn);
router.put('/:id/payment', auth, updatePaymentValidation, updatePaymentStatus);
router.get('/trip/:tripId', auth, checkUserType('driver', 'company'), getTripCheckIns);

module.exports = router;
