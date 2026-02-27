// api/section.ts
import api from "./axios";
import type { Fonction, Section } from "../interfaces";

export const getSections = async (): Promise<Section[]> => {
  try {
    console.log("🟢 Appel API: GET /api/sections");
    const response = await api.get("/sections");
    console.log("✅ Sections reçues:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getSections:", error);
    throw error;
  }
};

export const getFunctionsBySection = async (
  id: number,
): Promise<Fonction[]> => {
  const response = await api.get(`/sections/${id}/fonctions`);
  return response.data;
};

export const getSectionById = async (id: string | number): Promise<Section> => {
  const response = await api.get(`/sections/${id}`);
  return response.data;
};

export const createSection = async (
  payload: Partial<Section>,
): Promise<Section> => {
  try {
    const response = await api.post("/sections", payload);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur createSection:", error);
    throw error;
  }
};

export const updateSectionById = async (
  id: string | number,
  payload: Partial<Section>,
): Promise<Section> => {
  const response = await api.put(`/sections/${id}`, payload);
  return response.data;
};

export const deleteSectionById = async (id: string | number): Promise<void> => {
  await api.delete(`/sections/${id}`);
};

export const getSectionsByDivision = async (
  divisionId: number,
): Promise<Section[]> => {
  const response = await api.get(`/sections/by-division/${divisionId}`);
  return response.data;
};
