// hooks/useSousDirections.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSousDirections,
  getSousDirectionById,
  createSousDirection,
  updateSousDirectionById,
  deleteSousDirectionById,
} from "../api/sousDirection";
import { getDivisionsBySousDirection } from "../api/division";
import type { SousDirection } from "../interfaces";
import { getSousDirectionsByDirection } from "../api/sousDirection";

export const sousDirectionKeys = {
  all: ["sousDirections"] as const,
  lists: () => [...sousDirectionKeys.all, "list"] as const,
  list: (filters: string) => [...sousDirectionKeys.lists(), filters] as const,
  details: () => [...sousDirectionKeys.all, "detail"] as const,
  detail: (id: number) => [...sousDirectionKeys.details(), id] as const,
  divisions: (id: number) =>
    [...sousDirectionKeys.detail(id), "divisions"] as const,
  byDirection: (directionId: number) =>
    [...sousDirectionKeys.all, "byDirection", directionId] as const,
};

// Récupérer toutes les sous-directions
export const useSousDirections = () => {
  return useQuery({
    queryKey: sousDirectionKeys.lists(),
    queryFn: async () => {
      const data = await getSousDirections();
      return Array.isArray(data) ? data : [];
    },
  });
};

// Récupérer une sous-direction par ID
export const useSousDirectionById = (id: number) => {
  return useQuery({
    queryKey: sousDirectionKeys.detail(id),
    queryFn: () => getSousDirectionById(id),
    enabled: !!id,
  });
};

// Récupérer les divisions d'une sous-direction
// hooks/useSousDirections.ts
export const useSousDirectionsByDirection = (directionId: number) => {
  return useQuery({
    queryKey: [...sousDirectionKeys.byDirection(directionId)],
    queryFn: () => getSousDirectionsByDirection(directionId),
    enabled: !!directionId,
  });
};

// Créer une sous-direction
export const useCreateSousDirection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSousDirection: Partial<SousDirection>) =>
      createSousDirection(newSousDirection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sousDirectionKeys.lists() });
    },
  });
};

// Mettre à jour une sous-direction
export const useUpdateSousDirection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SousDirection> }) =>
      updateSousDirectionById(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: sousDirectionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: sousDirectionKeys.detail(Number(id)),
      });
    },
  });
};

// Supprimer une sous-direction
export const useDeleteSousDirection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSousDirectionById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sousDirectionKeys.lists() });
    },
  });
};
