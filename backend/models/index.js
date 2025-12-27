const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// --- 1. Maintenance Team ---
const MaintenanceTeam = sequelize.define('maintenance_team', {
  name: { type: Sequelize.STRING, allowNull: false }
});

// --- 2. User (Technician/Manager) ---
const User = sequelize.define('user', {
  name: { type: Sequelize.STRING, allowNull: false },
  // ADDED PASSWORD HERE
  password: { type: Sequelize.STRING, allowNull: false }, 
  role: { type: Sequelize.STRING }, 
});

// --- 3. Equipment ---
const Equipment = sequelize.define('equipment', {
  name: { type: Sequelize.STRING, allowNull: false },
  serial_number: { type: Sequelize.STRING },
  location: { type: Sequelize.STRING },
  status: { 
    type: Sequelize.ENUM, 
    values: ['Active', 'Scrapped'], 
    defaultValue: 'Active' 
  }
});

// --- 4. Maintenance Request ---
const Request = sequelize.define('maintenance_request', {
  subject: { type: Sequelize.STRING, allowNull: false },
  type: { 
    type: Sequelize.ENUM, 
    values: ['Corrective', 'Preventive'], 
    allowNull: false 
  },
  scheduled_date: { type: Sequelize.DATEONLY },
  duration: { type: Sequelize.FLOAT, defaultValue: 0 },
  stage: { 
    type: Sequelize.ENUM, 
    values: ['New', 'In Progress', 'Repaired', 'Scrap'], 
    defaultValue: 'New' 
  }
});

// --- Relationships ---
MaintenanceTeam.hasMany(User);
User.belongsTo(MaintenanceTeam);

MaintenanceTeam.hasMany(Equipment);
Equipment.belongsTo(MaintenanceTeam);

Equipment.hasMany(Request);
Request.belongsTo(Equipment);

MaintenanceTeam.hasMany(Request);
Request.belongsTo(MaintenanceTeam);

User.hasMany(Request, { as: 'technician' });
Request.belongsTo(User, { as: 'technician' });

module.exports = { sequelize, MaintenanceTeam, User, Equipment, Request };