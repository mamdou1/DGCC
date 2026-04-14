// pages/Service/ServicePage.tsx
import { useRef, useState } from "react";
import Layout from "../../../components/layout/Layoutt";
import ServiceDetails from "./ServiceDetails";
import ServiceForm from "./ServiceForm";
import ServiceAjoutFonction from "./ServiceAjoutFonction";
import { Direction, Service } from "../../../interfaces";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import Pagination from "../../../components/layout/Pagination";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
import {
  Briefcase,
  Plus,
  Search,
  Eye,
  PlusCircle,
  Building2,
  Trash2,
  Pencil,
  XCircle,
  Building,
} from "lucide-react";

// Hooks
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "../../../hooks/useServices";

import { useDirections } from "../../../hooks/useDirections";

export default function ServicePage() {
  const toast = useRef<Toast>(null);

  // Data fetching
  const {
    data: allServices = [],
    isLoading: isLoadingServices,
    error: errorServices,
    refetch: refetchServices,
  } = useServices();

  const {
    data: allDirections = [],
    isLoading: isLoadingDirections,
    error: errorDirections,
    refetch: refetchDirections,
  } = useDirections();

  // Mutations
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // UI States
  const [selected, setSelected] = useState<Service | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [ajoutFonctionVisible, setAjoutFonctionVisible] = useState(false);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Handlers
  const onEdit = async (payload: Partial<Service>) => {
    if (!editing?.id) return;
    try {
      await updateMutation.mutateAsync({
        id: String(editing.id),
        data: payload,
      });
      toast.current?.show({
        severity: "success",
        summary: "Mis à jour",
        detail: "Service modifié",
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

  const handleDelete = async (id: string) => {
    confirmDialog({
      message: `Voulez-vous supprimer ce service définitivement ? Cette action est irréversible.`,
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
            detail: "Service supprimé",
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

  const onCreate = async (payload: Partial<Service>) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Service créé",
      });
      setFormVisible(false);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: err?.response?.data?.message || "Échec de création",
      });
    }
  };

  // Filtrage
  const filtered = allServices.filter((s) => {
    const isPopulated = s.code !== null && s.libelle !== null;
    if (!isPopulated) return false;
    return (s.libelle || s.code || "")
      .toLowerCase()
      .includes(query.toLowerCase());
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // États de chargement/erreur
  const isLoading = isLoadingServices || isLoadingDirections;
  const error = errorServices || errorDirections;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dgcc5"></div>
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
            onClick={() => {
              refetchServices();
              refetchDirections();
            }}
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
          <div className="bg-dgcc2 p-3 rounded-2xl text-white shadow-lg shadow-dgcc13">
            <Building size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Services
            </h1>
            <p className="text-slate-500 font-medium">
              Gestion des services de l'organisation
            </p>
          </div>
        </div>
        <Button
          label="Nouveau service"
          icon={<Plus size={20} className="mr-2" />}
          className="bg-dgcc3 hover:bg-dgcc2 text-white border-none px-6 py-3 rounded-xl shadow-lg transition-all"
          onClick={() => {
            setEditing(null);
            setFormVisible(true);
          }}
        />
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="relative group max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-dgcc6 transition-colors"
            size={20}
          />
          <InputText
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-4 focus:ring-dgcc6/10 outline-none"
            placeholder="Rechercher un service..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Code service</th>
              <th className="px-6 py-4">Libellé</th>
              <th className="px-6 py-4">Direction parente</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((service) => (
              <tr
                key={service.id}
                onClick={() => {
                  setSelected(service);
                  setDetailsVisible(true);
                }}
                className="hover:bg-dgcc13/30 transition-all group cursor-pointer"
              >
                <td className="px-6 py-4 font-mono text-sm font-bold text-dgcc3">
                  {service.code || "---"}
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">
                  {service.libelle}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-slate-500 italic text-sm">
                    <Building2 size={14} />{" "}
                    {service.direction?.libelle || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(service);
                        setDetailsVisible(true);
                      }}
                      className="p-2 text-slate-400 hover:text-dgcc5 hover:bg-dgcc13 rounded-lg"
                      title="Voir les détails"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(service);
                        setAjoutFonctionVisible(true);
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      title="Ajouter une fonction"
                    >
                      <PlusCircle size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(service);
                        setFormVisible(true);
                      }}
                      className="p-2 text-dgcc5 hover:bg-dgcc13 rounded-lg transition-all"
                      title="Modifier"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(String(service.id));
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filtered.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <ServiceForm
        visible={formVisible}
        onHide={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSubmit={editing ? onEdit : onCreate}
        refresh={() => {}} // Plus besoin de refresh avec React Query
        initial={editing || undefined}
        title={editing ? "Modifier le service" : "Créer un nouveau service"}
        directions={allDirections}
      />

      <ServiceAjoutFonction
        visible={ajoutFonctionVisible}
        onHide={() => setAjoutFonctionVisible(false)}
        service={selected}
      />

      <ServiceDetails
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        service={selected}
        directions={allDirections}
        toast={toast}
      />
    </Layout>
  );
}
