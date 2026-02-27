// hooks/useServices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  getServiceById,
  createService,
  updateServiceById,
  deleteServiceById,
  getServicesByDirection,
} from "../api/service";
import type { Service } from "../interfaces";

export const serviceKeys = {
  all: ["services"] as const,
  lists: () => [...serviceKeys.all, "list"] as const,
  list: (filters: string) => [...serviceKeys.lists(), filters] as const,
  details: () => [...serviceKeys.all, "detail"] as const,
  detail: (id: number) => [...serviceKeys.details(), id] as const,
  byDirection: (directionId: number) =>
    [...serviceKeys.all, "byDirection", directionId] as const,
};

// Récupérer tous les services
export const useServices = () => {
  return useQuery({
    queryKey: serviceKeys.lists(),
    queryFn: async () => {
      const data = await getServices();
      return Array.isArray(data) ? data : [];
    },
  });
};

// Récupérer un service par ID
export const useServiceById = (id: number) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => getServiceById(id),
    enabled: !!id,
  });
};

// Récupérer les services d'une direction
export const useServicesByDirection = (directionId: number) => {
  return useQuery({
    queryKey: [...serviceKeys.byDirection(directionId)],
    queryFn: () => getServicesByDirection(directionId),
    enabled: !!directionId,
  });
};

// Créer un service
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newService: Partial<Service>) => createService(newService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};

// Mettre à jour un service
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
      updateServiceById(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: serviceKeys.detail(Number(id)),
      });
    },
  });
};

// Supprimer un service
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteServiceById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};
