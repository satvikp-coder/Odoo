const { Request, Equipment, MaintenanceTeam, User } = require('../models');

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        { model: Equipment, attributes: ['name'] },
        { model: MaintenanceTeam, attributes: ['name'] },
        { model: User, as: 'technician', attributes: ['name'] }
      ]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { subject, type, equipment_id, scheduled_date, description, priority } = req.body;
    const equipment = await Equipment.findByPk(equipment_id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const newRequest = await Request.create({
      subject,
      type: type || 'Corrective', 
      equipmentId: equipment_id,
      maintenanceTeamId: equipment.maintenanceTeamId, 
      scheduled_date,
      description,
      priority,
      stage: 'New'
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Create Request Error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, technicianId, duration } = req.body;

    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (stage) request.stage = stage;
    if (technicianId) request.technicianId = technicianId;
    if (duration) request.duration = duration;
    if (stage === 'Scrap') {
      await Equipment.update(
        { status: 'Scrapped' },
        { where: { id: request.equipmentId } }
      );
    }

    await request.save();
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};