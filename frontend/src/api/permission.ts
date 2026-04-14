import api from "./axios";
import { Permission } from "../interfaces";

export const getAllPermissions = () => api.get("/permissions");

// export const getDroitPermission = (droitId: number) =>
//   api.get(`/droitPermission/${droitId}/permissions`);

export const getPermissionsByDroitId = async (droitId: number) => {
  const response = await api.get(`/droits/${droitId}`);
  return response.data.Permissions || []; // Retourne directement les permissions
};

export const getPermissionById = async (
  id: string | number,
): Promise<Permissions> => {
  const response = await api.get(`/permissions/${id}`);
  return response.data;
};

export const updateDroitPermissions = async (
  droitId: number,
  permissionIds: number[],
) => {
  const response = await api.put(`/droitPermission/${droitId}/permissions`, {
    permissions: permissionIds,
  });
  return response.data;
};
