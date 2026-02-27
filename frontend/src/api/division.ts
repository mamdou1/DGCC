// api/division.ts
import api from "./axios";
import type { Division, Fonction } from "../interfaces";

export const getDivisions = async (): Promise<Division[]> => {
  try {
    console.log("🟢 Appel API: GET /api/divisions");
    const response = await api.get("/divisions");
    console.log("✅ Divisions reçues:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getDivisions:", error);
    throw error;
  }
};

export const getFunctionsByDivision = async (
  id: number,
): Promise<Fonction[]> => {
  const response = await api.get(`/divisions/${id}/fonctions`);
  return response.data;
};

export const getDivisionById = async (
  id: string | number,
): Promise<Division> => {
  const response = await api.get(`/divisions/${id}`);
  return response.data;
};

export const createDivision = async (
  payload: Partial<Division>,
): Promise<Division> => {
  try {
    const response = await api.post("/divisions", payload);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur createDivision:", error);
    throw error;
  }
};

export const updateDivisionById = async (
  id: string | number,
  payload: Partial<Division>,
): Promise<Division> => {
  const response = await api.put(`/divisions/${id}`, payload);
  return response.data;
};

export const deleteDivisionById = async (
  id: string | number,
): Promise<void> => {
  await api.delete(`/divisions/${id}`);
};

export const getDivisionsBySousDirection = async (
  sousDirectionId: number,
): Promise<Division[]> => {
  const response = await api.get(
    `/divisions/by-sous-direction/${sousDirectionId}`,
  );
  return response.data;
};
