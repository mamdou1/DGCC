// hooks/useTypeDocuments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTypeDocuments,
  createTypeDocument,
  updateTypeDocument,
  deleteTypeDocument,
  addPiecesToTypeDocument,
} from "../api/typeDocument";
import { createMetaField, updateMetaField } from "../api/metaField";
import { getPieces } from "../api/pieces";
// ✅ IMPORTER LES NOUVELLES API
import { getDirections } from "../api/direction";
import { getSousDirections } from "../api/sousDirection";
import { getDivisions } from "../api/division";
import { getSections } from "../api/section";
import { getServices } from "../api/service";

import type {
  TypeDocument,
  Pieces,
  AddPiecesToTypeDocumentPayload,
  Direction,
  SousDirection,
  Division,
  Section,
  Service,
} from "../interfaces";

// =============================================
// 1. CLÉS DE CACHE
// =============================================
export const typeDocumentKeys = {
  all: ["typeDocuments"] as const,
  lists: () => [...typeDocumentKeys.all, "list"] as const,
  list: (filters: string) => [...typeDocumentKeys.lists(), filters] as const,
  details: () => [...typeDocumentKeys.all, "detail"] as const,
  detail: (id: number) => [...typeDocumentKeys.details(), id] as const,
};

export const piecesKeys = {
  all: ["pieces"] as const,
  lists: () => [...piecesKeys.all, "list"] as const,
};

export const entiteeKeys = {
  un: ["entiteeUn"] as const,
  deux: ["entiteeDeux"] as const,
  trois: ["entiteeTrois"] as const,
};

// ✅ NOUVELLES CLÉS
export const directionKeys = {
  all: ["directions"] as const,
  lists: () => [...directionKeys.all, "list"] as const,
};

export const sousDirectionKeys = {
  all: ["sousDirections"] as const,
  lists: () => [...sousDirectionKeys.all, "list"] as const,
};

export const divisionKeys = {
  all: ["divisions"] as const,
  lists: () => [...divisionKeys.all, "list"] as const,
};

export const sectionKeys = {
  all: ["sections"] as const,
  lists: () => [...sectionKeys.all, "list"] as const,
};

export const serviceKeys = {
  all: ["services"] as const,
  lists: () => [...serviceKeys.all, "list"] as const,
};

// =============================================
// 2. HOOKS DE LECTURE (QUERIES)
// =============================================

// Récupérer tous les types de documents
export const useTypeDocuments = () => {
  return useQuery({
    queryKey: typeDocumentKeys.lists(),
    queryFn: async () => {
      const res = await getTypeDocuments();
      const typesData = res.typeDocument || res;
      return Array.isArray(typesData) ? typesData : [];
    },
  });
};

// Récupérer toutes les pièces
export const usePieces = () => {
  return useQuery({
    queryKey: piecesKeys.lists(),
    queryFn: async () => {
      const res = await getPieces();
      return Array.isArray(res) ? res : [];
    },
  });
};

// ✅ NOUVEAU: Récupérer toutes les directions
export const useDirections = () => {
  return useQuery({
    queryKey: directionKeys.lists(),
    queryFn: async () => {
      const res = await getDirections();
      return Array.isArray(res) ? res : [];
    },
  });
};

// ✅ NOUVEAU: Récupérer toutes les sous-directions
export const useSousDirections = () => {
  return useQuery({
    queryKey: sousDirectionKeys.lists(),
    queryFn: async () => {
      const res = await getSousDirections();
      return Array.isArray(res) ? res : [];
    },
  });
};

// ✅ NOUVEAU: Récupérer toutes les divisions
export const useDivisions = () => {
  return useQuery({
    queryKey: divisionKeys.lists(),
    queryFn: async () => {
      const res = await getDivisions();
      return Array.isArray(res) ? res : [];
    },
  });
};

// ✅ NOUVEAU: Récupérer toutes les sections
export const useSections = () => {
  return useQuery({
    queryKey: sectionKeys.lists(),
    queryFn: async () => {
      const res = await getSections();
      return Array.isArray(res) ? res : [];
    },
  });
};

// ✅ NOUVEAU: Récupérer tous les services
export const useServices = () => {
  return useQuery({
    queryKey: serviceKeys.lists(),
    queryFn: async () => {
      const res = await getServices();
      return Array.isArray(res) ? res : [];
    },
  });
};

// Récupérer toutes les entités (anciennes)

