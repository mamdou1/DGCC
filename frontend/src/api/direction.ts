// api/direction.ts
import api from "./axios";
import type { Direction, Fonction } from "../interfaces";

export const getDirections = async (): Promise<Direction[]> => {
  try {
    console.log("🟢 Appel API: GET /api/directions");
    const response = await api.get("/directions");
    console.log("✅ Directions reçues:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getDirections:", error);
    throw error;
  }
};

export const getDirectionById = async (
  id: string | number,
): Promise<Direction> => {
  const response = await api.get(`/directions/${id}`);
  return response.data;
};

export const getFunctionsByDirection = async (
  id: number,
): Promise<Fonction[]> => {
  const response = await api.get(`/directions/${id}/fonctions`);
  return response.data;
};

export const createDirection = async (
  payload: Partial<Direction>,
): Promise<Direction> => {
  try {
    const response = await api.post("/directions", payload);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur createDirection:", error);
    throw error;
  }
};

export const updateDirectionById = async (
  id: string | number,
  payload: Partial<Direction>,
): Promise<Direction> => {
  const response = await api.put(`/directions/${id}`, payload);
  return response.data;
};

export const deleteDirectionById = async (
  id: string | number,
): Promise<void> => {
  await api.delete(`/directions/${id}`);
};
