const { AgentEntiteeAccess } = require("../models");

exports.grant = async (req, res) => {
  const { agent_id, entitee_type, entitee_id } = req.body;

  const row = await AgentEntiteeAccess.create({
    agent_id,
    entitee_type,
    entitee_id,
  });

  res.json(row);
};

exports.revoke = async (req, res) => {
  const { id } = req.params;
  await AgentEntiteeAccess.destroy({ where: { id } });
  res.json({ success: true });
};

exports.list = async (req, res) => {
  const data = await AgentEntiteeAccess.findAll();
  res.json(data);
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { agent_id, entitee_type, entitee_id } = req.body;

    // Chercher l'accès existant
    const row = await AgentEntiteeAccess.findByPk(id);
    if (!row) {
      return res.status(404).json({ message: "Accès introuvable" });
    }

    // Mettre à jour les champs
    row.agent_id = agent_id ?? row.agent_id;
    row.entitee_type = entitee_type ?? row.entitee_type;
    row.entitee_id = entitee_id ?? row.entitee_id;

    await row.save();

    res.json(row);
  } catch (error) {
    console.error("❌ Erreur update AgentEntiteeAccess:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'accès",
      error: error.message,
    });
  }
};
