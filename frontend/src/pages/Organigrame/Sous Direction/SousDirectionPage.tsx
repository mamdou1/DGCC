// pages/SousDirection/SousDirectionPage.tsx
import { useRef, useState, useEffect } from "react";
import Layout from "../../../components/layout/Layoutt";
import SousDirectionDetails from "./SousDirectionDetails";
import SousDirectionForm from "./SousDirectionForm";
import SousDirectionAjoutFonction from "./SousDirectionAjoutFonction";
import DivisionForm from "../Division/DivisionForm";
import DivisionAjoutFonction from "../Division/DivisionAjoutFonction";
import SectionAjoutFonction from "../Section/SectionAjoutFonction";
import {
  SousDirection,
  Direction,
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
  Split,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  Layers,
  TableOfContents,
  Bookmark,
  XCircle,
  MapPin,
  Briefcase,
  PlusIcon,
} from "lucide-react";

// Hooks
import {
  useSousDirections,
  useCreateSousDirection,
  useUpdateSousDirection,
  useDeleteSousDirection,
} from "../../../hooks/useSousDirections";

import { useDirections } from "../../../hooks/useDirections";

import {
  useDivisions,
  useCreateDivision,
  useUpdateDivision,
  useDeleteDivision,
} from "../../../hooks/useDivisions";

import { useSections } from "../../../hooks/useSections";
import { getDivisionsBySousDirection } from "../../../api/division";
import { getSectionsByDivision } from "../../../api/section";
import { getFonctionsBySection } from "../../../api/fonction";

