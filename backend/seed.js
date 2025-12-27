const { sequelize, MaintenanceTeam, User, Equipment, Request } = require('./models');

async function seed() {
  console.log('--- Starting Seeding Process ---');
  
  // 1. Reset Database
  await sequelize.sync({ force: true }); 
  console.log('Database reset.');

  // 2. Create Teams
  const mechanics = await MaintenanceTeam.create({ name: 'Mechanics' });
  const itSupport = await MaintenanceTeam.create({ name: 'IT Support' });
  const electricians = await MaintenanceTeam.create({ name: 'Electricians' });
  console.log('Teams created.');

  // 3. Create Users (WITH PASSWORDS)
  // Essential for the Login logic to work
  const users = await User.bulkCreate([
    { name: 'John Grease', password: '1234', role: 'Technician', maintenanceTeamId: mechanics.id },
    { name: 'Mike Wrench', password: '1234', role: 'Manager', maintenanceTeamId: mechanics.id },
    { name: 'Sarah Chips', password: '1234', role: 'Technician', maintenanceTeamId: itSupport.id },
    { name: 'Dave Cable', password: '1234', role: 'Technician', maintenanceTeamId: electricians.id },
    { name: 'Admin', password: '1234', role: 'Admin', maintenanceTeamId: itSupport.id }
  ]);
  console.log('Users created.');

  // 4. Define the 100 Assets List
  const assetList = [
    // --- PRODUCTION MACHINES (Mechanics) ---
    { id: 1, name: 'CNC Milling Machine 01', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 2, name: 'CNC Milling Machine 02', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 3, name: 'CNC Lathe Machine 01', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 4, name: 'CNC Lathe Machine 02', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 5, name: 'Hydraulic Press Machine', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 6, name: 'Injection Molding Machine', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 7, name: 'Sheet Metal Cutting Machine', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 8, name: 'Laser Cutting Machine', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 9, name: 'Plasma Cutting Machine', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 10, name: 'Grinding Machine', teamId: mechanics.id, loc: 'Production Floor' },
    { id: 11, name: 'Conveyor Belt System 01', teamId: mechanics.id, loc: 'Assembly Line' },
    { id: 12, name: 'Conveyor Belt System 02', teamId: mechanics.id, loc: 'Assembly Line' },
    { id: 13, name: 'Automatic Packing Machine', teamId: mechanics.id, loc: 'Packaging Area' },
    { id: 14, name: 'Labeling Machine', teamId: mechanics.id, loc: 'Packaging Area' },
    { id: 15, name: 'Shrink Wrapping Machine', teamId: mechanics.id, loc: 'Packaging Area' },
    { id: 16, name: 'Industrial Air Compressor 01', teamId: mechanics.id, loc: 'Utility Room' },
    { id: 17, name: 'Industrial Air Compressor 02', teamId: mechanics.id, loc: 'Utility Room' },
    { id: 18, name: 'Boiler System', teamId: mechanics.id, loc: 'Boiler Room' },
    { id: 19, name: 'Water Pump System', teamId: mechanics.id, loc: 'Utility Room' },
    { id: 20, name: 'Cooling Tower', teamId: mechanics.id, loc: 'Roof' },

    // --- ELECTRICAL SYSTEMS (Electricians) ---
    { id: 21, name: 'Power Generator 01', teamId: electricians.id, loc: 'Power Plant' },
    { id: 22, name: 'Power Generator 02', teamId: electricians.id, loc: 'Power Plant' },
    { id: 23, name: 'Industrial UPS System', teamId: electricians.id, loc: 'Server Room B' },
    { id: 24, name: 'Electrical Control Panel A', teamId: electricians.id, loc: 'Production Floor' },
    { id: 25, name: 'Electrical Control Panel B', teamId: electricians.id, loc: 'Assembly Line' },

    // --- TESTING & WAREHOUSE (Mechanics) ---
    { id: 26, name: 'Tensile Testing Machine', teamId: mechanics.id, loc: 'Quality Lab' },
    { id: 27, name: 'Hardness Testing Machine', teamId: mechanics.id, loc: 'Quality Lab' },
    { id: 28, name: 'Calibration Machine', teamId: mechanics.id, loc: 'Quality Lab' },
    { id: 29, name: 'Forklift Truck 01', teamId: mechanics.id, loc: 'Warehouse' },
    { id: 30, name: 'Forklift Truck 02', teamId: mechanics.id, loc: 'Warehouse' },
    { id: 31, name: 'Pallet Jack 01', teamId: mechanics.id, loc: 'Warehouse' },
    { id: 32, name: 'Pallet Jack 02', teamId: mechanics.id, loc: 'Warehouse' },
    { id: 33, name: 'Robotic Arm 01', teamId: mechanics.id, loc: 'Assembly Line' },
    { id: 34, name: 'Robotic Arm 02', teamId: mechanics.id, loc: 'Assembly Line' },
    { id: 35, name: 'Welding Machine 01', teamId: mechanics.id, loc: 'Assembly Line' },
    { id: 36, name: 'Welding Machine 02', teamId: mechanics.id, loc: 'Assembly Line' },
    { id: 37, name: 'Paint Spray Booth', teamId: mechanics.id, loc: 'Paint Shop' },
    { id: 38, name: 'Dust Extraction System', teamId: mechanics.id, loc: 'Paint Shop' },
    { id: 39, name: 'Industrial Oven', teamId: mechanics.id, loc: 'Paint Shop' },
    { id: 40, name: 'Vibratory Feeder', teamId: mechanics.id, loc: 'Assembly Line' },

    // --- FLEET / VEHICLES (Mechanics) ---
    { id: 41, name: 'Delivery Van 01', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 42, name: 'Delivery Van 02', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 43, name: 'Delivery Van 03', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 44, name: 'Cargo Truck 01', teamId: mechanics.id, loc: 'Loading Bay' },
    { id: 45, name: 'Cargo Truck 02', teamId: mechanics.id, loc: 'Loading Bay' },
    { id: 46, name: 'Cargo Truck 03', teamId: mechanics.id, loc: 'Loading Bay' },
    { id: 47, name: 'Company Sedan 01', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 48, name: 'Company Sedan 02', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 49, name: 'Company SUV 01', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 50, name: 'Company SUV 02', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 51, name: 'Service Pickup Truck 01', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 52, name: 'Service Pickup Truck 02', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 53, name: 'Mobile Maintenance Van', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 54, name: 'Electric Utility Cart', teamId: mechanics.id, loc: 'Campus' },
    { id: 55, name: 'Diesel Utility Vehicle', teamId: mechanics.id, loc: 'Campus' },
    { id: 56, name: 'Company Motorcycle 01', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 57, name: 'Company Motorcycle 02', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 58, name: 'Company Motorcycle 03', teamId: mechanics.id, loc: 'Parking Lot' },
    { id: 59, name: 'Crane Truck', teamId: mechanics.id, loc: 'Heavy Yard' },
    { id: 60, name: 'Tow Truck', teamId: mechanics.id, loc: 'Heavy Yard' },
    { id: 61, name: 'Security Patrol Vehicle 01', teamId: mechanics.id, loc: 'Main Gate' },
    { id: 62, name: 'Security Patrol Vehicle 02', teamId: mechanics.id, loc: 'Back Gate' },
    { id: 63, name: 'Emergency Response Vehicle', teamId: mechanics.id, loc: 'Main Gate' },
    { id: 64, name: 'Fuel Tanker', teamId: mechanics.id, loc: 'Fuel Station' },
    { id: 65, name: 'Water Tanker', teamId: mechanics.id, loc: 'Utility Area' },
    { id: 66, name: 'Staff Transport Bus', teamId: mechanics.id, loc: 'Bus Depot' },
    { id: 67, name: 'Mini Bus', teamId: mechanics.id, loc: 'Bus Depot' },
    { id: 68, name: 'Old Delivery Van (Spare)', teamId: mechanics.id, loc: 'Scrapyard' },
    { id: 69, name: 'Executive Car', teamId: mechanics.id, loc: 'VIP Parking' },
    { id: 70, name: 'Test Drive Vehicle', teamId: mechanics.id, loc: 'Showroom' },

    // --- IT ASSETS (IT Support) ---
    { id: 71, name: 'Desktop Computer – HR', teamId: itSupport.id, loc: 'HR Office' },
    { id: 72, name: 'Desktop Computer – Accounts', teamId: itSupport.id, loc: 'Accounts Office' },
    { id: 73, name: 'Desktop Computer – Reception', teamId: itSupport.id, loc: 'Lobby' },
    { id: 74, name: 'Desktop Computer – Procurement', teamId: itSupport.id, loc: 'Procurement Office' },
    { id: 75, name: 'Laptop – CEO', teamId: itSupport.id, loc: 'Executive Suite' },
    { id: 76, name: 'Laptop – Operations Manager', teamId: itSupport.id, loc: 'Ops Office' },
    { id: 77, name: 'Laptop – Finance Manager', teamId: itSupport.id, loc: 'Finance Office' },
    { id: 78, name: 'Laptop – HR Manager', teamId: itSupport.id, loc: 'HR Office' },
    { id: 79, name: 'Engineering Workstation 01', teamId: itSupport.id, loc: 'Design Lab' },
    { id: 80, name: 'Engineering Workstation 02', teamId: itSupport.id, loc: 'Design Lab' },
    { id: 81, name: 'Production Control PC', teamId: itSupport.id, loc: 'Production Floor' },
    { id: 82, name: 'IT Support Laptop 01', teamId: itSupport.id, loc: 'Server Room' },
    { id: 83, name: 'IT Support Laptop 02', teamId: itSupport.id, loc: 'Server Room' },
    { id: 84, name: 'Server Machine 01', teamId: itSupport.id, loc: 'Server Room' },
    { id: 85, name: 'Server Machine 02', teamId: itSupport.id, loc: 'Server Room' },
    { id: 86, name: 'Backup Server', teamId: itSupport.id, loc: 'Server Room' },
    { id: 87, name: 'Network Switch 01', teamId: itSupport.id, loc: 'Server Room' },
    { id: 88, name: 'Network Switch 02', teamId: itSupport.id, loc: 'Floor 2 Closet' },
    { id: 89, name: 'Firewall Appliance', teamId: itSupport.id, loc: 'Server Room' },
    { id: 90, name: 'Sales Laptop 01', teamId: itSupport.id, loc: 'Sales Office' },
    { id: 91, name: 'Sales Laptop 02', teamId: itSupport.id, loc: 'Sales Office' },
    { id: 92, name: 'Sales Laptop 03', teamId: itSupport.id, loc: 'Sales Office' },
    { id: 93, name: 'Conference Room PC', teamId: itSupport.id, loc: 'Conference Room A' },
    { id: 94, name: 'Training Room PC', teamId: itSupport.id, loc: 'Training Hall' },
    { id: 95, name: 'Barcode Scanner System', teamId: itSupport.id, loc: 'Warehouse' },
    { id: 96, name: 'POS System 01', teamId: itSupport.id, loc: 'Cafeteria' },
    { id: 97, name: 'POS System 02', teamId: itSupport.id, loc: 'Retail Store' },
    { id: 98, name: 'Printer 01', teamId: itSupport.id, loc: 'Admin Office' },
    { id: 99, name: 'Printer 02', teamId: itSupport.id, loc: 'HR Office' },
    { id: 100, name: 'CCTV Monitoring System', teamId: itSupport.id, loc: 'Security Room' }
  ];

  // 5. Bulk Create Equipment
  const equipmentData = assetList.map(item => ({
    id: item.id, // Explicitly set ID to ensure the Requests link correctly below
    name: item.name,
    serial_number: `GG-SN-${1000 + item.id}`, 
    location: item.loc,
    maintenanceTeamId: item.teamId,
    status: 'Active'
  }));

  const createdEquipment = await Equipment.bulkCreate(equipmentData);
  console.log(`Successfully seeded ${createdEquipment.length} Equipment items.`);

  // 6. Create Test Requests
  const requests = [
    // Corrective for CNC (Item 1)
    {
      subject: 'Leaking Coolant Fluid',
      type: 'Corrective',
      stage: 'New',
      equipmentId: 1, // Matches CNC Milling 01
      maintenanceTeamId: mechanics.id
    },
    // Preventive for Server (Item 84)
    {
      subject: 'Annual Firmware Update',
      type: 'Preventive',
      stage: 'New',
      equipmentId: 84, // Matches Server Machine 01
      maintenanceTeamId: itSupport.id,
      scheduled_date: new Date(new Date().setDate(new Date().getDate() + 5))
    },
    // In Progress for Printer (Item 98)
    {
      subject: 'Paper Tray Jammed',
      type: 'Corrective',
      stage: 'In Progress',
      equipmentId: 98, // Matches Printer 01
      maintenanceTeamId: itSupport.id,
      technicianId: 3 // Sarah Chips
    },
    // Scrapped Item (Item 68)
    {
      subject: 'Engine Block Cracked',
      type: 'Corrective',
      stage: 'Scrap',
      equipmentId: 68, // Matches Old Delivery Van
      maintenanceTeamId: mechanics.id,
      duration: 5.0
    }
  ];

  await Request.bulkCreate(requests);
  
  // Set the Old Delivery Van status to 'Scrapped' to match the request above
  await Equipment.update({ status: 'Scrapped' }, { where: { id: 68 } });

  console.log('Test Requests created.');
  console.log('--- Seeding Complete ---');
  process.exit();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});