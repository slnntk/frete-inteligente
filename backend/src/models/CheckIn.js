const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CheckIn = sequelize.define('CheckIn', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Trips',
      key: 'id'
    }
  },
  passengerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    defaultValue: 'confirmed'
  },
  checkInTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  pickupLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pickupOrder: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['tripId', 'passengerId']
    }
  ]
});

module.exports = CheckIn;
