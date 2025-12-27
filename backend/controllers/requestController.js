const { Request, Equipment } = require('../models');

// POST /api/requests
// Implements "Flow 1" & "Flow 2" creation [cite: 39, 47]
exports.createRequest = async (req, res) => {
  try {
    const { subject, equipment_id, type, scheduled_date } = req.body;

    // 1. Auto-Fill Logic [cite: 40, 41]
    // Fetch equipment to find its responsible team
    const equipment = await Equipment.findByPk(equipment_id);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });

    const newRequest = await Request.create({
      subject,
      equipment_id,
      request_type: type, // Corrective or Preventive
      scheduled_date: type === 'Preventive' ? scheduled_date : null, // [cite: 48]
      maintenance_team_id: equipment.maintenance_teamId, // AUTO-FILLED from Equipment
      stage: 'New' // Starts in New stage [cite: 42]
    });

    res.status(201).json(newRequest);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// PUT /api/requests/:id
// Handles Stage Movements & Scrap Logic [cite: 57]
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, duration, technician_id } = req.body;

    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    // Update fields
    if (stage) request.stage = stage;
    if (duration) request.duration = duration; // Recorded on Completion [cite: 45]
    if (technician_id) request.technicianId = technician_id; // Assignment [cite: 43]

    await request.save();

    // --- SCRAP LOGIC [cite: 74, 76] ---
    // If request is moved to Scrap, mark equipment as Scrapped
    if (stage === 'Scrap') {
      await Equipment.update(
        { status: 'Scrapped' },
        { where: { id: request.equipmentId } }
      );
    }

    res.json(request);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/requests
// Supports Kanban Board (Group By Stage) [cite: 55] and Calendar View [cite: 61]
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({ include: [Equipment] });
    res.json(requests);
  } catch (err) { res.status(500).json({ error: err.message }); }
};