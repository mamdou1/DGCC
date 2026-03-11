import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFonctions,
  getFonctionById,
  createFonction,
  updateFonctionById,
  deleteFonctionById,
} from "../api/fonction";

// ✅ NOUVEAUX IMPORTS pour les entités
import { getDirections, getFunctionsByDirection } from "../api/direction";
import {
  getSousDirections,
  getFunctionsBySousDirection,
} from "../api/sousDirection";
import { getDivisions, getFunctionsByDivision } from "../api/division";
import { getSections, getFunctionsBySection } from "../api/section";
import { getFunctionsByService, getServices } from "../api/service";

import type {
  Fonction,
  Direction,
  SousDirection,
  Division,
  Section,
  Service,
} from "../interfaces";

// =============================================
// 1. CLÉS DE CACHE (MISES À JOUR)
// =============================================
export const fonctionKeys = {
  all: ["fonctions"] as const,
  lists: () => [...fonctionKeys.all, "list"] as const,
  list: (filters: string) => [...fonctionKeys.lists(), filters] as const,
  details: () => [...fonctionKeys.all, "detail"] as const,
  detail: (id: number) => [...fonctionKeys.details(), id] as const,
  byDirection: (directionId: number) =>
    [...fonctionKeys.all, "byDirection", directionId] as const,
  bySousDirection: (sousDirectionId: number) =>
    [...fonctionKeys.all, "bySousDirection", sousDirectionId] as const,
  byDivision: (divisionId: number) =>
    [...fonctionKeys.all, "byDivision", divisionId] as const,
  bySection: (sectionId: number) =>
    [...fonctionKeys.all, "bySection", sectionId] as const,
  byService: (serviceId: number) =>
    [...fonctionKeys.all, "byService", serviceId] as const,
};

// ✅ NOUVELLES CLÉS POUR LES ENTITÉS
export const entiteeKeys = {
  directions: ["directions"] as const,
  sousDirections: ["sousDirections"] as const,
  divisions: ["divisions"] as const,
  sections: ["sections"] as const,
  services: ["services"] as const,
};

// =============================================
// 2. HOOKS DE LECTURE (QUERIES)
// =============================================

// Récupérer toutes les fonctions
export const useFonctions = () => {
  return useQuery({
    queryKey: fonctionKeys.lists(),
    queryFn: async () => {
      const res = await getFonctions();
      console.log("📦 Données reçues de l'API:", res);
      if (Array.isArray(res)) {
        return res;
      }

      if (res && Array.isArray(res.fonctions)) {
        return res.fonctions;
      }

      return [];
    },
  });
};

// Récupérer une fonction par ID
export const useFonctionById = (id: number) => {
  return useQuery({
    queryKey: fonctionKeys.detail(id),
    queryFn: () => getFonctionById(id),
    enabled: !!id,
  });
};

// ✅ Récupérer les fonctions par direction
export const useFonctionsByDirection = (directionId: number) => {
  return useQuery({
    queryKey: fonctionKeys.byDirection(directionId),
    queryFn: () => getFunctionsByDirection(directionId),
    enabled: !!directionId,
  });
};

// ✅ Récupérer les fonctions par sous-direction
export const useFonctionsBySousDirection = (sousDirectionId: number) => {
  return useQuery({
    queryKey: fonctionKeys.bySousDirection(sousDirectionId),
    queryFn: () => getFunctionsBySousDirection(sousDirectionId),
    enabled: !!sousDirectionId,
  });
};

// ✅ Récupérer les fonctions par division
export const useFonctionsByDivision = (divisionId: number) => {
  return useQuery({
    queryKey: fonctionKeys.byDivision(divisionId),
    queryFn: () => getFunctionsByDivision(divisionId),
    enabled: !!divisionId,
  });
};

// ✅ Récupérer les fonctions par section
export const useFonctionsBySection = (sectionId: number) => {
  return useQuery({
    queryKey: fonctionKeys.bySection(sectionId),
    queryFn: () => getFunctionsBySection(sectionId),
    enabled: !!sectionId,
  });
};

