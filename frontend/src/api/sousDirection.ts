// api/sousDirection.ts
import api from "./axios";
import type { Fonction, SousDirection } from "../interfaces";

export const getSousDirections = async (): Promise<SousDirection[]> => {
  try {
    console.log("🟢 Appel API: GET /api/sous-directions");
    const response = await api.get("/sous-directions");
    console.log("✅ Sous-directions reçues:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getSousDirections:", error);
    throw error;
  }
};

export const getFunctionsBySousDirection = async (
  id: number,
): Promise<Fonction[]> => {
  const response = await api.get(`/sous-directions/${id}/fonctions`);
  return response.data;
};

export const getSousDirectionById = async (
  id: string | number,
): Promise<SousDirection> => {
  const response = await api.get(`/sous-directions/${id}`);
  return response.data;
};

export const createSousDirection = async (
  payload: Partial<SousDirection>,
): Promise<SousDirection> => {
  try {
    const response = await api.post("/sous-directions", payload);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur createSousDirection:", error);
    throw error;
  }
};

export const updateSousDirectionById = async (
  id: string | number,
  payload: Partial<SousDirection>,
): Promise<SousDirection> => {
  const response = await api.put(`/sous-directions/${id}`, payload);
  return response.data;
};

export const deleteSousDirectionById = async (
  id: string | number,
): Promise<void> => {
  await api.delete(`/sous-directions/${id}`);
};

export const getSousDirectionsByDirection = async (
  directionId: number,
): Promise<SousDirection[]> => {
  const response = await api.get(
    `/sous-directions/by-direction/${directionId}`,
  );
  return response.data;
};
