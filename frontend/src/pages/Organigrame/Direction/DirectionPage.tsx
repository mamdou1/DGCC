// pages/Direction/DirectionPage.tsx
import { useRef, useState, useEffect } from "react";
import Layout from "../../../components/layout/Layoutt";
import DirectionDetails from "./DirectionDetails";
import DirectionForm from "./DirectionForm";
import DirectionAjoutFonction from "./DirectionAjoutFonction";
import ServiceForm from "../Service/ServiceForm";
import ServiceAjoutFonction from "../Service/ServiceAjoutFonction";
import SousDirectionForm from "../Sous Direction/SousDirectionForm";
import SousDirectionAjoutFonction from "../Sous Direction/SousDirectionAjoutFonction";
import DivisionForm from "../Division/DivisionForm";
import DivisionAjoutFonction from "../Division/DivisionAjoutFonction";
import SectionAjoutFonction from "../Section/SectionAjoutFonction";
import {
  Direction,
  Service,
  SousDirection,
  Division,
  Section,
  Fonction,
} from "../../../interfaces";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import Pagination from "../../../components/layout/Pagination";
import { InputText } from "primereact/inputtext";
import {
  Building2,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  Layers,
  GitMerge,
  Bookmark,
  PlusIcon,
  XCircle,
  Briefcase,
  Split,
  TableOfContents,
} from "lucide-react";
import {
  useDirections,
  useCreateDirection,
  useUpdateDirection,
  useDeleteDirection,
} from "../../../hooks/useDirections";
import {
  useServices,
  useServicesByDirection,
} from "../../../hooks/useServices";
import {
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "../../../hooks/useServices";
import { useSousDirections } from "../../../hooks/useSousDirections";
import {
  useCreateSousDirection,
  useUpdateSousDirection,
  useDeleteSousDirection,
} from "../../../hooks/useSousDirections";

import { useDivisions } from "../../../hooks/useDivisions";
import {
  useCreateDivision,
  useUpdateDivision,
  useDeleteDivision,
  useDivisionsBySousDirection,
} from "../../../hooks/useDivisions";

import { useSections } from "../../../hooks/useSections";
import {
  getFunctionsBySection,
  getSectionsByDivision,
} from "../../../api/section";
import { getSousDirectionsByDirection } from "../../../api/sousDirection";
import { getDivisionsBySousDirection } from "../../../api/division";
import {
  getFunctionsByService,
  getServicesByDirection,
} from "../../../api/service";
import {
  deleteFonctionById,
  getFonctionsBySection,
  getFonctionsByService,
} from "../../../api/fonction";

export default function DirectionPage() {
  const toast = useRef<Toast>(null);

  // ============================================
  // DATA FETCHING
  // ============================================
  const {
    data: allDirections = [],
    isLoading: isLoadingDirections,
    error: errorDirections,
    refetch: refetchDirections,
  } = useDirections();

  // ============================================
  // MUTATIONS
  // ============================================
  // Direction mutations
  const createDirectionMutation = useCreateDirection();
  const updateDirectionMutation = useUpdateDirection();
  const deleteDirectionMutation = useDeleteDirection();

  // Service mutations
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  // Sous-direction mutations
  const createSousDirectionMutation = useCreateSousDirection();
  const updateSousDirectionMutation = useUpdateSousDirection();
  const deleteSousDirectionMutation = useDeleteSousDirection();

  // Division mutations
  const createDivisionMutation = useCreateDivision();
  const updateDivisionMutation = useUpdateDivision();
  const deleteDivisionMutation = useDeleteDivision();

  // ============================================
  // UI STATES
  // ============================================
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSousDirection, setSelectedSousDirection] =
    useState<SousDirection | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(
    null,
  );
  // 👇 Ajout : état pour la section sélectionnée
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  // Modal visibility
  const [directionFormVisible, setDirectionFormVisible] = useState(false);
  const [directionDetailsVisible, setDirectionDetailsVisible] = useState(false);
  const [directionAjoutFonctionVisible, setDirectionAjoutFonctionVisible] =
    useState(false);

  const [serviceFormVisible, setServiceFormVisible] = useState(false);
  const [serviceAjoutFonctionVisible, setServiceAjoutFonctionVisible] =
    useState(false);

  const [sousDirectionFormVisible, setSousDirectionFormVisible] =
    useState(false);
  const [
    sousDirectionAjoutFonctionVisible,
    setSousDirectionAjoutFonctionVisible,
  ] = useState(false);

  const [divisionFormVisible, setDivisionFormVisible] = useState(false);
  const [divisionAjoutFonctionVisible, setDivisionAjoutFonctionVisible] =
    useState(false);

  const [sectionAjoutFonctionVisible, setSectionAjoutFonctionVisible] =
    useState(false);

  // États pour pré‑remplir les formulaires avec la direction parente
  const [currentDirectionForService, setCurrentDirectionForService] =
    useState<Direction | null>(null);
  const [currentDirectionForSousDirection, setCurrentDirectionForSousDirection] =
    useState<Direction | null>(null);

  // Editing states
  const [editingDirection, setEditingDirection] =
    useState<Partial<Direction> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(
    null,
  );
  const [editingSousDirection, setEditingSousDirection] =
    useState<Partial<SousDirection> | null>(null);
  const [editingDivision, setEditingDivision] =
    useState<Partial<Division> | null>(null);

  const [isEditingService, setIsEditingService] = useState(false);
  const [isEditingSousDirection, setIsEditingSousDirection] = useState(false);
  const [isEditingDivision, setIsEditingDivision] = useState(false);

  // Accordion states
  const [expandedDirection, setExpandedDirection] = useState<number | null>(
    null,
  );
  const [expandedSousDirection, setExpandedSousDirection] = useState<
    number | null
  >(null);

  // Maps for storing children data
  const [servicesMap, setServicesMap] = useState<Record<number, Service[]>>({});
  const [sousDirectionsMap, setSousDirectionsMap] = useState<
    Record<number, SousDirection[]>
  >({});
  const [divisionsMap, setDivisionsMap] = useState<Record<number, Division[]>>(
    {},
  );
  const [sectionsMap, setSectionsMap] = useState<Record<number, Section[]>>({});

  // Search and pagination
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ============================================
  // DATA LOADING FUNCTIONS
  // ============================================
  const loadServices = async (directionId: number) => {
    if (servicesMap[directionId]) return;

    try {
      const data = await getServicesByDirection(directionId);
      const services = Array.isArray(data) ? data : [];
      setServicesMap((prev) => ({ ...prev, [directionId]: services }));
    } catch (err) {
      console.error("Erreur chargement services", err);
      setServicesMap((prev) => ({ ...prev, [directionId]: [] }));
    }
  };

  const loadSousDirections = async (directionId: number) => {
    if (sousDirectionsMap[directionId]) return;

    try {
      const data = await getSousDirectionsByDirection(directionId);
      const sousDirections = Array.isArray(data) ? data : [];
      setSousDirectionsMap((prev) => ({
        ...prev,
        [directionId]: sousDirections,
      }));
    } catch (err) {
      console.error("Erreur chargement sous-directions", err);
      setSousDirectionsMap((prev) => ({ ...prev, [directionId]: [] }));
    }
  };

  const loadDivisions = async (sousDirectionId: number) => {
    if (divisionsMap[sousDirectionId]) return;

    try {
      const data = await getDivisionsBySousDirection(sousDirectionId);
      const divisions = Array.isArray(data) ? data : [];
      setDivisionsMap((prev) => ({ ...prev, [sousDirectionId]: divisions }));
    } catch (err) {
      console.error("Erreur chargement divisions", err);
      setDivisionsMap((prev) => ({ ...prev, [sousDirectionId]: [] }));
    }
  };

  const loadSections = async (divisionId: number) => {
    if (sectionsMap[divisionId]) return;
    try {
      const data = await getSectionsByDivision(divisionId);
      setSectionsMap((prev) => ({
        ...prev,
        [divisionId]: Array.isArray(data) ? data : [],
      }));
    } catch (err) {
      console.error("Erreur chargement sections", err);
    }
  };

  // ============================================
  // TOGGLE FUNCTIONS
  // ============================================
  const toggleDirection = async (direction: Direction) => {
    if (expandedDirection === direction.id) {
      setExpandedDirection(null);
      setExpandedSousDirection(null);
    } else {
      setExpandedDirection(direction.id);
      await Promise.all([
        loadServices(direction.id),
        loadSousDirections(direction.id),
      ]);
    }
  };

  const toggleSousDirection = async (sousDirectionId: number) => {
    if (expandedSousDirection === sousDirectionId) {
      setExpandedSousDirection(null);
    } else {
      setExpandedSousDirection(sousDirectionId);
      await loadDivisions(sousDirectionId);
    }
  };

  // ============================================
  // HANDLERS - Direction
  // ============================================
  const onEditDirection = async (payload: Partial<Direction>) => {
    if (!editingDirection?.id) return;
    try {
      await updateDirectionMutation.mutateAsync({
        id: String(editingDirection.id),
        data: payload,
      });
      toast.current?.show({
        severity: "success",
        summary: "Mis à jour",
        detail: "Direction modifiée",
      });
      setEditingDirection(null);
      setDirectionFormVisible(false);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Échec de mise à jour",
      });
    }
  };

  const onCreateDirection = async (payload: Partial<Direction>) => {
    try {
      await createDirectionMutation.mutateAsync(payload);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Direction créée",
      });
      setDirectionFormVisible(false);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Opération échouée",
      });
    }
  };

  const handleDeleteDirection = async (id: string) => {
    confirmDialog({
      message: `Voulez-vous supprimer cette direction définitivement ?`,
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      acceptClassName: "p-button-danger p-button-raised p-button-rounded p-2",
      rejectClassName:
        "p-button-secondary p-button-outlined p-button-rounded mr-4 p-2",
      style: { width: "450px" },
      accept: async () => {
        try {
          await deleteDirectionMutation.mutateAsync(id);
          toast.current?.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Direction supprimée",
          });
        } catch (err: any) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: err?.response?.data?.message || "Suppression impossible",
          });
        }
      },
    });
  };

  // ============================================
  // HANDLERS - Service
  // ============================================
  const onCreateService = async (payload: Partial<Service>) => {
    try {
      await createServiceMutation.mutateAsync(payload);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Service créé",
      });
      setServiceFormVisible(false);
      if (expandedDirection) {
        await loadServices(expandedDirection);
      }
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Échec de création",
      });
    }
  };

  const onEditService = async (payload: Partial<Service>) => {
    if (!editingService?.id) return;
    try {
      await updateServiceMutation.mutateAsync({
        id: String(editingService.id),
        data: payload,
      });
      toast.current?.show({
        severity: "success",
        summary: "Mis à jour",
        detail: "Service modifié",
      });
      setEditingService(null);
      setServiceFormVisible(false);
      if (expandedDirection) {
        await loadServices(expandedDirection);
      }
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Échec de mise à jour",
      });
    }
  };

  const handleDeleteService = async (id: string, directionId: number) => {
    confirmDialog({
      message: `Voulez-vous supprimer ce service définitivement ?`,
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      style: { width: "450px" },
      accept: async () => {
        try {
          await deleteServiceMutation.mutateAsync(id);
          toast.current?.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Service supprimé",
          });
          await loadServices(directionId);
        } catch (err: any) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: err?.response?.data?.message || "Suppression impossible",
          });
        }
      },
    });
  };

  // ============================================
  // HANDLERS - Sous-direction
  // ============================================
  const onCreateSousDirection = async (payload: Partial<SousDirection>) => {
    try {
      await createSousDirectionMutation.mutateAsync(payload);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Sous-direction créée",
      });
      setSousDirectionFormVisible(false);
      if (expandedDirection) {
        await loadSousDirections(expandedDirection);
      }
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Échec de création",
      });
    }
  };

  const onEditSousDirection = async (payload: Partial<SousDirection>) => {
    if (!editingSousDirection?.id) return;
    try {
      await updateSousDirectionMutation.mutateAsync({
        id: String(editingSousDirection.id),
        data: payload,
      });
      toast.current?.show({
        severity: "success",
        summary: "Mis à jour",
        detail: "Sous-direction modifiée",
      });
      setEditingSousDirection(null);
      setSousDirectionFormVisible(false);
      if (expandedDirection) {
        await loadSousDirections(expandedDirection);
      }
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Échec de mise à jour",
      });
    }
  };

  const handleDeleteSousDirection = async (id: string, directionId: number) => {
    confirmDialog({
      message: `Voulez-vous supprimer cette sous-direction définitivement ? Cette action est irréversible.`,
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      acceptClassName: "p-button-danger p-button-raised p-button-rounded p-2",
      rejectClassName:
        "p-button-secondary p-button-outlined p-button-rounded mr-4 p-2",
      style: { width: "450px" },
      accept: async () => {
        try {
          await deleteSousDirectionMutation.mutateAsync(id);
          toast.current?.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Sous-direction supprimée",
          });
          await loadSousDirections(directionId);
        } catch (err: any) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: err?.response?.data?.message || "Suppression impossible",
          });
        }
      },
    });
  };

  // ============================================
  // HANDLERS - Division
  // ============================================
  const onCreateDivision = async (payload: Partial<Division>) => {
    try {
      await createDivisionMutation.mutateAsync(payload);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Division créée",
      });
      setDivisionFormVisible(false);
      if (expandedSousDirection) {
        await loadDivisions(expandedSousDirection);
      }
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Échec de création",
      });
    }
  };

  const onEditDivision = async (payload: Partial<Division>) => {
    if (!editingDivision?.id) return;
    try {
      await updateDivisionMutation.mutateAsync({
        id: String(editingDivision.id),
        data: payload,
      });
      toast.current?.show({
        severity: "success",
        summary: "Mis à jour",
        detail: "Division modifiée",
      });
      setEditingDivision(null);
      setDivisionFormVisible(false);
      if (expandedSousDirection) {
        await loadDivisions(expandedSousDirection);
      }
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Échec de mise à jour",
      });
    }
  };

  const handleDeleteDivision = async (id: string, sousDirectionId: number) => {
    confirmDialog({
      message: `Voulez-vous supprimer cette division définitivement ? Cette action est irréversible.`,
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      acceptClassName: "p-button-danger p-button-raised p-button-rounded p-2",
      rejectClassName:
        "p-button-secondary p-button-outlined p-button-rounded mr-4 p-2",
      style: { width: "450px" },
      accept: async () => {
        try {
          await deleteDivisionMutation.mutateAsync(id);
          toast.current?.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Division supprimée",
          });
          await loadDivisions(sousDirectionId);
        } catch (err: any) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: err?.response?.data?.message || "Suppression impossible",
          });
        }
      },
    });
  };

  // ============================================
  // LES ELEMENTS DE L'ACCORDEON
  // ============================================

  function ServiceItem({
    service,
    direction,
  }: {
    service: Service;
    direction: any;
  }) {
    const [expanded, setExpanded] = useState(false);
    const [fonctions, setFonctions] = useState<Fonction[]>([]);

    const loadFonctions = async () => {
      try {
        const data = await getFunctionsByService(service.id);
        setFonctions(data);
        console.log("service fonction:", data);
      } catch (err) {
        console.error("Erreur chargement fonctions service", err);
      }
    };

    const handleDelete = (id: number) => {
      confirmDialog({
        message: `Voulez-vous supprimer cette fonction définitivement ?`,
        header: "Confirmation",
        icon: "pi pi-info-circle",
        acceptLabel: "Supprimer",
        rejectLabel: "Annuler",
        acceptClassName: "p-button-danger p-button-raised p-button-rounded p-2",
        rejectClassName:
          "p-button-secondary p-button-outlined p-button-rounded mr-4 p-2",
        style: { width: "450px" },
        accept: async () => {
          try {
            await deleteFonctionById(id);
            toast.current?.show({
              severity: "success",
              summary: "Supprimé",
              detail: "Fonction supprimée",
            });
            loadFonctions();
          } catch (err) {
            toast.current?.show({
              severity: "error",
              summary: "Erreur",
              detail: "Impossible de supprimer",
            });
          }
        },
      });
    };

    const toggle = () => {
      if (expanded) {
        setExpanded(false);
      } else {
        setExpanded(true);
        loadFonctions();
      }
    };

    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        {/* HEADER SERVICE */}
        <div
          onClick={toggle}
          className="cursor-pointer flex items-center justify-between p-3 bg-white hover:bg-teal-50/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-600">
              <Briefcase size={14} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-700">
                {service.libelle}
              </span>
              {service.code && (
                <span className="ml-2 text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {service.code}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedService(service);
                setServiceAjoutFonctionVisible(true);
              }}
              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"
              title="Ajouter une fonction"
            >
              <PlusCircle size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingService(service);
                setIsEditingService(true);
                setServiceFormVisible(true);
              }}
              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"
              title="Modifier"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteService(String(service.id), direction.id);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={toggle}
              className="p-1.5 text-slate-400 hover:text-teal-600"
            >
              {expanded ? (
                <ChevronDown size={16} className="text-teal-600" />
              ) : (
                <ChevronRight size={16} className="text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* FONCTIONS DU SERVICE */}
        {expanded && (
          <div className="p-3 bg-slate-50/30 border-t border-slate-100 ml-8 space-y-2">
            {fonctions.length > 0 ? (
              fonctions.map((f: Fonction) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase size={12} className="text-purple-500" />
                    <span className="text-xs text-slate-700">{f.libelle}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-slate-400 hover:text-teal-600">
                      <Pencil size={12} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-600">
                      <Trash2 onClick={() => handleDelete(f.id)} size={12} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-400 italic py-1">
                Aucune fonction rattachée
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  function SousDirectionItem({
    sousDirection,
    direction,
  }: {
    sousDirection: SousDirection;
    direction: Direction;
  }) {
    const [expanded, setExpanded] = useState(false);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [loading, setLoading] = useState(false);

    const loadDivisions = async () => {
      setLoading(true);
      try {
        const data = await getDivisionsBySousDirection(sousDirection.id);
        setDivisions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur chargement divisions", err);
      } finally {
        setLoading(false);
      }
    };

    const toggle = () => {
      if (expanded) {
        setExpanded(false);
      } else {
        setExpanded(true);
        loadDivisions();
      }
    };

    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div
          onClick={toggle}
          className=" cursor-pointer flex items-center justify-between p-3 bg-white hover:bg-blue-50/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
              <Split size={14} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-700">
                {sousDirection.libelle}
              </span>
              {sousDirection.code && (
                <span className="ml-2 text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {sousDirection.code}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSousDirection(sousDirection);
                setSousDirectionAjoutFonctionVisible(true);
              }}
              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"
              title="Ajouter une fonction"
            >
              <PlusCircle size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingSousDirection(sousDirection);
                setIsEditingSousDirection(true);
                setSousDirectionFormVisible(true);
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Modifier"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSousDirection(
                  String(sousDirection.id),
                  direction.id,
                );
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={toggle}
              className="p-1.5 text-slate-400 hover:text-blue-600"
              disabled={loading}
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              ) : expanded ? (
                <ChevronDown size={16} className="text-blue-600" />
              ) : (
                <ChevronRight size={16} className="text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="p-3 bg-slate-50/30 border-t border-slate-100 ml-8 space-y-3">
            {divisions.length > 0 ? (
              divisions.map((division) => (
                <DivisionItem
                  key={division.id}
                  division={division}
                  sousDirection={sousDirection}
                />
              ))
            ) : (
              <div className="text-center py-3 bg-white rounded-lg border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 italic">
                  Aucune division rattachée
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function DivisionItem({
    division,
    sousDirection,
  }: {
    division: Division;
    sousDirection: SousDirection;
  }) {
    const [expanded, setExpanded] = useState(false);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(false);

    const loadSections = async () => {
      setLoading(true);
      try {
        const data = await getSectionsByDivision(division.id);
        setSections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur chargement sections", err);
      } finally {
        setLoading(false);
      }
    };

    const toggle = () => {
      if (expanded) {
        setExpanded(false);
      } else {
        setExpanded(true);
        loadSections();
      }
    };

    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div
          onClick={toggle}
          className="cursor-pointer flex items-center justify-between p-2 bg-white hover:bg-purple-50/30 transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-purple-100 text-purple-600">
              <Layers size={12} />
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700">
                {division.libelle}
              </span>
              {division.code && (
                <span className="ml-2 text-[8px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                  {division.code}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDivision(division);
                setDivisionAjoutFonctionVisible(true);
              }}
              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
              title="Ajouter une fonction"
            >
              <PlusCircle size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingDivision(division);
                setIsEditingDivision(true);
                setDivisionFormVisible(true);
              }}
              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
              title="Modifier"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteDivision(String(division.id), sousDirection.id);
              }}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Supprimer"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={toggle}
              className="p-1 text-slate-400 hover:text-purple-600"
              disabled={loading}
            >
              {loading ? (
                <div className="h-3 w-3 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              ) : expanded ? (
                <ChevronDown size={12} className="text-purple-600" />
              ) : (
                <ChevronRight size={12} className="text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="p-2 bg-slate-50/30 border-t border-slate-100 ml-6 space-y-2">
            {sections.length > 0 ? (
              sections.map((section) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  division={division}
                />
              ))
            ) : (
              <p className="text-[10px] text-slate-400 italic py-1 text-center">
                Aucune section
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  function SectionItem({
    section,
    division,
  }: {
    section: Section;
    division: Division;
  }) {
    const [expanded, setExpanded] = useState(false);
    const [fonctions, setFonctions] = useState<Fonction[]>([]);
    const [loading, setLoading] = useState(false);

    const loadFonctions = async () => {
      setLoading(true);
      try {
        const data = await getFunctionsBySection(section.id);
        setFonctions(data);
      } catch (err) {
        console.error("Erreur chargement fonctions section", err);
      } finally {
        setLoading(false);
      }
    };

    const toggle = () => {
      if (expanded) {
        setExpanded(false);
      } else {
        setExpanded(true);
        loadFonctions();
      }
    };

    return (
      <div className="border border-slate-200 rounded-lg bg-white">
        <div
          onClick={toggle}
          className="cursor-pointer flex items-center justify-between p-2 hover:bg-pink-50/30 transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-pink-100 text-pink-600">
              <TableOfContents size={14} />
            </div>
            <div>
              <span className="text-[15px] font-medium text-slate-700">
                {section.libelle}
              </span>
              {section.code && (
                <span className="ml-2 text-[8px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                  {section.code}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 👇 On passe la section sélectionnée, pas la division
                setSelectedSection(section);
                setSectionAjoutFonctionVisible(true);
              }}
              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
              title="Ajouter une fonction"
            >
              <PlusCircle size={12} />
            </button>
            <button
              onClick={toggle}
              className="p-1 text-slate-400 hover:text-pink-600"
              disabled={loading}
            >
              {loading ? (
                <div className="h-2 w-2 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
              ) : expanded ? (
                <ChevronDown size={10} className="text-pink-600" />
              ) : (
                <ChevronRight size={10} className="text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="p-2 bg-slate-50/30 border-t border-slate-100 space-y-1">
            {fonctions.length > 0 ? (
              fonctions.map((f: Fonction) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-1.5 bg-white rounded border border-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <Briefcase size={8} className="text-purple-500" />
                    <span className="text-[9px] text-slate-700">
                      {f.libelle}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button className="p-0.5 text-slate-400 hover:text-teal-600">
                      <Pencil size={8} />
                    </button>
                    <button className="p-0.5 text-slate-400 hover:text-red-600">
                      <Trash2 size={8} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[9px] text-slate-400 italic py-1 text-center">
                Aucune fonction rattachée
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // FILTRAGE ET PAGINATION
  // ============================================
  const filtered = allDirections.filter((d) =>
    (d.libelle || "").toLowerCase().includes(query.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // ============================================
  // RENDU
  // ============================================
  if (isLoadingDirections) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </Layout>
    );
  }

  if (errorDirections) {
    return (
      <Layout>
        <div className="text-center text-red-600 p-8">
          <XCircle size={48} className="mx-auto mb-4" />
          <p>Erreur de chargement: {errorDirections.message}</p>
          <Button
            label="Réessayer"
            onClick={() => refetchDirections()}
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-orange-800 p-3 rounded-2xl text-white shadow-lg shadow-orange-100">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Directions
            </h1>
            <p className="text-slate-500 font-medium">
              Gestion hiérarchique des entités
            </p>
          </div>
        </div>
        <Button
          label="Nouvelle direction"
          icon={<Plus size={20} className="mr-2" />}
          className="bg-orange-700 hover:bg-orange-800 text-white border-none px-6 py-3 rounded-xl shadow-lg transition-all"
          onClick={() => {
            setEditingDirection(null);
            setDirectionFormVisible(true);
          }}
        />
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="relative group max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
            size={20}
          />
          <InputText
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none"
            placeholder="Rechercher une direction..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ACCORDÉON LIST */}
      <div className="space-y-4">
        {paginated.length > 0 ? (
          paginated.map((direction) => {
            const isExpanded = expandedDirection === direction.id;
            const services = servicesMap[direction.id] || [];
            const sousDirections = sousDirectionsMap[direction.id] || [];

            return (
              <div
                key={direction.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${
                  isExpanded
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-slate-100"
                }`}
              >
                {/* HEADER DIRECTION */}
                <div
                  onClick={() => toggleDirection(direction)}
                  className={`w-full flex items-center justify-between p-5 transition-all cursor-pointer ${
                    isExpanded ? "bg-orange-50/50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        isExpanded
                          ? "bg-orange-500 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Building2 size={20} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-bold ${isExpanded ? "text-orange-800" : "text-slate-700"}`}
                        >
                          {direction.libelle}
                        </h3>
                        {direction.code && (
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono">
                            {direction.code}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {services.length} service(s) • {sousDirections.length}{" "}
                        sous-direction(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDirection(direction);
                        setDirectionDetailsVisible(true);
                      }}
                      className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                      title="Voir les détails"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDirection(direction);
                        setDirectionAjoutFonctionVisible(true);
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                      title="Ajouter une fonction"
                    >
                      <PlusCircle size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDirection(direction);
                        setDirectionFormVisible(true);
                      }}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                      title="Modifier"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDirection(String(direction.id));
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                    {isExpanded ? (
                      <ChevronDown size={20} className="text-orange-700" />
                    ) : (
                      <ChevronRight size={20} className="text-slate-400" />
                    )}
                  </div>
                </div>

                {/* CONTENU DÉPLIÉ */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 space-y-6 bg-slate-50/30">
                    {/* SECTION SERVICES */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <Briefcase size={14} className="text-teal-500" />
                          Services rattachés ({services.length})
                        </h4>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingService(null);
                            setIsEditingService(false);
                            setCurrentDirectionForService(direction);
                            setServiceFormVisible(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 text-teal-600 font-bold bg-teal-50 hover:bg-teal-600 hover:text-white rounded-xl transition-all border-none"
                          title="Ajouter un nouveau service"
                        >
                          <PlusIcon size={16} />
                          <span className="text-xs font-bold">
                            Nouveau service
                          </span>
                        </Button>
                      </div>

                      {services.length > 0 ? (
                        <div className="space-y-2">
                          {services.map((service) => (
                            <ServiceItem
                              key={service.id}
                              service={service}
                              direction={direction}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-white rounded-xl border border-dashed border-slate-200">
                          <p className="text-xs text-slate-400 italic">
                            Aucun service rattaché
                          </p>
                        </div>
                      )}
                    </div>

                    {/* SECTION SOUS-DIRECTIONS */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <Split size={14} className="text-blue-500" />
                          Sous-directions rattachées ({sousDirections.length})
                        </h4>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSousDirection(null);
                            setIsEditingSousDirection(false);
                            setCurrentDirectionForSousDirection(direction);
                            setSousDirectionFormVisible(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 text-blue-600 font-bold bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all border-none"
                          title="Ajouter une nouvelle sous-direction"
                        >
                          <PlusIcon size={16} />
                          <span className="text-xs font-bold">
                            Nouvelle sous-direction
                          </span>
                        </Button>
                      </div>

                      {sousDirections.length > 0 ? (
                        <div className="space-y-2">
                          {sousDirections.map((sd) => (
                            <SousDirectionItem
                              key={sd.id}
                              sousDirection={sd}
                              direction={direction}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-white rounded-xl border border-dashed border-slate-200">
                          <p className="text-xs text-slate-400 italic">
                            Aucune sous-direction
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <Building2 size={40} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-medium">
              Aucune direction trouvée
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filtered.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ========== MODALS ========== */}

      {/* Direction Modals */}
      <DirectionForm
        visible={directionFormVisible}
        onHide={() => {
          setDirectionFormVisible(false);
          setEditingDirection(null);
        }}
        onSubmit={editingDirection ? onEditDirection : onCreateDirection}
        refresh={() => refetchDirections()}
        initial={editingDirection || undefined}
        title={
          editingDirection ? "Modifier la direction" : "Nouvelle direction"
        }
      />

      <DirectionDetails
        visible={directionDetailsVisible}
        onHide={() => setDirectionDetailsVisible(false)}
        direction={selectedDirection}
        toast={toast}
      />

      <DirectionAjoutFonction
        visible={directionAjoutFonctionVisible}
        onHide={() => setDirectionAjoutFonctionVisible(false)}
        direction={selectedDirection}
        onSuccess={() => {
          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Fonction ajoutée",
          });
        }}
      />

      {/* Service Modals */}
      <ServiceForm
        visible={serviceFormVisible}
        onHide={() => {
          setServiceFormVisible(false);
          setEditingService(null);
          setIsEditingService(false);
          setCurrentDirectionForService(null);
        }}
        onSubmit={isEditingService ? onEditService : onCreateService}
        refresh={() => {}}
        initial={
          isEditingService
            ? editingService || undefined
            : { direction_id: currentDirectionForService?.id }
        }
        directions={currentDirectionForService ? [currentDirectionForService] : allDirections}
        title={isEditingService ? "Modifier le service" : "Nouveau service"}
      />

      <ServiceAjoutFonction
        visible={serviceAjoutFonctionVisible}
        onHide={() => setServiceAjoutFonctionVisible(false)}
        service={selectedService}
        onSuccess={() => {
          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Fonction ajoutée",
          });
        }}
      />

      {/* Sous-direction Modals */}
      <SousDirectionForm
        visible={sousDirectionFormVisible}
        onHide={() => {
          setSousDirectionFormVisible(false);
          setEditingSousDirection(null);
          setIsEditingSousDirection(false);
          setCurrentDirectionForSousDirection(null);
        }}
        onSubmit={
          isEditingSousDirection ? onEditSousDirection : onCreateSousDirection
        }
        refresh={() => {}}
        initial={
          isEditingSousDirection
            ? editingSousDirection || undefined
            : { direction_id: currentDirectionForSousDirection?.id }
        }
        directions={currentDirectionForSousDirection ? [currentDirectionForSousDirection] : allDirections}
        title={
          isEditingSousDirection
            ? "Modifier la sous-direction"
            : "Nouvelle sous-direction"
        }
      />

      <SousDirectionAjoutFonction
        visible={sousDirectionAjoutFonctionVisible}
        onHide={() => setSousDirectionAjoutFonctionVisible(false)}
        sousDirection={selectedSousDirection}
        onSuccess={() => {
          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Fonction ajoutée",
          });
        }}
      />

      {/* Division Modals */}
      <DivisionForm
        visible={divisionFormVisible}
        onHide={() => {
          setDivisionFormVisible(false);
          setEditingDivision(null);
          setIsEditingDivision(false);
        }}
        onSubmit={isEditingDivision ? onEditDivision : onCreateDivision}
        refresh={() => {}}
        initial={editingDivision || undefined}
        sousDirections={[]}
        title={isEditingDivision ? "Modifier la division" : "Nouvelle division"}
      />

      <DivisionAjoutFonction
        visible={divisionAjoutFonctionVisible}
        onHide={() => setDivisionAjoutFonctionVisible(false)}
        division={selectedDivision}
        onSuccess={() => {
          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Fonction ajoutée",
          });
        }}
      />

      {/* Section Modal – correction : on passe la section sélectionnée */}
      <SectionAjoutFonction
        visible={sectionAjoutFonctionVisible}
        onHide={() => {
          setSectionAjoutFonctionVisible(false);
          setSelectedSection(null); // Réinitialiser la section
        }}
        section={selectedSection}
        onSuccess={() => {
          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Fonction ajoutée",
          });
          // Optionnel : recharger les fonctions de la section (via un rafraîchissement du composant SectionItem)
          // Cela peut être fait en forçant le rechargement des fonctions dans SectionItem,
          // mais ce n'est pas obligatoire pour l'affichage du nom.
        }}
      />
    </Layout>
  );
}