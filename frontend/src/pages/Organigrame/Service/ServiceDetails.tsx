// pages/Service/ServiceDetails.tsx
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Service, Direction, Fonction } from "../../../interfaces";
import { getFunctionsByService } from "../../../api/service";
import {
  Briefcase,
  Hash,
  Building2,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import ServiceAjoutFonction from "./ServiceAjoutFonction";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteFonctionById } from "../../../api/fonction";

export default function ServiceDetails({
  visible,
  onHide,
  service,
  directions,
  toast,
}: any) {
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [editing, setEditing] = useState<Partial<Fonction> | null>(null);
  const [ajoutFonctionVisible, setAjoutFonctionVisible] = useState(false);

  const direction = directions?.find(
    (d: Direction) => d.id === service?.direction_id,
  );

  const fetchFonctions = async () => {
    if (visible && service?.id) {
      try {
        const data = await getFunctionsByService(service.id);
        setFonctions(data);
      } catch (err) {
        console.error("Erreur lors du chargement des fonctions", err);
      }
    }
  };

  useEffect(() => {
    fetchFonctions();
  }, [visible, service]);

  const handleDelete = (id: number) => {
    confirmDialog({
      message: `Voulez-vous supprimer cette fonction définitivement ?`,
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
          await deleteFonctionById(id);
          toast.current?.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Fonction supprimée",
          });
          fetchFonctions();
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

  if (!service) return null;

  return (
    <>
      <Dialog
        header={
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <div className="bg-dgcc12 p-2 rounded-lg">
              <Briefcase size={18} className="text-dgcc5" />
            </div>
            <span>Détails du service</span>
          </div>
        }
        visible={visible}
        style={{ width: "600px" }}
        onHide={onHide}
        footer={
          <div className="flex justify-end p-2">
            <Button
              label="Fermer"
              onClick={onHide}
              className="bg-slate-800 text-white font-bold px-6 py-2 rounded-xl border-none hover:bg-slate-700 transition-all"
            />
          </div>
        }
      >
        <div className="pt-2 space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4">
            <p className="text-dgcc6 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              SERVICE
            </p>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              {service.libelle}
              <span className="text-slate-600 text-sm font-normal">
                {service.code}
              </span>
            </h2>
            {direction && (
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                <Building2 size={14} className="text-dgcc7" />
                <span>Rattaché à : {direction.libelle}</span>
              </div>
            )}
          </div>

          {/* Fonctions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Fonctions rattachées
              </p>
              <Button
                onClick={() => setAjoutFonctionVisible(true)}
                className="flex items-center gap-2 px-3 py-2 text-dgcc5 font-bold bg-dgcc13 hover:bg-dgcc5 hover:text-white rounded-lg transition-all border-none"
              >
                <PlusCircle size={15} />
                <span className="text-xs">Ajouter une fonction</span>
              </Button>
            </div>

            {fonctions.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse bg-white">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-3 text-[10px] font-black text-slate-400 uppercase w-12">
                        #
                      </th>
                      <th className="p-3 text-[10px] font-black text-slate-400 uppercase">
                        Libellé
                      </th>
                      <th className="p-3 text-[10px] font-black text-slate-400 uppercase text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {fonctions.map((f, index) => (
                      <tr
                        key={f.id}
                        className="hover:bg-dgcc13/30 transition-colors"
                      >
                        <td className="p-3">
                          <span className="text-xs font-bold text-slate-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Briefcase size={14} className="text-slate-300" />
                            <span className="text-sm font-bold text-slate-700">
                              {f.libelle}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditing(f);
                                setAjoutFonctionVisible(true);
                              }}
                              className="p-2 text-slate-400 hover:text-dgcc5 hover:bg-dgcc13 rounded-lg"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(f.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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

          {/* Code */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Hash size={15} className="text-slate-400" />
            <p className="text-[11px] text-slate-500 font-medium">
              Code :{" "}
              <span className="font-bold uppercase">
                {service.code || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </Dialog>

      <ServiceAjoutFonction
        visible={ajoutFonctionVisible}
        onHide={() => {
          setAjoutFonctionVisible(false);
          setEditing(null);
        }}
        service={service}
        editing={editing}
        onSuccess={() => {
          setAjoutFonctionVisible(false);
          setEditing(null);
          fetchFonctions();
          toast?.current?.show({
            severity: "success",
            summary: "Succès",
            detail: editing ? "Fonction modifiée" : "Fonction ajoutée",
          });
        }}
      />
    </>
  );
}
