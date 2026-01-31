const { Box, Document } = require("../models");

exports.create = async (req, res) => {
  const data = await Box.create(req.body);
  res.json(data);
};

exports.findAll = async (req, res) => {
  const data = await Box.findAll();
  res.json(data);
};

exports.findById = async (req, res) => {
  const data = await Box.findByPk(req.params.id);
  res.json(data);
};

exports.update = async (req, res) => {
  await Box.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
};

exports.delete = async (req, res) => {
  await Box.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
};

exports.getAllDocumentByBox = async (req, res) => {
  const data = await Document.findAll({
    where: { box_id: req.params.id },
  });
  res.json(data);
};

exports.addDocumentToBox = async (req, res) => {
  const { boxId, documentId } = req.params;

  const box = await Box.findByPk(boxId);
  const doc = await Document.findByPk(documentId);

  if (!box || !doc) return res.status(404).json({ message: "Not found" });

  if (box.type_document_id && box.type_document_id !== doc.type_document_id) {
    return res.status(400).json({ message: "Type incompatible avec ce box" });
  }

  if (!box.type_document_id) {
    box.type_document_id = doc.type_document_id;
    await box.save();
  }

  doc.box_id = box.id;
  await doc.save();

  res.json({ success: true });
};

exports.retireDocumentToBox = async (req, res) => {
  const doc = await Document.findByPk(req.params.documentId);
  doc.box_id = null;
  await doc.save();
  res.json({ success: true });
};