// ✅ HOOK COMBINÉ POUR CHARGER TOUTES LES DONNÉES INITIALES (MIS À JOUR)
export const useInitialData = () => {
  const typesQuery = useTypeDocuments();
  const piecesQuery = usePieces();

  // ✅ NOUVELLES REQUÊTES
  const directionsQuery = useDirections();
  const sousDirectionsQuery = useSousDirections();
  const divisionsQuery = useDivisions();
  const sectionsQuery = useSections();
  const servicesQuery = useServices();

  const isLoading =
    typesQuery.isLoading ||
    piecesQuery.isLoading ||
    directionsQuery.isLoading ||
    sousDirectionsQuery.isLoading ||
    divisionsQuery.isLoading ||
    sectionsQuery.isLoading ||
    servicesQuery.isLoading;

  const error =
    typesQuery.error ||
    piecesQuery.error ||
    directionsQuery.error ||
    sousDirectionsQuery.error ||
    divisionsQuery.error ||
    sectionsQuery.error ||
    servicesQuery.error;

  // Créer les options d'entités pour le dropdown (avec les nouvelles entités)
  const optionsEntites = [
    { label: "Tous les profils", value: null },

    // ✅ NOUVELLES ENTITÉS
    ...(directionsQuery.data || []).map((x: Direction) => ({
      label: `🏢 Direction: ${x.libelle}`,
      value: `DIR-${x.id}`,
    })),
    ...(servicesQuery.data || []).map((x: Service) => ({
      label: `🛠️ Service: ${x.libelle}`,
      value: `SERV-${x.id}`,
    })),
    ...(sousDirectionsQuery.data || []).map((x: SousDirection) => ({
      label: `📁 Sous-direction: ${x.libelle}`,
      value: `SD-${x.id}`,
    })),
    ...(divisionsQuery.data || []).map((x: Division) => ({
      label: `📂 Division: ${x.libelle}`,
      value: `DIV-${x.id}`,
    })),
    ...(sectionsQuery.data || []).map((x: Section) => ({
      label: `📌 Section: ${x.libelle}`,
      value: `SEC-${x.id}`,
    })),
  ];

  return {
    types: typesQuery.data || [],
    pieces: piecesQuery.data || [],

    // ✅ NOUVELLES ENTITÉS
    directions: directionsQuery.data || [],
    sousDirections: sousDirectionsQuery.data || [],
    divisions: divisionsQuery.data || [],
    sections: sectionsQuery.data || [],
    services: servicesQuery.data || [],

    optionsEntites,
    isLoading,
    error,
    refetch: async () => {
      await Promise.all([
        typesQuery.refetch(),
        piecesQuery.refetch(),
        directionsQuery.refetch(),
        sousDirectionsQuery.refetch(),
        divisionsQuery.refetch(),
        sectionsQuery.refetch(),
        servicesQuery.refetch(),
      ]);
    },
  };
};

// =============================================
// 3. HOOKS D'ÉCRITURE (MUTATIONS)
// =============================================

// Créer un type de document
export const useCreateTypeDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newType: any) => createTypeDocument(newType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeDocumentKeys.lists() });
    },
  });
};

// Mettre à jour un type de document
export const useUpdateTypeDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTypeDocument(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: typeDocumentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: typeDocumentKeys.detail(parseInt(variables.id)),
      });
    },
  });
};

// Supprimer un type de document
export const useDeleteTypeDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTypeDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeDocumentKeys.lists() });
    },
  });
};

// Ajouter des pièces à un type de document
export const useAddPiecesToTypeDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      typeId,
      payload,
    }: {
      typeId: string;
      payload: AddPiecesToTypeDocumentPayload;
    }) => addPiecesToTypeDocument(typeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeDocumentKeys.lists() });
    },
  });
};

// Créer un champ de métadonnée
export const useCreateMetaField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ typeId, field }: { typeId: number; field: any }) =>
      createMetaField(String(typeId), field),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeDocumentKeys.lists() });
    },
  });
};

// Mettre à jour un champ de métadonnée
export const useUpdateMetaField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, field }: { id: number; field: any }) =>
      updateMetaField(String(id), field),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeDocumentKeys.lists() });
    },
  });
};

// Mutation pour affectation multiple
export const useMultipleAffectation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      typeIds,
      structureData,
    }: {
      typeIds: string[];
      structureData: any;
    }) => {
      await Promise.all(
        typeIds.map((id) => updateTypeDocument(id, structureData)),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeDocumentKeys.lists() });
    },
  });
};
