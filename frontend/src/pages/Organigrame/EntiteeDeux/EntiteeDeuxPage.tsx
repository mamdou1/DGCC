import { useEffect, useRef, useState } from "react";
import Layout from "../../../components/layout/Layoutt";
import EntiteeDeuxDetails from "./EntiteeDeuxDetails";
import EntiteeDeuxForm from "./EntiteeDeuxForm";
import EntiteeDeuxAjoutFonction from "./EntiteeDeuxAjoutFonction";
import { EntiteeDeux, EntiteeUn } from "../../../interfaces";
import { confirmDialog } from "primereact/confirmdialog";
import {
  getAllEntiteeDeux,
  createEntiteeDeux,
  updateEntiteeDeuxById,
  deleteEntiteeDeuxById,
} from "../../../api/entiteeDeux";
import { getAllEntiteeUn } from "../../../api/entiteeUn";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import Pagination from "../../../components/layout/Pagination";
import { InputText } from "primereact/inputtext";
import {
  Layers,
  Plus,
  Search,
  Eye,
  Pencil,
  PlusCircle,
  Building2,
  Trash2,
} from "lucide-react";

export default function EntiteeDeuxPage() {
  const [allEntiteedeux, setAllEntiteedeux] = useState<EntiteeDeux[]>([]);
  const [allEntiteeUn, setAllEntiteeUn] = useState<EntiteeUn[]>([]);
  const [selected, setSelected] = useState<EntiteeDeux | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [ajoutFonctionVisible, setAjoutFonctionVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<EntiteeDeux> | null>(null);
  const toast = useRef<Toast>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchEntiteeDeux = async () => {
    setLoading(true);
    try {
      // Note: Vous pouvez créer une route getAllDivisions ou boucler.
      // Ici, on suppose une route /api/divisions qui retourne tout avec include Service
      const [div, serv] = await Promise.all([
        getAllEntiteeDeux(),
        getAllEntiteeUn(),
      ]);
      setAllEntiteedeux(Array.isArray(div) ? div : []);
      setAllEntiteeUn(Array.isArray(serv) ? serv : []);

      console.log("Services récupérés:", serv);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Chargement échoué",
      });
    } finally {
      setLoading(false);
    }
  };

  const onEdit = async (payload: Partial<EntiteeUn>) => {
    if (!editing?.id) return;
    try {
      const updated = await updateEntiteeDeuxById(editing.id, payload);
      setAllEntiteedeux((s) =>
        s.map((it) => (it.id === updated.id ? updated : it)),
      );
      toast.current?.show({
        severity: "success",
        summary: "Mis à jour",
        detail: " modifié",
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
      message: "Voulez-vous le supprimer définitivement ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteEntiteeDeuxById(id);
          setAllEntiteedeux((s) =>
            s.filter((x) => Number(x.id) !== Number(id)),
          );
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

  useEffect(() => {
    fetchEntiteeDeux();
  }, []);

  const onCreate = async (payload: Partial<EntiteeDeux>) => {
    try {
      const saved = await createEntiteeDeux(payload);
      setAllEntiteedeux((s) => [saved, ...s]);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: " créé",
      });
      //setFormVisible(false);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de création",
      });
    }
  };

  // Filtrage :
  // 1. On exclut les éléments où le code ET le libellé sont absents (null ou vide)
  // 2. On applique la recherche sur le libellé
  const filtered = allEntiteedeux.filter((s) => {
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-800 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {allEntiteedeux[0]?.titre}
            </h1>
            <p className="text-slate-500 font-medium">
              Gestion des pôles par {allEntiteedeux[0]?.titre}
            </p>
          </div>
        </div>
        <Button
          label={`Nouvelle ${allEntiteedeux[0]?.titre}`}
          icon={<Plus size={20} className="mr-2" />}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-none px-6 py-3 rounded-xl shadow-lg transition-all"
          onClick={() => setFormVisible(true)}
        />
      </div>

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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Libellé</th>
              <th className="px-6 py-4">Structure parent de rattachement</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((d: any) => (
              <tr
                key={d.id}
                onClick={() => {
                  setSelected(d);
                  setDetailsVisible(true);
                }}
                className="hover:bg-emerald-50/30 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 font-mono text-sm font-bold text-emerald-700">
                  {d.code || "---"}
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">
                  {d.libelle}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-slate-500 italic text-sm">
                    <Building2 size={14} />{" "}
                    {allEntiteeUn.find((un) => un.id === d.entitee_un_id)
                      ?.libelle || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelected(d);
                        setDetailsVisible(true);
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        setSelected(d);
                        setAjoutFonctionVisible(true);
                        e.stopPropagation();
                      }}
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                      title="Ajouter une fonction"
                    >
                      <PlusCircle size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        setEditing(d);
                        setFormVisible(true);
                        e.stopPropagation();
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        handleDelete(String(d.id)!);
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
      </div>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filtered.length}
        onPageChange={setCurrentPage}
      />
      <EntiteeDeuxForm
        visible={formVisible}
        onHide={() => setFormVisible(false)}
        onSubmit={editing ? onEdit : onCreate}
        initial={editing || undefined}
        title={
          editing
            ? `Modifier ${allEntiteedeux[0]?.titre}`
            : `Créer ${allEntiteedeux[0]?.titre}`
        }
        entiteeUn={allEntiteeUn}
      />

      <EntiteeDeuxAjoutFonction
        visible={ajoutFonctionVisible}
        onHide={() => setAjoutFonctionVisible(false)}
        entiteeDeux={selected}
      />
      <EntiteeDeuxDetails
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        entiteeDeux={selected}
        entiteeUn={allEntiteeUn}
      />
    </Layout>
  );
}
