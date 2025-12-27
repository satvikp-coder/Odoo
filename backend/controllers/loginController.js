const { User } = require('../models');

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, password, role, maintenanceTeamId } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Username and Password required." });
    }

    const exists = await User.findOne({ where: { name } });
    if (exists) {
      return res.status(409).json({ error: "User with that username already exists." });
    }

    const user = await User.create({
      name,
      password, 
      role,
      maintenanceTeamId
    });

    res.status(201).json({
      message: "signup success",
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        maintenanceTeamId: user.maintenanceTeamId
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ where: { name } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    //console.log(user.role, password);
    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect Password." });
    }

    res.json({
      message: "login success",
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        maintenanceTeamId: user.maintenanceTeamId
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
