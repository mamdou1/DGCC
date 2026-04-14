import { useEffect, useRef, useState, useMemo } from "react";
import {
  useInitialData,
  useCreateFonction,
  useUpdateFonction,
  useDeleteFonction,
} from "../../hooks/useFonctions";
import {
  Fonction,
  Direction,
  SousDirection,
  Division,
  Section,
  Service,
} from "../../interfaces";
import { Toast } from "primereact/toast";
import Layout from "../../components/layout/Layoutt";
import { Button } from "primereact/button";
import {
  Briefcase,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  GitMerge,
  Layers,
  Building2,
  Split,
  TableOfContents,
  Map,
} from "lucide-react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { confirmDialog } from "primereact/confirmdialog";
import Pagination from "../../components/layout/Pagination";
import FonctionForm from "./FonctionForm";
import FonctionDetails from "./FonctionDetails";

// Type pour les options de filtre
type FilterOption = {
  label: string;
  value: string | null;
  type?: "direction" | "sousDirection" | "division" | "section" | "service";
};

export default function FonctionPage() {
  const toast = useRef<Toast>(null);

  // Données initiales (mise à jour avec les nouvelles entités)
  const {
    fonctions = [],
    directions = [],
    sousDirections = [],
    divisions = [],
    sections = [],
    services = [],
    isLoading,
    error,
    refetch,
  } = useInitialData();

  console.log("🔍 fonctions chargées:", fonctions);
  console.log("🔍 isLoading:", isLoading);
  console.log("🔍 error:", error);

  // Mutations
  const createMutation = useCreateFonction();
  const updateMutation = useUpdateFonction();
  const deleteMutation = useDeleteFonction();

  // États UI
  const [query, setQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [editing, setEditing] = useState<Partial<Fonction> | null>(null);
  const [selectedFonction, setSelectedFonction] = useState<Fonction | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Fonction pour obtenir l'entité active d'une fonction
  const getActiveEntity = (fonction: Fonction) => {
    if (fonction.section) {
      return {
        niveau: "section",
        libelle: fonction.section.libelle,
        code: fonction.section.code,
        type: "Section",
        couleur: "bg-purple-100 text-purple-700 border-purple-200",
        icone: <GitMerge size={14} className="text-purple-600" />,
        parent: fonction.division,
        grandParent: fonction.sousDirection,
        arriereGrandParent: fonction.direction,
      };
    }
    if (fonction.division) {
      return {
        niveau: "division",
        libelle: fonction.division.libelle,
        code: fonction.division.code,
        type: "Division",
        couleur: "bg-blue-100 text-blue-700 border-blue-200",
        icone: <TableOfContents size={14} className="text-blue-600" />,
        parent: fonction.sousDirection,
        grandParent: fonction.direction,
        arriereGrandParent: null,
      };
    }
    if (fonction.sousDirection) {
      return {
        niveau: "sousDirection",
        libelle: fonction.sousDirection.libelle,
        code: fonction.sousDirection.code,
        type: "Sous-direction",
        couleur: "bg-indigo-100 text-indigo-700 border-indigo-200",
        icone: <Split size={14} className="text-indigo-600" />,
        parent: fonction.direction,
        grandParent: null,
        arriereGrandParent: null,
      };
    }
    if (fonction.direction) {
      return {
        niveau: "direction",
        libelle: fonction.direction.libelle,
        code: fonction.direction.code,
        type: "Direction",
        couleur: "bg-emearld-100 text-emearld-700 border-emearld-200",
        icone: <Building2 size={14} className="text-emearld-600" />,
        parent: null,
        grandParent: null,
        arriereGrandParent: null,
      };
    }
    if (fonction.service) {
      return {
        niveau: "service",
        libelle: fonction.service.libelle,
        code: fonction.service.code,
        type: "Service",
        couleur: "bg-dgcc12 text-dgcc3 border-dgcc9",
        icone: <Map size={14} className="text-dgcc5" />,
        parent: fonction.direction,
        grandParent: null,
        arriereGrandParent: null,
      };
    }
    return null;
  };

  // Options pour le filtre
  const filterOptions = useMemo<FilterOption[]>(() => {
    const options: FilterOption[] = [
      { label: "Toutes les fonctions", value: null },
    ];

    directions.forEach((d: Direction) => {
      options.push({
        label: `🏢 ${d.libelle}`,
        value: `DIR-${d.id}`,
        type: "direction",
      });
    });

    sousDirections.forEach((sd: SousDirection) => {
      options.push({
        label: `📂 ${sd.libelle}`,
        value: `SD-${sd.id}`,
        type: "sousDirection",
      });
    });

    divisions.forEach((d: Division) => {
      options.push({
        label: `📁 ${d.libelle}`,
        value: `DIV-${d.id}`,
        type: "division",
      });
    });

    sections.forEach((s: Section) => {
      options.push({
        label: `📄 ${s.libelle}`,
        value: `SEC-${s.id}`,
        type: "section",
      });
    });

    services.forEach((s: Service) => {
      options.push({
        label: `🛠️ ${s.libelle}`,
        value: `SERV-${s.id}`,
        type: "service",
      });
    });

    return options;
  }, [directions, sousDirections, divisions, sections, services]);

  // Filtrage
  const filteredFonctions = useMemo<Fonction[]>(() => {
    let filtered = fonctions;

    // Filtre par recherche textuelle
    if (query) {
      filtered = filtered.filter((f: Fonction) =>
        f.libelle.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // Filtre par entité
    if (selectedFilter) {
      const [prefix, idStr] = selectedFilter.split("-");
      const id = parseInt(idStr, 10);

      filtered = filtered.filter((f: Fonction) => {
        if (prefix === "DIR") return f.direction_id === id;
        if (prefix === "SD") return f.sous_direction_id === id;
        if (prefix === "DIV") return f.division_id === id;
        if (prefix === "SEC") return f.section_id === id;
        if (prefix === "SERV") return f.service_id === id;
        return true;
      });
    }

    return filtered;
  }, [fonctions, query, selectedFilter]);

  // Pagination
  const paginatedFonctions = useMemo<Fonction[]>(() => {
    return filteredFonctions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredFonctions, currentPage, itemsPerPage]);

  // Handlers
  const handleCreate = async (data: Partial<Fonction>): Promise<void> => {
    try {
      await createMutation.mutateAsync(data);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Fonction créée avec succès",
      });
      setFormVisible(false);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de la création",
      });
    }
  };

  const handleUpdate = async (data: Partial<Fonction>): Promise<void> => {
    if (!editing?.id) return;
    try {
      await updateMutation.mutateAsync({ id: editing.id, data });
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Fonction mise à jour",
      });
      setEditing(null);
      setFormVisible(false);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de la modification",
      });
    }
  };

  const handleDelete = (id: number): void => {
    confirmDialog({
      message: "Voulez-vous supprimer cette fonction définitivement ?",
      header: "Confirmation",
      icon: "pi pi-info-circle text-red-500",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      acceptClassName:
        "p-button-danger bg-red-500 text-white p-button-raised p-button-rounded p-2",
      rejectClassName:
        "p-button-secondary p-button-outlined p-button-rounded mr-4 p-2",
      style: { width: "450px" },
      accept: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          toast.current?.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Fonction supprimée",
          });
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: "Échec de la suppression",
          });
        }
      },
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dgcc5"></div>
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
          <div className="bg-dgcc5 p-3 rounded-2xl text-white shadow-lg shadow-dgcc12">
            <Briefcase size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Fonctions
            </h1>
            <p className="text-slate-500 font-medium">
              Gérez les fonctions et postes ({fonctions.length})
            </p>
          </div>
        </div>
        <Button
          label="Nouvelle fonction"
          icon={<Plus size={20} className="mr-2" />}
          className="bg-dgcc5 hover:bg-dgcc3 text-white border-none px-6 py-3 rounded-xl shadow-lg transition-all"
          onClick={() => {
            setEditing(null);
            setFormVisible(true);
          }}
        />
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <InputText
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            placeholder="Rechercher une fonction..."
            value={query}
          />
        </div>
        <Dropdown
          value={selectedFilter}
          onChange={(e: { value: string | null }) => setSelectedFilter(e.value)}
          options={filterOptions}
          placeholder="Filtrer par entité"
          className="w-64 bg-slate-50 border-slate-200 rounded-xl"
          showClear
          filter
          itemTemplate={(option) => (
            <div className="flex items-center gap-2">
              {option.type === "direction" && (
                <Building2 size={14} className="text-emerald-600" />
              )}
              {option.type === "sousDirection" && (
                <Split size={14} className="text-indigo-600" />
              )}
              {option.type === "division" && (
                <TableOfContents size={14} className="text-blue-600" />
              )}
              {option.type === "section" && (
                <GitMerge size={14} className="text-purple-600" />
              )}
              {option.type === "service" && (
                <Map size={14} className="text-dgcc5" />
              )}
              <span>{option.label}</span>
            </div>
          )}
        />
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Libellé</th>
              <th className="px-6 py-4">Affectation</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedFonctions.map((f: Fonction) => (
              <tr
                key={f.id}
                onClick={() => {
                  setSelectedFonction(f);
                  setDetailsVisible(true);
                }}
                className="cursor-pointer hover:bg-dgcc13/30 transition-all group"
              >
                <td className="px-6 py-4">
                  <span className="bg-dgcc13 text-dgcc3 px-3 py-1 rounded-lg font-mono font-bold text-xs border border-dgcc12">
                    #{String(f.id).padStart(3, "0")}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Briefcase
                      size={16}
                      className="text-slate-300 group-hover:text-dgcc8"
                    />
                    {f.libelle}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const activeEntity = getActiveEntity(f);
                    if (!activeEntity) {
                      return (
                        <span className="text-slate-400 text-xs">
                          Non affecté
                        </span>
                      );
                    }

                    return (
                      <div className="space-y-1">
                        {/* Entité active */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 ${activeEntity.couleur} text-[10px] font-bold rounded-lg border`}
                        >
                          {activeEntity.icone}
                          {activeEntity.libelle}
                          {activeEntity.code && (
                            <span className="ml-1 text-[8px] font-mono bg-white/50 px-1 rounded">
                              {activeEntity.code}
                            </span>
                          )}
                        </span>

                        {/* Hiérarchie */}
                        <div className="text-[9px] text-slate-400 mt-1">
                          {activeEntity.parent && (
                            <span className="mr-1">
                              {activeEntity.parent.libelle}
                            </span>
                          )}
                          {activeEntity.grandParent && (
                            <>
                              <span className="mx-1">←</span>
                              <span>{activeEntity.grandParent.libelle}</span>
                            </>
                          )}
                          {activeEntity.arriereGrandParent && (
                            <>
                              <span className="mx-1">←</span>
                              <span>
                                {activeEntity.arriereGrandParent.libelle}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setSelectedFonction(f);
                        setDetailsVisible(true);
                      }}
                      className="p-3 text-slate-400 hover:text-dgcc5 hover:bg-white hover:shadow-md rounded-xl transition-all"
                      title="Voir détails"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setEditing(f);
                        setFormVisible(true);
                      }}
                      className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all"
                      title="Modifier"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDelete(f.id);
                      }}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredFonctions.length === 0 && (
          <div className="text-center py-20">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-medium">
              Aucune fonction trouvée
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredFonctions.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <FonctionForm
        visible={formVisible}
        onHide={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSubmit={editing ? handleUpdate : handleCreate}
        initial={editing}
        directions={directions}
        sousDirections={sousDirections}
        divisions={divisions}
        sections={sections}
        services={services}
      />

      <FonctionDetails
        visible={detailsVisible}
        onHide={() => {
          setDetailsVisible(false);
          setSelectedFonction(null);
        }}
        fonction={selectedFonction}
      />
    </Layout>
  );
}
