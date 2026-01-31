import api from "./axios";
import type { Service, Fonction } from "../interfaces";

const API_URL = "/services";

export const getAllServices = async (): Promise<{ services: Service[] }> => {
  try {
    const response = await api.get(`${API_URL}/`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getServices:", error);
    throw error;
  }
};

export const createService = async (
  payload: Partial<Service>,
): Promise<Service> => {
  const response = await api.post(`${API_URL}/`, payload);
  return response.data;
};

export const getFunctionsByService = async (
  id: number,
): Promise<Fonction[]> => {
  const response = await api.get(`${API_URL}/${id}/fonctions`);
  return response.data;
};

export const updateServiceById = async (
  id: number,
  payload: Partial<Service>,
): Promise<Service> => {
  const response = await api.put(`${API_URL}/${id}`, payload);
  return response.data;
};

export const deleteServiceById = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
