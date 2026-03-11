var DataTypes = require("sequelize").DataTypes;
var _agent = require("./agent");
var _agent_entitee_access = require("./agent_entitee_access");
var _agent_permissions = require("./agent_permissions");
var _box = require("./box");
var _document_fichiers = require("./document_fichiers");
var _document_files = require("./document_files");
var _document_pieces = require("./document_pieces");
var _document_type_pieces = require("./document_type_pieces");
var _documents = require("./documents");
var _documentvalues = require("./documentvalues");
var _droit = require("./droit");
var _droit_permission = require("./droit_permission");
var _entitee_deux = require("./entitee_deux");
var _entitee_trois = require("./entitee_trois");
var _entitee_un = require("./entitee_un");
var _exercice = require("./exercice");
var _fonctions = require("./fonctions");
var _fournisseur = require("./fournisseur");
var _historiquelog = require("./historiquelog");
var _metafields = require("./metafields");
var _permissions = require("./permissions");
var _piece_meta_fields = require("./piece_meta_fields");
var _piece_values = require("./piece_values");
var _pieces = require("./pieces");
var _pieces_fichiers = require("./pieces_fichiers");
var _pieces_files = require("./pieces_files");
var _rayons = require("./rayons");
var _salles = require("./salles");
var _sites = require("./sites");
var _token = require("./token");
var _traves = require("./traves");
var _typedocuments = require("./typedocuments");

