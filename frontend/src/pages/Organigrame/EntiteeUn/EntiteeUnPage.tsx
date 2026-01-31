import { useEffect, useRef, useState } from "react";
import Layout from "../../../components/layout/Layoutt";
import EntiteeUnDetails from "./EntiteeUnDetails";
import EntiteeUnForm from "./EntiteeUnForm";
import EntiteeUnAjoutFonction from "./EntiteeUnAjoutFonction";
import { EntiteeUn } from "../../../interfaces";
import { confirmDialog } from "primereact/confirmdialog";

import {
  getAllEntiteeUn,
  createEntiteeUn,
  updateEntiteeUnById,
  deleteEntiteeUnById,
} from "../../../api/entiteeUn";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import Pagination from "../../../components/layout/Pagination";
import { InputText } from "primereact/inputtext";
import {
  Briefcase,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { log } from "console";

export default function EntiteeUnPage() {
  const [allEntiteeUn, setAllEntiteeUn] = useState<EntiteeUn[]>([]);
  const [selected, setSelected] = useState<EntiteeUn | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [ajoutFonctionVisible, setAjoutFonctionVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<EntiteeUn> | null>(null);
  const toast = useRef<Toast>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchEntiteeUn = async () => {
    setLoading(true);
    try {
      const data = await getAllEntiteeUn();
      setAllEntiteeUn(Array.isArray(data) ? data : data.entiteeUn || []);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de charger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntiteeUn();
  }, []);

  const onEdit = async (payload: Partial<EntiteeUn>) => {
    if (!editing?.id) return;
    try {
      const updated = await updateEntiteeUnById(editing.id, payload);
      setAllEntiteeUn((s) =>
        s.map((it) => (it.id === updated.id ? updated : it)),
      );
      console.log(updated);

      toast.current?.show({
        severity: "success",
        summary: "Mis à jour",
        detail: "Programme modifié",
      });
      setEditing(null);
      setFormVisible(false);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de mise à jour",
      });
    }
  };

  const handleDelete = async (id: string) => {
    confirmDialog({
      message: "Voulez-vous supprimer ce programme définitivement ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteEntiteeUnById(id);
          setAllEntiteeUn((s) => s.filter((x) => Number(x.id) !== Number(id)));
          toast.current?.show({
            severity: "success",
            summary: "Supprimé",
            detail: " supprimé",
          });
        } catch (err: any) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: "Suppression impossible",
          });
        }
      },
    });
  };

  const onCreate = async (payload: Partial<EntiteeUn>) => {
    console.log("Création avec payload:", payload); // <-- Log avant l'appel API
    try {
      const data = await createEntiteeUn(payload);
      console.log("Réponse API:", data);
      setAllEntiteeUn((s) => [data, ...s]);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Créé avec succès",
      });
      console.log("data envoyer: ", data);
      fetchEntiteeUn();

      //setFormVisible(false);
    } catch (err: any) {
      console.error("Erreur complète:", err);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Opération échouée",
      });
    }
  };

  // Filtrage :
  // 1. On exclut les éléments où le code ET le libellé sont absents (null ou vide)
  // 2. On applique la recherche sur le libellé
  const filtered = allEntiteeUn.filter((s) => {
    // Vérifie si l'élément est valide (a au moins un code ou un libellé)
    const isPopulated = s.code !== null && s.libelle !== null;

    if (!isPopulated) return false;

    // Applique la recherche textuelle
    return (s.libelle || "").toLowerCase().includes(query.toLowerCase());
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Layout>
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
            <Briefcase size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {allEntiteeUn[0]?.titre || "Chargement..."}
            </h1>
            <p className="text-slate-500 font-medium">
              Gestion des {allEntiteeUn[0]?.titre.toLowerCase()}s
            </p>
          </div>
        </div>
        <Button
          label={`Nouveau ${allEntiteeUn[0]?.titre || "Élément"}`}
          icon={<Plus size={20} className="mr-2" />}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-none px-6 py-3 rounded-xl shadow-lg transition-all"
          onClick={() => setFormVisible(true)}
        />
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="relative group max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
            size={20}
          />
          <InputText
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none"
            placeholder="Rechercher ..."
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
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Libellé</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((s) => (
              <tr
                key={s.id}
                onClick={() => {
                  setSelected(s);
                  setDetailsVisible(true);
                }}
                className="hover:bg-emerald-50/30 transition-all group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono text-xs">
                    {s.code}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">
                  {s.libelle}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(s);
                        setAjoutFonctionVisible(true);
                      }}
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      title="Ajouter une fonction"
                    >
                      <PlusCircle size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelected(s);
                        setDetailsVisible(true);
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        setEditing(s);
                        setFormVisible(true);
                        e.stopPropagation();
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        handleDelete(String(s.id)!);
                        e.stopPropagation();
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="p-12 text-center text-slate-400">Chargement...</div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filtered.length}
          onPageChange={setCurrentPage}
        />
      </div>
      <EntiteeUnForm
        visible={formVisible}
        onHide={() => setFormVisible(false)}
        onSubmit={editing ? onEdit : onCreate}
        initial={editing || undefined}
      />
      <EntiteeUnDetails
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        entiteeUn={selected}
      />
      <EntiteeUnAjoutFonction
        visible={ajoutFonctionVisible}
        onHide={() => setAjoutFonctionVisible(false)}
        entiteeUn={selected}
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