// ✅ Récupérer les fonctions par service
export const useFonctionsByService = (serviceId: number) => {
  return useQuery({
    queryKey: fonctionKeys.byService(serviceId),
    queryFn: () => getFunctionsByService(serviceId),
    enabled: !!serviceId,
  });
};

// ✅ Récupérer toutes les entités (nouvelles versions)
export const useEntitees = () => {
  const queryDirections = useQuery({
    queryKey: entiteeKeys.directions,
    queryFn: async () => {
      const res = await getDirections();
      return Array.isArray(res) ? res : [];
    },
  });

  const querySousDirections = useQuery({
    queryKey: entiteeKeys.sousDirections,
    queryFn: async () => {
      const res = await getSousDirections();
      return Array.isArray(res) ? res : [];
    },
  });

  const queryDivisions = useQuery({
    queryKey: entiteeKeys.divisions,
    queryFn: async () => {
      const res = await getDivisions();
      return Array.isArray(res) ? res : [];
    },
  });

  const querySections = useQuery({
    queryKey: entiteeKeys.sections,
    queryFn: async () => {
      const res = await getSections();
      return Array.isArray(res) ? res : [];
    },
  });

  const queryServices = useQuery({
    queryKey: entiteeKeys.services,
    queryFn: async () => {
      const res = await getServices();
      return Array.isArray(res) ? res : [];
    },
  });

  const isLoading =
    queryDirections.isLoading ||
    querySousDirections.isLoading ||
    queryDivisions.isLoading ||
    querySections.isLoading ||
    queryServices.isLoading;

  const error =
    queryDirections.error ||
    querySousDirections.error ||
    queryDivisions.error ||
    querySections.error ||
    queryServices.error;

  return {
    directions: queryDirections.data || [],
    sousDirections: querySousDirections.data || [],
    divisions: queryDivisions.data || [],
    sections: querySections.data || [],
    services: queryServices.data || [],
    isLoading,
    error,
    refetch: async () => {
      await Promise.all([
        queryDirections.refetch(),
        querySousDirections.refetch(),
        queryDivisions.refetch(),
        querySections.refetch(),
        queryServices.refetch(),
      ]);
    },
  };
};

// ✅ Hook combiné pour charger toutes les données initiales (MIS À JOUR)
export const useInitialData = () => {
  const fonctionsQuery = useFonctions();
  const entitees = useEntitees();

  const isLoading = fonctionsQuery.isLoading || entitees.isLoading;
  const error = fonctionsQuery.error || entitees.error;

  return {
    fonctions: fonctionsQuery.data || [],
    directions: entitees.directions,
    sousDirections: entitees.sousDirections,
    divisions: entitees.divisions,
    sections: entitees.sections,
    services: entitees.services,
    isLoading,
    error,
    refetch: async () => {
      await fonctionsQuery.refetch();
      await entitees.refetch();
    },
  };
};

// =============================================
// 3. HOOKS D'ÉCRITURE (MUTATIONS)
// =============================================

// Créer une fonction
export const useCreateFonction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFonction: Partial<Fonction>) => createFonction(newFonction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fonctionKeys.lists() });
    },
  });
};

// Mettre à jour une fonction
export const useUpdateFonction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Fonction> }) =>
      updateFonctionById(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: fonctionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: fonctionKeys.detail(variables.id),
      });

      // Invalider aussi les requêtes par entité
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return (
            queryKey === "byDirection" ||
            queryKey === "bySousDirection" ||
            queryKey === "byDivision" ||
            queryKey === "bySection" ||
            queryKey === "byService"
          );
        },
      });
    },
  });
};

// Supprimer une fonction
export const useDeleteFonction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFonctionById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fonctionKeys.lists() });

      // Invalider aussi les requêtes par entité
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return (
            queryKey === "byDirection" ||
            queryKey === "bySousDirection" ||
            queryKey === "byDivision" ||
            queryKey === "bySection" ||
            queryKey === "byService"
          );
        },
      });
    },
  });
};