function initModels(sequelize) {
  var agent = _agent(sequelize, DataTypes);
  var agent_entitee_access = _agent_entitee_access(sequelize, DataTypes);
  var agent_permissions = _agent_permissions(sequelize, DataTypes);
  var box = _box(sequelize, DataTypes);
  var document_fichiers = _document_fichiers(sequelize, DataTypes);
  var document_files = _document_files(sequelize, DataTypes);
  var document_pieces = _document_pieces(sequelize, DataTypes);
  var document_type_pieces = _document_type_pieces(sequelize, DataTypes);
  var documents = _documents(sequelize, DataTypes);
  var documentvalues = _documentvalues(sequelize, DataTypes);
  var droit = _droit(sequelize, DataTypes);
  var droit_permission = _droit_permission(sequelize, DataTypes);
  var entitee_deux = _entitee_deux(sequelize, DataTypes);
  var entitee_trois = _entitee_trois(sequelize, DataTypes);
  var entitee_un = _entitee_un(sequelize, DataTypes);
  var exercice = _exercice(sequelize, DataTypes);
  var fonctions = _fonctions(sequelize, DataTypes);
  var fournisseur = _fournisseur(sequelize, DataTypes);
  var historiquelog = _historiquelog(sequelize, DataTypes);
  var metafields = _metafields(sequelize, DataTypes);
  var permissions = _permissions(sequelize, DataTypes);
  var piece_meta_fields = _piece_meta_fields(sequelize, DataTypes);
  var piece_values = _piece_values(sequelize, DataTypes);
  var pieces = _pieces(sequelize, DataTypes);
  var pieces_fichiers = _pieces_fichiers(sequelize, DataTypes);
  var pieces_files = _pieces_files(sequelize, DataTypes);
  var rayons = _rayons(sequelize, DataTypes);
  var salles = _salles(sequelize, DataTypes);
  var sites = _sites(sequelize, DataTypes);
  var token = _token(sequelize, DataTypes);
  var traves = _traves(sequelize, DataTypes);
  var typedocuments = _typedocuments(sequelize, DataTypes);

  agent.belongsToMany(permissions, { as: 'permission_id_permissions', through: agent_permissions, foreignKey: "agent_id", otherKey: "permission_id" });
  documents.belongsToMany(pieces, { as: 'piece_id_pieces', through: document_pieces, foreignKey: "document_id", otherKey: "piece_id" });
  droit.belongsToMany(permissions, { as: 'permission_id_permissions_droit_permissions', through: droit_permission, foreignKey: "droit_id", otherKey: "permission_id" });
  permissions.belongsToMany(agent, { as: 'agent_id_agents', through: agent_permissions, foreignKey: "permission_id", otherKey: "agent_id" });
  permissions.belongsToMany(droit, { as: 'droit_id_droits', through: droit_permission, foreignKey: "permission_id", otherKey: "droit_id" });
  pieces.belongsToMany(documents, { as: 'document_id_documents', through: document_pieces, foreignKey: "piece_id", otherKey: "document_id" });
  pieces.belongsToMany(typedocuments, { as: 'document_type_id_typedocuments', through: document_type_pieces, foreignKey: "piece_id", otherKey: "document_type_id" });
  typedocuments.belongsToMany(pieces, { as: 'piece_id_pieces_document_type_pieces', through: document_type_pieces, foreignKey: "document_type_id", otherKey: "piece_id" });
  agent.belongsTo(agent, { as: "enregistrer_par_agent", foreignKey: "enregistrer_par"});
  agent.hasMany(agent, { as: "agents", foreignKey: "enregistrer_par"});
  agent_entitee_access.belongsTo(agent, { as: "agent", foreignKey: "agent_id"});
  agent.hasMany(agent_entitee_access, { as: "agent_entitee_accesses", foreignKey: "agent_id"});
  agent_permissions.belongsTo(agent, { as: "agent", foreignKey: "agent_id"});
  agent.hasMany(agent_permissions, { as: "agent_permissions", foreignKey: "agent_id"});
  historiquelog.belongsTo(agent, { as: "agent", foreignKey: "agent_id"});
  agent.hasMany(historiquelog, { as: "historiquelogs", foreignKey: "agent_id"});
  token.belongsTo(agent, { as: "agent", foreignKey: "agent_id"});
  agent.hasMany(token, { as: "tokens", foreignKey: "agent_id"});
  documents.belongsTo(box, { as: "box", foreignKey: "box_id"});
  box.hasMany(documents, { as: "documents", foreignKey: "box_id"});
  document_fichiers.belongsTo(documents, { as: "document", foreignKey: "document_id"});
  documents.hasMany(document_fichiers, { as: "document_fichiers", foreignKey: "document_id"});
  document_files.belongsTo(documents, { as: "document", foreignKey: "document_id"});
  documents.hasMany(document_files, { as: "document_files", foreignKey: "document_id"});
  document_pieces.belongsTo(documents, { as: "document", foreignKey: "document_id"});
  documents.hasMany(document_pieces, { as: "document_pieces", foreignKey: "document_id"});
  documentvalues.belongsTo(documents, { as: "document", foreignKey: "document_id"});
  documents.hasMany(documentvalues, { as: "documentvalues", foreignKey: "document_id"});
  piece_values.belongsTo(documents, { as: "document", foreignKey: "document_id"});
  documents.hasMany(piece_values, { as: "piece_values", foreignKey: "document_id"});
  pieces_fichiers.belongsTo(documents, { as: "document", foreignKey: "document_id"});
  documents.hasMany(pieces_fichiers, { as: "pieces_fichiers", foreignKey: "document_id"});
  document_fichiers.belongsTo(documentvalues, { as: "document_value", foreignKey: "document_value_id"});
  documentvalues.hasMany(document_fichiers, { as: "document_fichiers", foreignKey: "document_value_id"});
  document_files.belongsTo(documentvalues, { as: "document_value", foreignKey: "document_value_id"});
  documentvalues.hasMany(document_files, { as: "document_files", foreignKey: "document_value_id"});
  agent.belongsTo(droit, { as: "droit", foreignKey: "droit_id"});
  droit.hasMany(agent, { as: "agents", foreignKey: "droit_id"});
  droit_permission.belongsTo(droit, { as: "droit", foreignKey: "droit_id"});
  droit.hasMany(droit_permission, { as: "droit_permissions", foreignKey: "droit_id"});
  agent_entitee_access.belongsTo(entitee_deux, { as: "entitee_deux", foreignKey: "entitee_deux_id"});
  entitee_deux.hasMany(agent_entitee_access, { as: "agent_entitee_accesses", foreignKey: "entitee_deux_id"});
  box.belongsTo(entitee_deux, { as: "entitee_deux", foreignKey: "entitee_deux_id"});
  entitee_deux.hasMany(box, { as: "boxes", foreignKey: "entitee_deux_id"});
  entitee_trois.belongsTo(entitee_deux, { as: "entitee_deux", foreignKey: "entitee_deux_id"});
  entitee_deux.hasMany(entitee_trois, { as: "entitee_trois", foreignKey: "entitee_deux_id"});
  fonctions.belongsTo(entitee_deux, { as: "entitee_deux", foreignKey: "entitee_deux_id"});
  entitee_deux.hasMany(fonctions, { as: "fonctions", foreignKey: "entitee_deux_id"});
  typedocuments.belongsTo(entitee_deux, { as: "entitee_deux", foreignKey: "entitee_deux_id"});
  entitee_deux.hasMany(typedocuments, { as: "typedocuments", foreignKey: "entitee_deux_id"});
  agent_entitee_access.belongsTo(entitee_trois, { as: "entitee_troi", foreignKey: "entitee_trois_id"});
  entitee_trois.hasMany(agent_entitee_access, { as: "agent_entitee_accesses", foreignKey: "entitee_trois_id"});
  box.belongsTo(entitee_trois, { as: "entitee_troi", foreignKey: "entitee_trois_id"});
  entitee_trois.hasMany(box, { as: "boxes", foreignKey: "entitee_trois_id"});
  fonctions.belongsTo(entitee_trois, { as: "entitee_troi", foreignKey: "entitee_trois_id"});
  entitee_trois.hasMany(fonctions, { as: "fonctions", foreignKey: "entitee_trois_id"});
  typedocuments.belongsTo(entitee_trois, { as: "entitee_troi", foreignKey: "entitee_trois_id"});
  entitee_trois.hasMany(typedocuments, { as: "typedocuments", foreignKey: "entitee_trois_id"});
  agent_entitee_access.belongsTo(entitee_un, { as: "entitee_un", foreignKey: "entitee_un_id"});
  entitee_un.hasMany(agent_entitee_access, { as: "agent_entitee_accesses", foreignKey: "entitee_un_id"});
  box.belongsTo(entitee_un, { as: "entitee_un", foreignKey: "entitee_un_id"});
  entitee_un.hasMany(box, { as: "boxes", foreignKey: "entitee_un_id"});
  entitee_deux.belongsTo(entitee_un, { as: "entitee_un", foreignKey: "entitee_un_id"});
  entitee_un.hasMany(entitee_deux, { as: "entitee_deuxes", foreignKey: "entitee_un_id"});
  fonctions.belongsTo(entitee_un, { as: "entitee_un", foreignKey: "entitee_un_id"});
  entitee_un.hasMany(fonctions, { as: "fonctions", foreignKey: "entitee_un_id"});
  typedocuments.belongsTo(entitee_un, { as: "entitee_un", foreignKey: "entitee_un_id"});
  entitee_un.hasMany(typedocuments, { as: "typedocuments", foreignKey: "entitee_un_id"});
  agent.belongsTo(fonctions, { as: "fonction", foreignKey: "fonction_id"});
  fonctions.hasMany(agent, { as: "agents", foreignKey: "fonction_id"});
  documentvalues.belongsTo(metafields, { as: "meta_field", foreignKey: "meta_field_id"});
  metafields.hasMany(documentvalues, { as: "documentvalues", foreignKey: "meta_field_id"});
  agent_permissions.belongsTo(permissions, { as: "permission", foreignKey: "permission_id"});
  permissions.hasMany(agent_permissions, { as: "agent_permissions", foreignKey: "permission_id"});
  droit_permission.belongsTo(permissions, { as: "permission", foreignKey: "permission_id"});
  permissions.hasMany(droit_permission, { as: "droit_permissions", foreignKey: "permission_id"});
  piece_values.belongsTo(piece_meta_fields, { as: "piece_meta_field", foreignKey: "piece_meta_field_id"});
  piece_meta_fields.hasMany(piece_values, { as: "piece_values", foreignKey: "piece_meta_field_id"});
  document_fichiers.belongsTo(piece_values, { as: "piece_value", foreignKey: "piece_value_id"});
  piece_values.hasMany(document_fichiers, { as: "document_fichiers", foreignKey: "piece_value_id"});
  pieces_fichiers.belongsTo(piece_values, { as: "piece_value", foreignKey: "piece_value_id"});
  piece_values.hasMany(pieces_fichiers, { as: "pieces_fichiers", foreignKey: "piece_value_id"});
  pieces_files.belongsTo(piece_values, { as: "pieces_value", foreignKey: "pieces_value_id"});
  piece_values.hasMany(pieces_files, { as: "pieces_files", foreignKey: "pieces_value_id"});
  document_fichiers.belongsTo(pieces, { as: "piece", foreignKey: "piece_id"});
  pieces.hasMany(document_fichiers, { as: "document_fichiers", foreignKey: "piece_id"});
  document_pieces.belongsTo(pieces, { as: "piece", foreignKey: "piece_id"});
  pieces.hasMany(document_pieces, { as: "document_pieces", foreignKey: "piece_id"});
  document_type_pieces.belongsTo(pieces, { as: "piece", foreignKey: "piece_id"});
  pieces.hasMany(document_type_pieces, { as: "document_type_pieces", foreignKey: "piece_id"});
  piece_meta_fields.belongsTo(pieces, { as: "piece", foreignKey: "piece_id"});
  pieces.hasMany(piece_meta_fields, { as: "piece_meta_fields", foreignKey: "piece_id"});
  piece_values.belongsTo(pieces, { as: "piece", foreignKey: "piece_id"});
  pieces.hasMany(piece_values, { as: "piece_values", foreignKey: "piece_id"});
  pieces_fichiers.belongsTo(pieces, { as: "piece", foreignKey: "piece_id"});
  pieces.hasMany(pieces_fichiers, { as: "pieces_fichiers", foreignKey: "piece_id"});
  pieces_files.belongsTo(pieces, { as: "piece", foreignKey: "pieces_id"});
  pieces.hasMany(pieces_files, { as: "pieces_files", foreignKey: "pieces_id"});
  traves.belongsTo(rayons, { as: "rayon", foreignKey: "rayon_id"});
  rayons.hasMany(traves, { as: "traves", foreignKey: "rayon_id"});
  salles.belongsTo(sites, { as: "site", foreignKey: "site_id"});
  sites.hasMany(salles, { as: "salles", foreignKey: "site_id"});
  box.belongsTo(typedocuments, { as: "type_document", foreignKey: "type_document_id"});
  typedocuments.hasMany(box, { as: "boxes", foreignKey: "type_document_id"});
  document_type_pieces.belongsTo(typedocuments, { as: "document_type", foreignKey: "document_type_id"});
  typedocuments.hasMany(document_type_pieces, { as: "document_type_pieces", foreignKey: "document_type_id"});
  documents.belongsTo(typedocuments, { as: "type_document", foreignKey: "type_document_id"});
  typedocuments.hasMany(documents, { as: "documents", foreignKey: "type_document_id"});
  metafields.belongsTo(typedocuments, { as: "type_document", foreignKey: "type_document_id"});
  typedocuments.hasMany(metafields, { as: "metafields", foreignKey: "type_document_id"});

  return {
    agent,
    agent_entitee_access,
    agent_permissions,
    box,
    document_fichiers,
    document_files,
    document_pieces,
    document_type_pieces,
    documents,
    documentvalues,
    droit,
    droit_permission,
    entitee_deux,
    entitee_trois,
    entitee_un,
    exercice,
    fonctions,
    fournisseur,
    historiquelog,
    metafields,
    permissions,
    piece_meta_fields,
    piece_values,
    pieces,
    pieces_fichiers,
    pieces_files,
    rayons,
    salles,
    sites,
    token,
    traves,
    typedocuments,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;




