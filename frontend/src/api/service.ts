// api/service.ts
import api from "./axios";
import type { Fonction, Service } from "../interfaces";

export const getServices = async (): Promise<Service[]> => {
  try {
    console.log("🟢 Appel API: GET /api/services");
    const response = await api.get("/services");
    console.log("✅ Services reçus:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getServices:", error);
    throw error;
  }
};

export const getFunctionsByService = async (
  id: number,
): Promise<Fonction[]> => {
  const response = await api.get(`/services/${id}/fonctions`);
  return response.data;
};

export const getServiceById = async (id: string | number): Promise<Service> => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

export const createService = async (
  payload: Partial<Service>,
): Promise<Service> => {
  try {
    const response = await api.post("/services", payload);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur createService:", error);
    throw error;
  }
};

export const updateServiceById = async (
  id: string | number,
  payload: Partial<Service>,
): Promise<Service> => {
  const response = await api.put(`/services/${id}`, payload);
  return response.data;
};

export const deleteServiceById = async (id: string | number): Promise<void> => {
  await api.delete(`/services/${id}`);
};

export const getServicesByDirection = async (
  directionId: number,
): Promise<Service[]> => {
  const response = await api.get(`/services/by-direction/${directionId}`);
  return response.data;
};
