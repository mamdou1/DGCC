// hooks/useSections.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSections,
  getSectionById,
  createSection,
  updateSectionById,
  deleteSectionById,
} from "../api/section";
import type { Section } from "../interfaces";

export const sectionKeys = {
  all: ["sections"] as const,
  lists: () => [...sectionKeys.all, "list"] as const,
  list: (filters: string) => [...sectionKeys.lists(), filters] as const,
  details: () => [...sectionKeys.all, "detail"] as const,
  detail: (id: number) => [...sectionKeys.details(), id] as const,
};

// Récupérer toutes les sections
export const useSections = () => {
  return useQuery({
    queryKey: sectionKeys.lists(),
    queryFn: async () => {
      const data = await getSections();
      return Array.isArray(data) ? data : [];
    },
  });
};

// Récupérer une section par ID
export const useSectionById = (id: number) => {
  return useQuery({
    queryKey: sectionKeys.detail(id),
    queryFn: () => getSectionById(id),
    enabled: !!id,
  });
};

// Créer une section
export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSection: Partial<Section>) => createSection(newSection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() });
    },
  });
};

// Mettre à jour une section
export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Section> }) =>
      updateSectionById(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: sectionKeys.detail(Number(id)),
      });
    },
  });
};

// Supprimer une section
export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSectionById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() });
    },
  });
};
