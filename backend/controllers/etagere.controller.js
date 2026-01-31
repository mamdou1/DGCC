const { Etagere, Box } = require("../models");

exports.create = async (req, res) => {
  const data = await Etagere.create(req.body);
  res.json(data);
};

exports.findAll = async (req, res) => {
  const data = await Etagere.findAll();
  res.json(data);
};

exports.findById = async (req, res) => {
  const data = await Etagere.findByPk(req.params.id);
  res.json(data);
};

exports.update = async (req, res) => {
  await Etagere.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
};

exports.delete = async (req, res) => {
  await Etagere.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
};

exports.getAllBoxByEtagere = async (req, res) => {
  const data = await Box.findAll({
    where: { etagere_id: req.params.id },
  });
  res.json(data);
};
