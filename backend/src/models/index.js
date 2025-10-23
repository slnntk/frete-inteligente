const sequelize = require('../config/database');
const User = require('./User');
const Trip = require('./Trip');
const CheckIn = require('./CheckIn');

// Define associations
User.hasMany(Trip, { foreignKey: 'driverId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

User.hasMany(CheckIn, { foreignKey: 'passengerId', as: 'checkIns' });
CheckIn.belongsTo(User, { foreignKey: 'passengerId', as: 'passenger' });

Trip.hasMany(CheckIn, { foreignKey: 'tripId', as: 'checkIns' });
CheckIn.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Trip,
  CheckIn,
  syncDatabase
};
