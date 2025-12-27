const Sequelize = require('sequelize');

const sequelize = new Sequelize('gearguard_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false 
});

module.exports = sequelize;