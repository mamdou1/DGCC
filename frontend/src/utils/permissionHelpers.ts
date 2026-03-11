// utils/permissionHelpers.ts
import { Permission } from "../interfaces";
import {
  getPermissionLabels,
  PermissionAction,
  PermissionLabels, // ✅ Importer le type
} from "./permissionLabels";

// ✅ Plus besoin de DEFAULT_TITLES, getPermissionLabels() est maintenant sans paramètre
const PERMISSION_LABELS: PermissionLabels = getPermissionLabels();

export interface UIPermission extends Permission {
  label: string;
}

export interface UIPermissionGroup {
  resource: string;
  permissions: UIPermission[];
}

export const groupPermissionsByResource = (
  permissions: Permission[],
): UIPermissionGroup[] => {
  const map = new Map<string, UIPermission[]>();

  permissions.forEach((perm) => {
    const resourceLabels = PERMISSION_LABELS[perm.resource];
    const actionLabels = resourceLabels?.[perm.action as PermissionAction];

    // ✅ Fallback amélioré avec une meilleure lisibilité
    let label = actionLabels;

    // Si aucun label n'est trouvé, générer un label par défaut
    if (!label) {
      const actionMap: Record<string, string> = {
        create: "Créer",
        read: "Consulter",
        update: "Modifier",
        delete: "Supprimer",
        access: "Accéder à",
      };

      const resourceMap: Record<string, string> = {
        exercice: "exercice",
        agent: "agent",
        pieces: "pièce",
        statistique: "statistique",
        droit: "droit",
        fonction: "fonction",
        document: "document",
        documentType: "type de document",
        historique: "historique",
        salle: "salle",
        rayon: "rayon",
        box: "box",
        trave: "travée",
        site: "site",
        direction: "direction",
        sousDirection: "sous-direction",
        division: "division",
        section: "section",
        service: "service",
      };

      const actionFr = actionMap[perm.action] || perm.action;
      const resourceFr = resourceMap[perm.resource] || perm.resource;
      label = `${actionFr} ${resourceFr}`;
    }

    if (!map.has(perm.resource)) {
      map.set(perm.resource, []);
    }

    map.get(perm.resource)!.push({
      ...perm,
      label,
    });
  });

  // Trier les permissions par action pour un affichage cohérent
  const sortOrder: Record<PermissionAction, number> = {
    access: 1,
    create: 2,
    read: 3,
    update: 4,
    delete: 5,
  };

  return Array.from(map.entries())
    .map(([resource, permissions]) => ({
      resource,
      permissions: permissions.sort((a, b) => {
        const orderA = sortOrder[a.action as PermissionAction] || 99;
        const orderB = sortOrder[b.action as PermissionAction] || 99;
        return orderA - orderB;
      }),
    }))
    .sort((a, b) => a.resource.localeCompare(b.resource)); // Trier les ressources par ordre alphabétique
};

export const actionBadgeColor: Record<PermissionAction, string> = {
  create: "bg-green-100 text-green-700 border border-green-200",
  read: "bg-blue-100 text-blue-700 border border-blue-200",
  update: "bg-orange-100 text-orange-700 border border-orange-200",
  delete: "bg-red-100 text-red-700 border border-red-200",
  access: "bg-purple-100 text-purple-700 border border-purple-200",
};

// Fonction utilitaire pour obtenir la couleur d'une action spécifique
export const getActionColor = (action: string): string => {
  return (
    actionBadgeColor[action as PermissionAction] ||
    "bg-gray-100 text-gray-700 border border-gray-200"
  );
};
