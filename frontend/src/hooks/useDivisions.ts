// hooks/useDivisions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDivisions,
  getDivisionById,
  createDivision,
  updateDivisionById,
  deleteDivisionById,
} from "../api/division";
import { getSectionsByDivision } from "../api/section";
import type { Division } from "../interfaces";
import { getSousDirectionsByDirection } from "../api/sousDirection";

export const divisionKeys = {
  all: ["divisions"] as const,
  lists: () => [...divisionKeys.all, "list"] as const,
  list: (filters: string) => [...divisionKeys.lists(), filters] as const,
  details: () => [...divisionKeys.all, "detail"] as const,
  detail: (id: number) => [...divisionKeys.details(), id] as const,
  sections: (id: number) => [...divisionKeys.detail(id), "sections"] as const,
  divisions: (id: number) => [...divisionKeys.detail(id), "divisions"] as const,
  bySousDirection: (directionId: number) =>
    [...divisionKeys.all, "byDirection", directionId] as const,
};

// Récupérer toutes les divisions
export const useDivisions = () => {
  return useQuery({
    queryKey: divisionKeys.lists(),
    queryFn: async () => {
      const data = await getDivisions();
      return Array.isArray(data) ? data : [];
    },
  });
};

// Récupérer une division par ID
export const useDivisionById = (id: number) => {
  return useQuery({
    queryKey: divisionKeys.detail(id),
    queryFn: () => getDivisionById(id),
    enabled: !!id,
  });
};

// Récupérer les sections d'une division
export const useSectionsByDivision = (divisionId: number) => {
  return useQuery({
    queryKey: divisionKeys.sections(divisionId),
    queryFn: () => getSectionsByDivision(divisionId),
    enabled: !!divisionId,
  });
};

export const useDivisionsBySousDirection = (sousDirectionId: number) => {
  return useQuery({
    queryKey: [...divisionKeys.bySousDirection(sousDirectionId)], // ← Correction: divisionKeys au lieu de divisions
    queryFn: () => getSousDirectionsByDirection(sousDirectionId),
    enabled: !!sousDirectionId,
  });
};

// Créer une division
export const useCreateDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newDivision: Partial<Division>) => createDivision(newDivision),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: divisionKeys.lists() });
    },
  });
};

// Mettre à jour une division
export const useUpdateDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Division> }) =>
      updateDivisionById(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: divisionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: divisionKeys.detail(Number(id)),
      });
    },
  });
};

// Supprimer une division
export const useDeleteDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDivisionById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: divisionKeys.lists() });
    },
  });
};
