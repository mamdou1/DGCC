const { Salle, Etagere } = require("../models");

exports.create = async (req, res) => {
  const data = await Salle.create(req.body);
  res.json(data);
};

exports.findAll = async (req, res) => {
  const data = await Salle.findAll();
  res.json(data);
};

exports.findById = async (req, res) => {
  const data = await Salle.findByPk(req.params.id);
  res.json(data);
};

exports.update = async (req, res) => {
  await Salle.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
};

exports.delete = async (req, res) => {
  await Salle.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
};

exports.getAllEtagereBySalle = async (req, res) => {
  const data = await Etagere.findAll({
    where: { salle_id: req.params.id },
  });
  res.json(data);
};
