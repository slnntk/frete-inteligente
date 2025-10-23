const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  driverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departureTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  arrivalTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  currentLocation: {
    type: DataTypes.JSONB,
    allowNull: true,
    // Stores { latitude, longitude, timestamp }
  },
  route: {
    type: DataTypes.JSONB,
    allowNull: true,
    // Stores optimized route points
  }
}, {
  timestamps: true
});

module.exports = Trip;
