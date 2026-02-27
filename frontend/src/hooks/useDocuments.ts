// hooks/useDocuments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../api/document";
import { getTypeDocuments } from "../api/typeDocument";
import { getMetaById } from "../api/metaField";
import { getAllEntiteeUn } from "../api/entiteeUn";
import { getAllEntiteeDeux } from "../api/entiteeDeux";
import { getAllEntiteeTrois } from "../api/entiteeTrois";

// ✅ IMPORTER LES NOUVELLES API
import { getDirections } from "../api/direction";
import { getSousDirections } from "../api/sousDirection";
import { getDivisions } from "../api/division";
import { getSections } from "../api/section";
import { getServices } from "../api/service";

import type { Document, TypeDocument } from "../interfaces";

// =============================================
// 1. CLÉS DE CACHE
// =============================================
export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: (filters: any) => [...documentKeys.lists(), filters] as const,
  byType: (typeId: number) => [...documentKeys.all, "byType", typeId] as const,
  details: () => [...documentKeys.all, "detail"] as const,
  detail: (id: number) => [...documentKeys.details(), id] as const,
};

export const typeDocumentKeys = {
  all: ["typeDocuments"] as const,
  lists: () => [...typeDocumentKeys.all, "list"] as const,
};

export const metaFieldKeys = {
  byType: (typeId: number) => ["metaFields", "byType", typeId] as const,
};

export const entiteeKeys = {
  un: ["entiteeUn"] as const,
  deux: ["entiteeDeux"] as const,
  trois: ["entiteeTrois"] as const,
  directions: ["directions"] as const,
  sousDirections: ["sousDirections"] as const,
  divisions: ["divisions"] as const,
  sections: ["sections"] as const,
};

// =============================================
// 2. HOOKS DE LECTURE (QUERIES)
// =============================================

// Récupérer tous les documents
export const useDocuments = () => {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: async () => {
      const data = await getDocuments();
      return Array.isArray(data) ? data : [];
    },
  });
};

// Récupérer les documents d'un type spécifique
export const useDocumentsByType = (typeId: number | null) => {
  return useQuery({
    queryKey: documentKeys.byType(typeId!),
    queryFn: async () => {
      const data = await getDocuments();
      return data.filter((d: any) => d.type_document_id === typeId);
    },
    enabled: !!typeId,
  });
};

// Récupérer tous les types de documents
export const useTypeDocuments = () => {
  return useQuery({
    queryKey: typeDocumentKeys.lists(),
    queryFn: async () => {
      const res = await getTypeDocuments();
      return res.typeDocument || [];
    },
  });
};

// Récupérer les métadonnées d'un type
export const useMetaFieldsByType = (typeId: number | null) => {
  return useQuery({
    queryKey: metaFieldKeys.byType(typeId!),
    queryFn: async () => {
      if (!typeId) return [];
      const data = await getMetaById(String(typeId));
      return Array.isArray(data) ? data : [];
    },
    enabled: !!typeId,
  });
};

// Récupérer toutes les entités (anciennes)
export const useEntitees = () => {
  const queryUn = useQuery({
    queryKey: entiteeKeys.un,
    queryFn: async () => {
      const res = await getAllEntiteeUn();
      return Array.isArray(res) ? res : [];
    },
  });

  const queryDeux = useQuery({
    queryKey: entiteeKeys.deux,
    queryFn: async () => {
      const res = await getAllEntiteeDeux();
      return Array.isArray(res) ? res : [];
    },
  });

  const queryTrois = useQuery({
    queryKey: entiteeKeys.trois,
    queryFn: async () => {
      const res = await getAllEntiteeTrois();
      return Array.isArray(res) ? res : [];
    },
  });

  const isLoading =
    queryUn.isLoading || queryDeux.isLoading || queryTrois.isLoading;
  const error = queryUn.error || queryDeux.error || queryTrois.error;

  const allEntitees = [
    ...(queryUn.data || []).map((e: any) => ({ ...e, type: "un" as const })),
    ...(queryDeux.data || []).map((e: any) => ({
      ...e,
      type: "deux" as const,
    })),
    ...(queryTrois.data || []).map((e: any) => ({
      ...e,
      type: "trois" as const,
    })),
  ];

  return {
    entiteeUn: queryUn.data || [],
    entiteeDeux: queryDeux.data || [],
    entiteeTrois: queryTrois.data || [],
    allEntitees,
    isLoading,
    error,
    refetch: async () => {
      await Promise.all([
        queryUn.refetch(),
        queryDeux.refetch(),
        queryTrois.refetch(),
      ]);
    },
  };
};

// ✅ NOUVEAU HOOK : Récupérer toutes les nouvelles entités
export const useNouvellesEntitees = () => {
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

  const isLoading =
    queryDirections.isLoading ||
    querySousDirections.isLoading ||
    queryDivisions.isLoading ||
    querySections.isLoading;

  const error =
    queryDirections.error ||
    querySousDirections.error ||
    queryDivisions.error ||
    querySections.error;

  return {
    directions: queryDirections.data || [],
    sousDirections: querySousDirections.data || [],
    divisions: queryDivisions.data || [],
    sections: querySections.data || [],
    isLoading,
    error,
    refetch: async () => {
      await Promise.all([
        queryDirections.refetch(),
        querySousDirections.refetch(),
        queryDivisions.refetch(),
        querySections.refetch(),
      ]);
    },
  };
};

// Hook combiné pour charger toutes les données initiales (MIS À JOUR)
export const useInitialData = () => {
  const documentsQuery = useDocuments();
  const typesQuery = useTypeDocuments();
  const entitees = useEntitees();
  const nouvellesEntitees = useNouvellesEntitees(); // ✅ AJOUT

  const isLoading =
    documentsQuery.isLoading ||
    typesQuery.isLoading ||
    entitees.isLoading ||
    nouvellesEntitees.isLoading;

  const error =
    documentsQuery.error ||
    typesQuery.error ||
    entitees.error ||
    nouvellesEntitees.error;

  return {
    documents: documentsQuery.data || [],
    types: typesQuery.data || [],
    entitees: entitees.allEntitees,
    entiteeUn: entitees.entiteeUn,
    entiteeDeux: entitees.entiteeDeux,
    entiteeTrois: entitees.entiteeTrois,
    // ✅ NOUVELLES ENTITÉS
    directions: nouvellesEntitees.directions,
    sousDirections: nouvellesEntitees.sousDirections,
    divisions: nouvellesEntitees.divisions,
    sections: nouvellesEntitees.sections,
    isLoading,
    error,
    refetch: async () => {
      await documentsQuery.refetch();
      await typesQuery.refetch();
      await entitees.refetch();
      await nouvellesEntitees.refetch();
    },
  };
};

// =============================================
// 3. HOOKS D'ÉCRITURE (MUTATIONS)
// =============================================

// Créer un document
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newDoc: any) => createDocument(newDoc),
    onSuccess: (savedDoc) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      if (savedDoc?.type_document_id) {
        queryClient.invalidateQueries({
          queryKey: documentKeys.byType(savedDoc.type_document_id),
        });
      }
    },
  });
};

// Mettre à jour un document
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateDocument(id, data),
    onSuccess: (updatedDoc, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(parseInt(variables.id)),
      });
      if (updatedDoc?.type_document_id) {
        queryClient.invalidateQueries({
          queryKey: documentKeys.byType(updatedDoc.type_document_id),
        });
      }
    },
  });
};

// Supprimer un document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};
