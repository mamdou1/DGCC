import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../components/layout/Layoutt";
import DocumentTypeDetails from "./DocumentTypeDetails";
import DocumentTypeMetaForm from "./DocumentTypeMetaForm";
import { confirmDialog } from "primereact/confirmdialog";
import DocumentTypeAffectationForm from "./DocumentTypeAffectationForm";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  Plus,
  Pencil,
  Trash2,
  Database,
  Settings,
  Search,
  Layers,
  FilePlus,
  SplinePointer,
  XCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Building2,
  Briefcase,
  Split,
  TableOfContents,
  GitMerge,
} from "lucide-react";

// ✅ IMPORTER LES NOUVEAUX HOOKS
import {
  useInitialData,
  useCreateTypeDocument,
  useUpdateTypeDocument,
  useDeleteTypeDocument,
  useAddPiecesToTypeDocument,
  useCreateMetaField,
  useUpdateMetaField,
  useMultipleAffectation,
} from "../../hooks/useTypeDocuments";

import {
  TypeDocument,
  AddPiecesToTypeDocumentPayload,
  Pieces,
  User,
} from "../../interfaces";
import { Dropdown } from "primereact/dropdown";
import TypeDocumentAjoutPieces from "./TypeDocumentAjoutPieces";
import DocumentTypeAffectAndForm from "./DocumentTypeAffectAndForm";
import { useAuth } from "../../context/AuthContext";

