const { Site, Salle } = require("../models");

exports.create = async (req, res) => {
  const data = await Site.create(req.body);
  res.json(data);
};

exports.findAll = async (req, res) => {
  const data = await Site.findAll();
  res.json(data);
};

exports.findById = async (req, res) => {
  const data = await Site.findByPk(req.params.id);
  res.json(data);
};

exports.update = async (req, res) => {
  await Site.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
};

exports.delete = async (req, res) => {
  await Site.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
};

exports.getAllSalleBySite = async (req, res) => {
  const data = await Salle.findAll({
    where: { site_id: req.params.id },
  });
  res.json(data);
};
