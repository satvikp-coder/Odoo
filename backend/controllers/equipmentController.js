const { Equipment, Request, MaintenanceTeam } = require('../models');

// GET /api/equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findAll({ include: MaintenanceTeam });
    res.json(equipment);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/equipment/:id
// Implements "Smart Button": Counts open requests [cite: 71, 72, 73]
exports.getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByPk(id, {
      include: [{
        model: Request,
        attributes: ['id', 'stage'] // We only need stage to count
      }]
    });

    if (!equipment) return res.status(404).json({ error: "Not found" });

    // Count only active requests (New or In Progress) for the badge
    const openRequestsCount = equipment.maintenance_requests.filter(
      r => ['New', 'In Progress'].includes(r.stage)
    ).length;

    res.json({
      ...equipment.toJSON(),
      smart_button_count: openRequestsCount 
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};