import api from "../api/axios"; // ton instance Axios

// Créer un accès
export const grantAccess = async (payload: any[]) => {
  const { data } = await api.post("/agent-access", payload);
  return data;
};

// ➡️ Mettre à jour un accès
export const updateAccess = async (
  id: number,
  agent_id: number,
  entitee_type: "UN" | "DEUX" | "TROIS",
  entitee_id: number,
) => {
  const { data } = await api.put(`/agent-entitee-access/${id}`, {
    agent_id,
    entitee_type,
    entitee_id,
  });
  return data;
};

// Révoquer un accès
export const revokeAccess = async (id: number) => {
  const { data } = await api.delete(`/agent-access/${id}`);
  return data;
};

// Lister tous les accès
export const listAccess = async () => {
  const { data } = await api.get("/agent-access");
  return data;
};