export default function SousDirectionPage() {
  const toast = useRef<Toast>(null);

  // ============================================
  // DATA FETCHING
  // ============================================
  const {
    data: allSousDirections = [],
    isLoading: isLoadingSousDirections,
    error: errorSousDirections,
    refetch: refetchSousDirections,
  } = useSousDirections();

  const {
    data: allDirections = [],
    isLoading: isLoadingDirections,
    error: errorDirections,
  } = useDirections();

  // ============================================
  // MUTATIONS
  // ============================================
  const createMutation = useCreateSousDirection();
  const updateMutation = useUpdateSousDirection();
  const deleteMutation = useDeleteSousDirection();

  const createDivisionMutation = useCreateDivision();
  const updateDivisionMutation = useUpdateDivision();
  const deleteDivisionMutation = useDeleteDivision();

  // ============================================
  // UI STATES
  // ============================================
  const [selectedSousDirection, setSelectedSousDirection] =
    useState<SousDirection | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(
    null,
  );

  // Modal visibility
  const [formVisible, setFormVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [ajoutFonctionVisible, setAjoutFonctionVisible] = useState(false);
  const [divisionFormVisible, setDivisionFormVisible] = useState(false);
  const [divisionAjoutFonctionVisible, setDivisionAjoutFonctionVisible] =
    useState(false);
  const [sectionAjoutFonctionVisible, setSectionAjoutFonctionVisible] =
    useState(false);

  // Editing states
  const [editing, setEditing] = useState<Partial<SousDirection> | null>(null);
  const [editingDivision, setEditingDivision] =
    useState<Partial<Division> | null>(null);
  const [isEditingDivision, setIsEditingDivision] = useState(false);

  // Accordion states
  const [expandedSousDirection, setExpandedSousDirection] = useState<
    number | null
  >(null);

  // Maps for storing children data
  const [divisionsMap, setDivisionsMap] = useState<Record<number, Division[]>>(
    {},
  );
  const [sectionsMap, setSectionsMap] = useState<Record<number, Section[]>>({});

  // Search and pagination
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // États pour les filtres
  const [selectedDirection, setSelectedDirection] = useState<string>("");

  // ============================================
  // DATA LOADING FUNCTIONS
  // ============================================
  const loadDivisions = async (sousDirectionId: number) => {
    if (divisionsMap[sousDirectionId]) return; // Déjà chargé

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
    if (sectionsMap[divisionId]) return; // Déjà chargé

    try {
      const data = await getSectionsByDivision(divisionId);
      const sections = Array.isArray(data) ? data : [];
      setSectionsMap((prev) => ({ ...prev, [divisionId]: sections }));
    } catch (err) {
      console.error("Erreur chargement sections", err);
      setSectionsMap((prev) => ({ ...prev, [divisionId]: [] }));
    }
  };

  // ============================================
  // TOGGLE FUNCTIONS
  // ============================================
  const toggleSousDirection = async (sousDirection: SousDirection) => {
    if (expandedSousDirection === sousDirection.id) {
      setExpandedSousDirection(null);
    } else {
      setExpandedSousDirection(sousDirection.id);
      await loadDivisions(sousDirection.id);
    }
  };

  // ============================================
  // HANDLERS - Sous-direction
  // ============================================
  const onEdit = async (payload: Partial<SousDirection>) => {
    if (!editing?.id) return;
    try {
      await updateMutation.mutateAsync({
        id: String(editing.id),
        data: payload,
      });
      toast.current?.show({
        severity: "success",
        summary: "Mis à jour",
        detail: "Sous-direction modifiée avec succès",
      });
      setEditing(null);
      setFormVisible(false);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Échec de mise à jour",
      });
    }
  };

  const onCreate = async (payload: Partial<SousDirection>) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Sous-direction créée avec succès",
      });
      setFormVisible(false);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Opération échouée",
      });
    }
  };

  const handleDelete = async (id: string) => {
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
          await deleteMutation.mutateAsync(id);
          toast.current?.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Sous-direction supprimée",
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
  // COMPOSANTS IMBRIQUÉS
  // ============================================

  // Composant Section avec ses fonctions
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
        const data = await getFonctionsBySection(section.id);
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
        {/* HEADER SECTION */}
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
                setSelectedDivision(division);
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
                <ChevronDown size={12} className="text-pink-600" />
              ) : (
                <ChevronRight size={12} className="text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* FONCTIONS DE LA SECTION */}
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

  // Composant Division avec ses sections
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
        {/* HEADER DIVISION */}
        <div className="flex items-center justify-between p-2 hover:bg-purple-50/30 transition-all">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-purple-100 text-purple-600">
              <Layers size={14} />
            </div>
            <div>
              <span className="text-gl font-medium text-slate-700">
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
                <ChevronDown size={14} className="text-purple-600" />
              ) : (
                <ChevronRight size={14} className="text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* SECTIONS DE LA DIVISION */}
        {expanded && (
          <div className="p-2 bg-slate-50/30 border-t border-slate-100 ml-4 space-y-2">
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

  // ============================================
  // FILTRAGE ET PAGINATION
  // ============================================
  const filtered = allSousDirections.filter((sd) => {
    const matchesSearch =
      (sd.libelle || "").toLowerCase().includes(query.toLowerCase()) ||
      (sd.code || "").toLowerCase().includes(query.toLowerCase());

    const matchesDirection = selectedDirection
      ? sd.direction_id === Number(selectedDirection)
      : true;

    return matchesSearch && matchesDirection;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // États de chargement/erreur
  const isLoading = isLoadingSousDirections || isLoadingDirections;
  const error = errorSousDirections || errorDirections;

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
            onClick={() => refetchSousDirections()}
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
            <Split size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Sous-directions
            </h1>
            <p className="text-slate-500 font-medium">
              Gestion hiérarchique des sous-directions
            </p>
          </div>
        </div>
        <Button
          label="Nouvelle sous-direction"
          icon={<Plus size={20} className="mr-2" />}
          className="bg-orange-700 hover:bg-orange-800 text-white border-none px-6 py-3 rounded-xl shadow-lg transition-all"
          onClick={() => {
            setEditing(null);
            setFormVisible(true);
          }}
        />
      </div>

      {/* Filtres et Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
              size={20}
            />
            <InputText
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none"
              placeholder="Rechercher une sous-direction..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none"
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value)}
            >
              <option value="">Toutes les directions</option>
              {allDirections.map((dir) => (
                <option key={dir.id} value={dir.id}>
                  {dir.libelle} ({dir.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ACCORDÉON LIST */}
      <div className="space-y-4">
        {paginated.length > 0 ? (
          paginated.map((sousDirection) => {
            const isExpanded = expandedSousDirection === sousDirection.id;
            const direction = allDirections.find(
              (d) => d.id === sousDirection.direction_id,
            );
            const divisions = divisionsMap[sousDirection.id] || [];

            return (
              <div
                key={sousDirection.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${
                  isExpanded
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-slate-100"
                }`}
              >
                {/* HEADER SOUS-DIRECTION */}
                <div
                  onClick={() => toggleSousDirection(sousDirection)}
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
                      <Split size={20} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-bold ${isExpanded ? "text-orange-800" : "text-slate-700"}`}
                        >
                          {sousDirection.libelle}
                        </h3>
                        {sousDirection.code && (
                          <span className="bg-slate-100 text-slate-600 px-4 py-0.5 rounded text-xs font-mono">
                            {sousDirection.code}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {direction && (
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-orange-400" />
                            <p className="text-xs text-slate-500">
                              {direction.libelle}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-slate-500 font-medium">
                          • {divisions.length} division(s)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSousDirection(sousDirection);
                        setDetailsVisible(true);
                      }}
                      className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                      title="Voir les détails"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSousDirection(sousDirection);
                        setAjoutFonctionVisible(true);
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                      title="Ajouter une fonction"
                    >
                      <PlusCircle size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(sousDirection);
                        setFormVisible(true);
                      }}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                      title="Modifier"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(String(sousDirection.id));
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

                {/* CONTENU DÉPLIÉ - DIVISIONS */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50/30">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Layers size={14} className="text-purple-500" />
                        Divisions rattachées ({divisions.length})
                      </h4>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDivision(null);
                          setIsEditingDivision(false);
                          setSelectedSousDirection(sousDirection);
                          setDivisionFormVisible(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 text-purple-600 font-bold bg-purple-50 hover:bg-purple-600 hover:text-white rounded-xl transition-all border-none"
                        tooltip="Ajouter une nouvelle division"
                      >
                        <PlusIcon size={16} />
                        <span className="text-xs font-bold">
                          Nouvelle division
                        </span>
                      </Button>
                    </div>

                    {divisions.length > 0 ? (
                      <div className="space-y-3">
                        {divisions.map((division) => (
                          <DivisionItem
                            key={division.id}
                            division={division}
                            sousDirection={sousDirection}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
                        <Layers
                          size={32}
                          className="mx-auto text-slate-300 mb-2"
                        />
                        <p className="text-xs text-slate-400 italic">
                          Aucune division rattachée
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
              <Split size={40} />
            </div>
            <p className="text-slate-400 font-medium">
              Aucune sous-direction trouvée.
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

      {/* Sous-direction Modals */}
      <SousDirectionForm
        visible={formVisible}
        onHide={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSubmit={editing ? onEdit : onCreate}
        refresh={() => refetchSousDirections()}
        initial={editing || undefined}
        directions={allDirections}
        title={
          editing ? "Modifier la sous-direction" : "Nouvelle sous-direction"
        }
      />

      <SousDirectionDetails
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        sousDirection={selectedSousDirection}
        directions={allDirections}
        toast={toast}
      />

      <SousDirectionAjoutFonction
        visible={ajoutFonctionVisible}
        onHide={() => setAjoutFonctionVisible(false)}
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
        sousDirections={allSousDirections}
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

      {/* Section Modal (juste pour ajouter fonction) */}
      <SectionAjoutFonction
        visible={sectionAjoutFonctionVisible}
        onHide={() => setSectionAjoutFonctionVisible(false)}
        section={null}
        onSuccess={() => {
          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Fonction ajoutée",
          });
        }}
      />
    </Layout>
  );
}