export default function DocumentTypeEntitee() {
  const { user } = useAuth();
  const toast = useRef<Toast>(null);

  // ✅ ÉTAT 1: Remplacer les useState multiples par useInitialData
  const {
    types = [],
    pieces = [],
    // ✅ NOUVELLES ENTITÉS
    directions = [],
    sousDirections = [],
    divisions = [],
    sections = [],
    services = [],
    optionsEntites = [],
    isLoading,
    error,
    refetch,
  } = useInitialData();

  // ✅ ÉTAT 2: Remplacer les mutations
  const createMutation = useCreateTypeDocument();
  const updateMutation = useUpdateTypeDocument();
  const deleteMutation = useDeleteTypeDocument();
  const addPiecesMutation = useAddPiecesToTypeDocument();
  const createMetaMutation = useCreateMetaField();
  const updateMetaMutation = useUpdateMetaField();
  const multipleAffectationMutation = useMultipleAffectation();

  // États UI
  const [selected, setSelected] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [affectationFormVisible, setAffectationFormVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [metaVisible, setMetaVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [formPiecesVisible, setFormPiecesVisible] = useState(false);
  const [selectedTypeDoc, setSelectedTypeDoc] = useState<string | null>(null);
  const [selectedAccordionStructure, setSelectedAccordionStructure] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [expandedStructure, setExpandedStructure] = useState<string | null>(
    null,
  );

  const [selectedAccordionEntity, setSelectedAccordionEntity] = useState<{
    label: string;
    value: string;
    type: "direction" | "service" | "sousDirection" | "division" | "section";
  } | null>(null);

  // ✅ Fonction pour vérifier si l'utilisateur est admin
  const isUserAdmin = (user: User | null): boolean => {
    if (!user) return false;
    const droitLibelle =
      typeof user.droit === "object" ? user.droit?.libelle : user.droit;
    if (!droitLibelle) return false;
    const libelle = droitLibelle.toString().toLowerCase();
    return (
      libelle.includes("admin") ||
      libelle.includes("administrateur") ||
      libelle === "admin" ||
      libelle === "Administrateur"
    );
  };

  // ✅ Fonction pour vérifier l'accès à une entité
  const hasAccessToEntity = (typeDoc: TypeDocument): boolean => {
    if (isUserAdmin(user)) return true;

    const userEntityIds = {
      un: new Set<number>(),
      deux: new Set<number>(),
      trois: new Set<number>(),
      direction: new Set<number>(),
      service: new Set<number>(),
      sousDirection: new Set<number>(),
      division: new Set<number>(),
      section: new Set<number>(),
    };

    // NOUVELLES ENTITÉS
    if (user?.fonction_details?.direction?.id) {
      userEntityIds.direction.add(user.fonction_details.direction.id);
    }
    if (user?.fonction_details?.service?.id) {
      userEntityIds.service.add(user.fonction_details.service.id);
    }
    if (user?.fonction_details?.sousDirection?.id) {
      userEntityIds.sousDirection.add(user.fonction_details.sousDirection.id);
    }
    if (user?.fonction_details?.division?.id) {
      userEntityIds.division.add(user.fonction_details.division.id);
    }
    if (user?.fonction_details?.section?.id) {
      userEntityIds.section.add(user.fonction_details.section.id);
    }

    // Entités des agent_access
    user?.agent_access?.forEach((access) => {
      // NOUVELLES ENTITÉS
      if (access.direction?.id)
        userEntityIds.direction.add(access.direction.id);
      if (access.service?.id) userEntityIds.service.add(access.service.id);
      if (access.sousDirection?.id)
        userEntityIds.sousDirection.add(access.sousDirection.id);
      if (access.division?.id) userEntityIds.division.add(access.division.id);
      if (access.section?.id) userEntityIds.section.add(access.section.id);
    });

    // Vérification par niveau
    if (typeDoc.section_id) {
      return userEntityIds.section.has(typeDoc.section_id);
    }
    if (typeDoc.division_id && !typeDoc.section_id) {
      return userEntityIds.division.has(typeDoc.division_id);
    }
    if (
      typeDoc.sous_direction_id &&
      !typeDoc.division_id &&
      !typeDoc.section_id
    ) {
      return userEntityIds.sousDirection.has(typeDoc.sous_direction_id);
    }
    if (
      typeDoc.service_id &&
      !typeDoc.sous_direction_id &&
      !typeDoc.division_id &&
      !typeDoc.section_id
    ) {
      return userEntityIds.service.has(typeDoc.service_id);
    }
    if (
      typeDoc.direction_id &&
      !typeDoc.service_id &&
      !typeDoc.sous_direction_id &&
      !typeDoc.division_id &&
      !typeDoc.section_id
    ) {
      return userEntityIds.direction.has(typeDoc.direction_id);
    }
    return false;
  };

  // ✅ Fonction pour grouper les types par entité
  const getGroupedData = () => {
    // Si les types ne sont pas encore chargés, retourner un objet vide
    if (!types || types.length === 0) {
      return {};
    }

    const accessibleTypes = types.filter((t) => hasAccessToEntity(t));

    console.log(
      "🔍 Types accessibles:",
      accessibleTypes.map((t) => ({
        id: t.id,
        nom: t.nom,
        direction: t.direction?.libelle || t.direction_id,
        service: t.service?.libelle || t.service_id,
        // ... etc
      })),
    );

    const filtered = accessibleTypes.filter((t) => {
      const search = query.toLowerCase();
      const matchesSearch =
        (t.code?.toLowerCase() || "").includes(search) ||
        (t.nom?.toLowerCase() || "").includes(search);

      if (!selectedTypeDoc) return matchesSearch;

      return (
        matchesSearch &&
        (selectedTypeDoc === `DIR-${t.direction_id}` ||
          selectedTypeDoc === `SERV-${t.service_id}` ||
          selectedTypeDoc === `SD-${t.sous_direction_id}` ||
          selectedTypeDoc === `DIV-${t.division_id}` ||
          selectedTypeDoc === `SEC-${t.section_id}`)
      );
    });

    const groups: Record<string, TypeDocument[]> = {};

    filtered.forEach((t) => {
      // Construire le libellé en fonction de l'entité attachée
      let structureLabel = "📄 Documents non assignés";

      // Chercher dans les directions
      if (t.direction_id) {
        const direction = directions.find((d) => d.id === t.direction_id);
        if (direction) {
          structureLabel = `🏢 Direction : ${direction.libelle}`;
        }
      }
      // Chercher dans les services
      else if (t.service_id) {
        const service = services.find((s) => s.id === t.service_id);
        if (service) {
          structureLabel = `🛠️ Service : ${service.libelle}`;
        }
      }
      // Chercher dans les sous-directions
      else if (t.sous_direction_id) {
        const sousDirection = sousDirections.find(
          (sd) => sd.id === t.sous_direction_id,
        );
        if (sousDirection) {
          structureLabel = `📁 Sous-direction : ${sousDirection.libelle}`;
        }
      }
      // Chercher dans les divisions
      else if (t.division_id) {
        const division = divisions.find((d) => d.id === t.division_id);
        if (division) {
          structureLabel = `📂 Division : ${division.libelle}`;
        }
      }
      // Chercher dans les sections
      else if (t.section_id) {
        const section = sections.find((s) => s.id === t.section_id);
        if (section) {
          structureLabel = `📌 Section : ${section.libelle}`;
        }
      }

      if (!groups[structureLabel]) groups[structureLabel] = [];
      groups[structureLabel].push(t);
    });

    return groups;
  };

  // ✅ Fonction pour obtenir le libellé d'un groupe
  const getGroupLabel = (groupKey: string, group: TypeDocument[]): string => {
    if (groupKey === "non_assignes") return "📄 Documents non assignés";

    const first = group[0];

    if (groupKey.startsWith("section_")) {
      return `📁 Section : ${first.section?.libelle || "Inconnue"}`;
    }
    if (groupKey.startsWith("division_")) {
      return `📂 Division : ${first.division?.libelle || "Inconnue"}`;
    }
    if (groupKey.startsWith("sousDirection_")) {
      return `📁 Sous-direction : ${first.sousDirection?.libelle || "Inconnue"}`;
    }
    if (groupKey.startsWith("service_")) {
      return `🛠️ Service : ${first.service?.libelle || "Inconnu"}`;
    }
    if (groupKey.startsWith("direction_")) {
      return `🏢 Direction : ${first.direction?.libelle || "Inconnue"}`;
    }

    return groupKey;
  };

  const groupedTypes = getGroupedData();

  const filteredOptions = useMemo(() => {
    const isAdmin = isUserAdmin(user);

    if (isAdmin) return optionsEntites;

    const accessibleEntityIds = new Set();

    // NOUVELLES ENTITÉS
    if (user?.fonction_details?.direction?.id) {
      accessibleEntityIds.add(`DIR-${user.fonction_details.direction.id}`);
    }
    if (user?.fonction_details?.service?.id) {
      accessibleEntityIds.add(`SERV-${user.fonction_details.service.id}`);
    }
    if (user?.fonction_details?.sousDirection?.id) {
      accessibleEntityIds.add(`SD-${user.fonction_details.sousDirection.id}`);
    }
    if (user?.fonction_details?.division?.id) {
      accessibleEntityIds.add(`DIV-${user.fonction_details.division.id}`);
    }
    if (user?.fonction_details?.section?.id) {
      accessibleEntityIds.add(`SEC-${user.fonction_details.section.id}`);
    }

    user?.agent_access?.forEach((access) => {
      if (access.direction?.id) {
        accessibleEntityIds.add(`DIR-${access.direction.id}`);
      }
      if (access.service?.id) {
        accessibleEntityIds.add(`SERV-${access.service.id}`);
      }
      if (access.sousDirection?.id) {
        accessibleEntityIds.add(`SD-${access.sousDirection.id}`);
      }
      if (access.division?.id) {
        accessibleEntityIds.add(`DIV-${access.division.id}`);
      }
      if (access.section?.id) {
        accessibleEntityIds.add(`SEC-${access.section.id}`);
      }
    });

    return optionsEntites.filter(
      (opt) => opt.value === null || accessibleEntityIds.has(opt.value),
    );
  }, [optionsEntites, user]);

  // ✅ Handlers
  const handleStructureClick = (groupKey: string) => {
    setExpandedStructure(expandedStructure === groupKey ? null : groupKey);

    // Trouver la première entité du groupe pour récupérer ses infos
    const groupDocs = groupedTypes[groupKey];
    if (groupDocs && groupDocs.length > 0) {
      const firstDoc = groupDocs[0];

      // Déterminer le type d'entité et sa valeur
      if (firstDoc.direction_id) {
        setSelectedAccordionEntity({
          label: groupKey,
          value: `DIR-${firstDoc.direction_id}`,
          type: "direction",
        });
        setSelectedTypeDoc(`DIR-${firstDoc.direction_id}`);
      } else if (firstDoc.service_id) {
        setSelectedAccordionEntity({
          label: groupKey,
          value: `SERV-${firstDoc.service_id}`,
          type: "service",
        });
        setSelectedTypeDoc(`SERV-${firstDoc.service_id}`);
      } else if (firstDoc.sous_direction_id) {
        setSelectedAccordionEntity({
          label: groupKey,
          value: `SD-${firstDoc.sous_direction_id}`,
          type: "sousDirection",
        });
        setSelectedTypeDoc(`SD-${firstDoc.sous_direction_id}`);
      } else if (firstDoc.division_id) {
        setSelectedAccordionEntity({
          label: groupKey,
          value: `DIV-${firstDoc.division_id}`,
          type: "division",
        });
        setSelectedTypeDoc(`DIV-${firstDoc.division_id}`);
      } else if (firstDoc.section_id) {
        setSelectedAccordionEntity({
          label: groupKey,
          value: `SEC-${firstDoc.section_id}`,
          type: "section",
        });
        setSelectedTypeDoc(`SEC-${firstDoc.section_id}`);
      } else {
        setSelectedAccordionEntity(null);
        setSelectedTypeDoc(null);
      }
    }
  };

  const handleSubmit = async (formData: { code: string; nom: string }) => {
    try {
      if (editing?.id) {
        await updateMutation.mutateAsync({
          id: String(editing.id),
          data: formData,
        });
        toast.current?.show({ severity: "success", summary: "Mis à jour" });
      } else {
        let payload: any = { ...formData };

        if (selectedTypeDoc) {
          // Traiter selon le préfixe
          if (selectedTypeDoc.startsWith("DIR-")) {
            payload.direction_id = Number(selectedTypeDoc.replace("DIR-", ""));
          } else if (selectedTypeDoc.startsWith("SERV-")) {
            payload.service_id = Number(selectedTypeDoc.replace("SERV-", ""));
          } else if (selectedTypeDoc.startsWith("SD-")) {
            payload.sous_direction_id = Number(
              selectedTypeDoc.replace("SD-", ""),
            );
          } else if (selectedTypeDoc.startsWith("DIV-")) {
            payload.division_id = Number(selectedTypeDoc.replace("DIV-", ""));
          } else if (selectedTypeDoc.startsWith("SEC-")) {
            payload.section_id = Number(selectedTypeDoc.replace("SEC-", ""));
          } else if (selectedTypeDoc.startsWith("E1-")) {
            payload.entitee_un_id = Number(selectedTypeDoc.replace("E1-", ""));
          } else if (selectedTypeDoc.startsWith("E2-")) {
            payload.entitee_deux_id = Number(
              selectedTypeDoc.replace("E2-", ""),
            );
          } else if (selectedTypeDoc.startsWith("E3-")) {
            payload.entitee_trois_id = Number(
              selectedTypeDoc.replace("E3-", ""),
            );
          }
        }

        await createMutation.mutateAsync(payload);
        toast.current?.show({
          severity: "success",
          summary: "Créé avec succès",
        });
      }

      setFormVisible(false);
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Erreur" });
    }
  };

  const handleDelete = (id: string) => {
    confirmDialog({
      message:
        "Voulez-vous supprimer ce type de document définitivement ? Cette action est irréversible.",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      acceptClassName: "p-button-danger p-button-raised p-button-rounded p-2",
      rejectClassName:
        "p-button-secondary p-button-outlined p-button-rounded mr-4 p-2",
      style: { width: "450px" },
      accept: async () => {
        await deleteMutation.mutateAsync(id);
        toast.current?.show({ severity: "success", summary: "Supprimé" });
      },
    });
  };

  const handleMetaSubmit = async (fieldsPayload: any[]) => {
    if (!selected?.id) return;
    try {
      for (const field of fieldsPayload) {
        if (field.id) {
          await updateMetaMutation.mutateAsync({ id: field.id, field });
        } else {
          await createMetaMutation.mutateAsync({
            typeId: selected.id,
            field,
          });
        }
      }
      toast.current?.show({
        severity: "success",
        summary: "Métadonnées à jour",
      });
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Erreur" });
    }
  };

  const onAddPieces = async (
    typeId: string,
    payload: AddPiecesToTypeDocumentPayload,
  ) => {
    try {
      await addPiecesMutation.mutateAsync({ typeId, payload });
      toast.current?.show({ severity: "success", summary: "Pièces ajoutées" });
      setFormPiecesVisible(false);
    } catch (err) {
      /* erreur */
    }
  };

  const handleAffectationSubmit = async (payload: any) => {
    try {
      if (selected?.id) {
        await updateMutation.mutateAsync({
          id: String(selected.id),
          data: payload,
        });
        toast.current?.show({
          severity: "success",
          summary: "Affectation mise à jour",
        });
        setAffectationFormVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMultipleAffectation = async (typeIds: string[]) => {
    try {
      if (!selectedTypeDoc) return;

      let structureData: any = {};

      if (selectedTypeDoc.startsWith("DIR-")) {
        structureData.direction_id = Number(
          selectedTypeDoc.replace("DIR-", ""),
        );
      } else if (selectedTypeDoc.startsWith("SERV-")) {
        structureData.service_id = Number(selectedTypeDoc.replace("SERV-", ""));
      } else if (selectedTypeDoc.startsWith("SD-")) {
        structureData.sous_direction_id = Number(
          selectedTypeDoc.replace("SD-", ""),
        );
      } else if (selectedTypeDoc.startsWith("DIV-")) {
        structureData.division_id = Number(selectedTypeDoc.replace("DIV-", ""));
      } else if (selectedTypeDoc.startsWith("SEC-")) {
        structureData.section_id = Number(selectedTypeDoc.replace("SEC-", ""));
      } else if (selectedTypeDoc.startsWith("E1-")) {
        structureData.entitee_un_id = Number(
          selectedTypeDoc.replace("E1-", ""),
        );
      } else if (selectedTypeDoc.startsWith("E2-")) {
        structureData.entitee_deux_id = Number(
          selectedTypeDoc.replace("E2-", ""),
        );
      } else if (selectedTypeDoc.startsWith("E3-")) {
        structureData.entitee_trois_id = Number(
          selectedTypeDoc.replace("E3-", ""),
        );
      }

      await multipleAffectationMutation.mutateAsync({ typeIds, structureData });

      toast.current?.show({
        severity: "success",
        summary: "Affectation réussie",
      });
    } catch (error) {
      console.error("Erreur affectation:", error);
    }
  };

  // ✅ États de chargement/erreur
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600 p-8">
          <XCircle size={48} className="mx-auto mb-4" />
          <p>Erreur de chargement: {error.message}</p>
          <Button
            label="Réessayer"
            onClick={() => refetch()}
            className="mt-4"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-3 bg-orange-800 text-white rounded-2xl shadow-lg">
              <Layers size={24} />
            </div>
            Types par Structure
          </h1>
        </div>
        <Button
          label="Nouveau Type"
          icon={<Plus size={20} />}
          onClick={() => {
            setEditing(null);
            setFormVisible(true);
            // selectedTypeDoc est déjà conservé avec la valeur de l'entité cliquée
          }}
          className="bg-orange-700 hover:bg-orange-800 text-white border-none px-6 py-3 rounded-xl shadow-md font-bold"
        />
      </div>

      {/* Barre de recherche et filtre */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <InputText
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un document..."
            value={query}
          />
        </div>

        <div>
          <Dropdown
            value={selectedTypeDoc}
            onChange={(e) => {
              setSelectedTypeDoc(e.value);
              // Mettre à jour selectedAccordionEntity quand on change via le dropdown
              if (e.value) {
                const option = filteredOptions.find(
                  (opt) => opt.value === e.value,
                );
                if (option) {
                  setSelectedAccordionEntity({
                    label: option.label,
                    value: e.value,
                    type: e.value.split("-")[0] as any,
                  });
                }
              } else {
                setSelectedAccordionEntity(null);
              }
            }}
            options={filteredOptions}
            placeholder="Filtrer par structure"
            className="w-64 bg-slate-50 border-slate-200 rounded-xl"
            showClear
            filter
          />
        </div>
      </div>

      {/* Liste des types groupés par entité */}
      <div className="space-y-4">
        {Object.entries(groupedTypes).map(([groupKey, docs]) => {
          // groupKey est déjà le libellé complet (ex: "🏢 Direction : DIRECTION GENERAL")

          // Déterminer l'icône en fonction du libellé
          let Icon = Database; // par défaut
          if (groupKey.includes("Direction")) Icon = Building2;
          else if (groupKey.includes("Service")) Icon = Briefcase;
          else if (groupKey.includes("Sous-direction")) Icon = Split;
          else if (groupKey.includes("Division")) Icon = TableOfContents;
          else if (groupKey.includes("Section")) Icon = GitMerge;

          return (
            <div
              key={groupKey}
              className="bg-white border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => handleStructureClick(groupKey)}
                className="w-full flex items-center justify-between p-5 transition-all hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <Icon size={20} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-700">{groupKey}</h3>
                      {/* 👇 BADGE À PLACER ICI, À CÔTÉ DU TITRE */}
                      {selectedAccordionEntity?.label === groupKey && (
                        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                          Structure active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {docs.length} document(s)
                    </p>
                  </div>
                </div>
                {expandedStructure === groupKey ? (
                  <ChevronDown size={20} className="text-slate-400" />
                ) : (
                  <ChevronRight size={20} className="text-slate-400" />
                )}
              </button>

              {expandedStructure === groupKey && (
                <div className="border-t border-slate-50 overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-left">
                          Code
                        </th>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-left">
                          Libellé
                        </th>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {docs.map((t) => (
                        <tr
                          key={t.id}
                          onClick={() => {
                            setSelected(t);
                            setDetailsVisible(true);
                          }}
                          className="cursor-pointer hover:bg-orange-50/30 transition-colors"
                        >
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold">
                              {t.code}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                              <FileText size={25} className="text-orange-500" />
                              {t.nom}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-1">
                              <button
                                onClick={(e) => {
                                  setSelected(t);
                                  setFormPiecesVisible(true);
                                  e.stopPropagation();
                                }}
                                className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg"
                                title="Ajouter des pièces"
                              >
                                <FilePlus size={25} />
                              </button>

                              {groupKey.includes("non assignés") && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelected(t);
                                    setAffectationFormVisible(true);
                                  }}
                                  className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                                  title="Affecter à une structure"
                                >
                                  <SplinePointer size={25} />
                                </button>
                              )}

                              <button
                                onClick={(e) => {
                                  setEditing(t);
                                  setFormVisible(true);
                                  e.stopPropagation();
                                }}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                                title="Modifier"
                              >
                                <Pencil size={25} />
                              </button>

                              <button
                                onClick={(e) => {
                                  setSelected(t);
                                  setMetaVisible(true);
                                  e.stopPropagation();
                                }}
                                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                                title="Métadonnées"
                              >
                                <Settings size={25} />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(String(t.id));
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                title="Supprimer"
                              >
                                <Trash2 size={25} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <DocumentTypeDetails
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        type={selected}
      />

      <DocumentTypeMetaForm
        visible={metaVisible}
        onHide={() => setMetaVisible(false)}
        onSubmit={handleMetaSubmit}
        type={selected}
      />

      <TypeDocumentAjoutPieces
        visible={formPiecesVisible}
        onHide={() => setFormPiecesVisible(false)}
        onSubmit={onAddPieces}
        initial={selected}
        title={"Pièces à fournir"}
        pieces={pieces}
      />

      <DocumentTypeAffectationForm
        visible={affectationFormVisible}
        onHide={() => setAffectationFormVisible(false)}
        onSubmit={handleAffectationSubmit}
        initial={selected}
        title={`Affectation : ${selected?.nom}`}
      />

      <DocumentTypeAffectAndForm
        visible={formVisible}
        onHide={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSubmitSingle={handleSubmit}
        onSubmitMultiple={handleMultipleAffectation}
        types={types}
        initial={editing}
        isFiltered={!!selectedTypeDoc}
        structureLabel=""
      />
    </Layout>
  );
}
