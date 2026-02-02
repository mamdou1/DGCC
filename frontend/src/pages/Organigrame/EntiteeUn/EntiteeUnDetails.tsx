import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import {
  Fonction,
  EntiteeUn,
  EntiteeDeux,
  EntiteeTrois,
} from "../../../interfaces";
import {
  getEntiteeDeuxByEntiteeUn,
  createEntiteeDeux,
} from "../../../api/entiteeDeux";
import EntiteeDeuxForm from "../EntiteeDeux/EntiteeDeuxForm";
import { getEntiteeTroisByEntiteeDeux } from "../../../api/entiteeTrois";
import { getFunctionsByEntiteeUn } from "../../../api/entiteeUn";
import {
  Bookmark,
  Hash,
  Calendar,
  Briefcase,
  PlusCircle,
  Layers,
  ChevronDown,
  ChevronRight,
  GitMerge,
  Pencil,
  Trash2,
} from "lucide-react";
import EntiteeUnAjoutFonction from "./EntiteeUnAjoutFonction";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteFonctionById } from "../../../api/fonction";

export default function EntiteeUnDetails({
  visible,
  onHide,
  entiteeUn,
  toast,
}: any) {
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [editing, setEditing] = useState<Partial<Fonction> | null>(null);
  const [entiteeDeux, setEntiteeDeux] = useState<EntiteeDeux[]>([]);
  const [entiteeTroisMap, setEntiteeTroisMap] = useState<
    Record<number, EntiteeTrois[]>
  >({});
  const [expexpandedEntiteeDeux, setExpexpandedEntiteeDeux] = useState<
    number | null
  >(null);

  const [selected, setSelected] = useState<EntiteeUn[]>([]);
  const [ajoutFonctionVisible, setAjoutFonctionVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [allEntitee, setAllEntiteeDeux] = useState<EntiteeDeux[]>([]);
  const [selectedEntiteeUn, setSelectedEntiteeUn] = useState<EntiteeUn | null>(
    null,
  );

  // 1. Charger les fonctions et les divisions au montage
  const fetchData = async () => {
    if (visible && entiteeUn?.id) {
      try {
        // Chargement parallèle des fonctions et divisions
        const [funcData, divData] = await Promise.all([
          getFunctionsByEntiteeUn(entiteeUn.id),
          getEntiteeDeuxByEntiteeUn(entiteeUn.id),
        ]);

        setFonctions(funcData);
        setEntiteeDeux(Array.isArray(divData) ? divData : []);
      } catch (err) {
        console.error("Erreur lors du chargement des données", err);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // Reset de l'accordéon à la fermeture/ouverture
    setExpexpandedEntiteeDeux(null);
    setEntiteeTroisMap({});
  }, [visible, entiteeUn]);

  // 2. Fonction pour ouvrir une division et charger ses sections
  const toggleEntiteeDeux = async (entiteeDeuxId: number) => {
    if (expexpandedEntiteeDeux === entiteeDeuxId) {
      setExpexpandedEntiteeDeux(null);
      return;
    }

    setExpexpandedEntiteeDeux(entiteeDeuxId);

    // Charger les sections seulement si on ne les a pas déjà en mémoire
    if (!entiteeTroisMap[entiteeDeuxId]) {
      try {
        const data = await getEntiteeTroisByEntiteeDeux(entiteeDeuxId);
        setEntiteeTroisMap((prev) => ({
          ...prev,
          [entiteeDeuxId]: Array.isArray(data) ? data : [],
        }));
        console.log("Les sections : ", data);
      } catch (err) {
        console.error("Erreur chargement sections", err);
      }
    }
  };

  const onCreate = async (payload: Partial<EntiteeDeux>) => {
    try {
      const saved = await createEntiteeDeux(payload);
      setAllEntiteeDeux((s) => [saved, ...s]);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Division créé",
      });
      setFormVisible(false);
    } catch (err: any) {
      // toast.current?.show({
      //   severity: "error",
      //   summary: "Erreur",
      //   detail: "Échec de création",
      // });
    }
  };

  const handleDelete = (id: number) => {
    confirmDialog({
      message: "Voulez-vous vraiment supprimer cette fonction ?",
      header: "Confirmation de suppression",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteFonctionById(id);
          toast.current?.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Fonction supprimée avec succès",
          });
          fetchData(); // Rafraîchir la liste
        } catch (err) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: "Impossible de supprimer la fonction",
          });
        }
      },
    });
  };

  if (!entiteeUn) return null;

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Bookmark size={18} className="text-emerald-600" />
          </div>
          <span>Détails du {entiteeUn.titre}</span>
        </div>
      }
      visible={visible}
      style={{ width: "700px" }}
      onHide={onHide}
      draggable={false}
      footer={
        <div className="flex justify-end p-2">
          <Button
            label="Fermer"
            onClick={onHide}
            className="bg-slate-800 text-white font-bold px-6 py-2 rounded-xl border-none hover:bg-slate-700 transition-all shadow-md"
          />
        </div>
      }
    >
      <div className="pt-2 space-y-6">
        {/* Header EntiteeUn */}
        <div className="border-b border-slate-100 pb-4">
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Département / {entiteeUn.titre}
          </p>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            {entiteeUn.libelle}
            <span className="text-slate-600 text-sm font-normal">
              {entiteeUn.code_entiteeUn}
            </span>
          </h2>
        </div>

        {/* Tableau des Fonctions (Inchangé) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Fonctions de {entiteeUn.titre}
              </p>
              {/* <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 ml-2 py-0.5 rounded-full shadow-sm">
                {fonctions.length} Total
              </span> */}
            </div>

            <Button
              onClick={(e) => {
                setSelected(entiteeUn);
                setAjoutFonctionVisible(true);
                e.stopPropagation();
              }}
              className="flex items-center gap-2 px-3 py-2 text-emerald-600 font-bold bg-emerald-50 hover:text-white hover:bg-emerald-500 rounded-lg transition-all border-none"
            >
              <PlusCircle size={15} />
              <span className="text-xs">Ajouter une fonction</span>
            </Button>
          </div>

          {fonctions.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Libellé
                    </th>
                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">
                      Création
                    </th>
                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fonctions.map((f, index) => (
                    <tr
                      key={f.id}
                      className="group hover:bg-emerald-50/30 transition-colors"
                    >
                      <td className="p-3">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Briefcase
                            size={14}
                            className="text-slate-300 group-hover:text-emerald-400"
                          />
                          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">
                            {f.libelle}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-medium">
                          <Calendar size={12} />
                          {f.createdAt
                            ? new Date(f.createdAt).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              setEditing(f); // f est l'objet fonction de votre map
                              setAjoutFonctionVisible(true);
                              e.stopPropagation();
                            }}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              handleDelete(f.id);
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
          ) : (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm italic">
                Aucune fonction rattachée
              </p>
            </div>
          )}
        </div>

        {/* --- SECTION ACCORDÉON (Remplacement de l'ancienne div infos complémentaires) --- */}
        <div className="space-y-3">
          <div className="justify-between px-1 flex">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              {/* Remplace "Divisions et Sections" par les titres dynamiques */}
              {entiteeUn.entiteeDeux?.titre || "Niveau 2"} et{" "}
              {entiteeUn.entiteeDeux?.entiteeTrois?.titre || "Niveau 3"}{" "}
              rattachés
            </p>
            <Button
              onClick={(e) => {
                setSelectedEntiteeUn(entiteeUn);
                setFormVisible(true);
                e.stopPropagation();
              }}
              className="flex items-center gap-2 px-3 py-2 text-orange-600 font-bold bg-orange-50 hover:text-white hover:bg-orange-500 rounded-lg transition-all border-none"
            >
              <PlusCircle size={15} />
              <span className="text-xs">
                {/* Dynamisation du bouton d'ajout */}
                Ajouter une {entiteeUn.entiteeDeux?.titre || "Division"}
              </span>
            </Button>
          </div>

          <div className="space-y-2">
            {entiteeDeux.length > 0 ? (
              entiteeDeux.map((div) => (
                <div
                  key={div.id}
                  className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  <button
                    onClick={() => toggleEntiteeDeux(div.id)}
                    className={`w-full flex items-center justify-between p-4 transition-all ${
                      expexpandedEntiteeDeux === div.id
                        ? "bg-emerald-50/50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          expexpandedEntiteeDeux === div.id
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Layers size={16} />
                      </div>
                      <span
                        className={`font-bold text-sm ${
                          expexpandedEntiteeDeux === div.id
                            ? "text-emerald-700"
                            : "text-slate-700"
                        }`}
                      >
                        {div.libelle}
                      </span>
                    </div>
                    {expexpandedEntiteeDeux === div.id ? (
                      <ChevronDown size={18} className="text-emerald-500" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-400" />
                    )}
                  </button>

                  {expexpandedEntiteeDeux === div.id && (
                    <div className="p-3 bg-slate-50/30 border-t border-slate-50 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {entiteeTroisMap[div.id]?.length ? (
                        entiteeTroisMap[div.id].map((sec) => (
                          <div
                            key={sec.id}
                            className="flex items-center gap-3 ml-8 p-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                          >
                            <GitMerge size={14} className="text-slate-300" />
                            <span className="font-medium">{sec.libelle}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 italic ml-12 py-2">
                          {/* Libellé dynamique si vide */}
                          Aucun(e){" "}
                          {entiteeUn.entiteeDeux?.entiteeTrois?.titre ||
                            "Section"}{" "}
                          dans ce/cette{" "}
                          {entiteeUn.entiteeDeux?.titre || "Division"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm italic">
                  Aucun(e) {entiteeUn.entiteeDeux?.titre || "Division"}{" "}
                  trouvé(e)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info (optionnel, repositionné) */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Hash size={15} className="text-slate-400" />
          <p className="text-[11px] text-slate-500 font-medium">
            Rattaché à :{" "}
            <span className="font-bold uppercase">
              {entiteeUn?.libelle || "Direction Générale"}
            </span>
          </p>
        </div>
      </div>

      <EntiteeUnAjoutFonction
        visible={ajoutFonctionVisible}
        onHide={() => {
          setAjoutFonctionVisible(false);
          setEditing(null); // Très important : vider l'édition à la fermeture
        }}
        entiteeUn={entiteeUn}
        editing={editing} // Passer l'état editing
        onSuccess={() => {
          setAjoutFonctionVisible(false);
          setEditing(null);
          fetchData(); // Rafraîchir tout
          toast?.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Fonction ajoutée au entiteeUn",
          });
        }}
      />
      <EntiteeDeuxForm
        visible={formVisible}
        onHide={() => setFormVisible(false)}
        onSubmit={onCreate}
        entiteeUn={selectedEntiteeUn ? [selectedEntiteeUn] : []} // On passe la liste chargée ici
      />
    </Dialog>
  );
}
