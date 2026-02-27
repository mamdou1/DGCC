import api from "./axios";

// =============================================
// TOTAUX GLOBAUX
// =============================================

export const getTotalAgents = async () => {
  try {
    const res = await api.get("/statistiques/totaux/agents");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getTotalAgents:", error);
    throw error;
  }
};

export const getTotalTypesDocument = async () => {
  try {
    const res = await api.get("/statistiques/totaux/types-document");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getTotalTypesDocument:", error);
    throw error;
  }
};

export const getTotalDocuments = async () => {
  try {
    const res = await api.get("/statistiques/totaux/documents");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getTotalDocuments:", error);
    throw error;
  }
};

// =============================================
// AGENTS PAR STRUCTURE (NOUVELLES ENTITÉS)
// =============================================

export const getAgentsByDirection = async () => {
  try {
    const res = await api.get("/statistiques/agents/direction");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getAgentsByDirection:", error);
    throw error;
  }
};

export const getAgentsBySousDirection = async () => {
  try {
    const res = await api.get("/statistiques/agents/sous-direction");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getAgentsBySousDirection:", error);
    throw error;
  }
};

export const getAgentsByDivision = async () => {
  try {
    const res = await api.get("/statistiques/agents/division");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getAgentsByDivision:", error);
    throw error;
  }
};

export const getAgentsBySection = async () => {
  try {
    const res = await api.get("/statistiques/agents/section");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getAgentsBySection:", error);
    throw error;
  }
};

export const getAgentsByService = async () => {
  try {
    const res = await api.get("/statistiques/agents/service");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getAgentsByService:", error);
    throw error;
  }
};

export const getAgentsByStructure = async () => {
  try {
    const res = await api.get("/statistiques/agents/structure");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getAgentsByStructure:", error);
    throw error;
  }
};

// =============================================
// DOCUMENTS
// =============================================

export const getDocumentsByType = async () => {
  try {
    const res = await api.get("/statistiques/documents/type");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getDocumentsByType:", error);
    throw error;
  }
};

export const getDocumentsByMonth = async () => {
  try {
    const res = await api.get("/statistiques/documents/mois");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getDocumentsByMonth:", error);
    throw error;
  }
};

export const getDocumentsByStructure = async () => {
  try {
    const res = await api.get("/statistiques/documents/structure");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getDocumentsByStructure:", error);
    throw error;
  }
};
