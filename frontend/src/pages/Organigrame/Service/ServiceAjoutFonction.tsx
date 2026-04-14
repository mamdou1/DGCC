// pages/Service/ServiceAjoutFonction.tsx
import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Save, PlusCircle, BookmarkPlus } from "lucide-react";
import { createFonction, updateFonctionById } from "../../../api/fonction";
import { Toast } from "primereact/toast";

export default function ServiceAjoutFonction({
  visible,
  onHide,
  service,
  refresh,
  editing,
}: any) {
  const [libelle, setLibelle] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (editing) {
      setLibelle(editing.libelle);
    } else {
      setLibelle("");
    }
  }, [editing, visible]);

  const handleSubmit = async () => {
    if (!libelle || !service?.id) {
      toast.current?.show({
        severity: "warn",
        summary: "Attention",
        detail: "Le libellé est requis",
      });
      return;
    }

    setLoading(true);
    try {
      if (editing?.id) {
        await updateFonctionById(editing.id, { libelle });
        toast.current?.show({
          severity: "success",
          summary: "Mise à jour réussie",
          detail: "Fonction modifiée",
        });
      } else {
        await createFonction({
          libelle,
          service_id: service.id,
        });
        toast.current?.show({
          severity: "success",
          summary: "Création réussie",
          detail: "Fonction ajoutée",
        });
      }

      setLibelle("");
      setTimeout(() => {
        refresh();
        onHide();
      }, 500);
    } catch (error) {
      console.error("Erreur lors de l'opération", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <PlusCircle size={20} className="text-dgcc6" />
            <span>
              {editing ? "Modifier" : "Ajouter"} une fonction au service
            </span>
          </div>
        }
        visible={visible}
        style={{ width: "450px" }}
        onHide={() => {
          setLibelle("");
          onHide();
        }}
      >
        <div className="pt-4 space-y-5">
          <div className="bg-dgcc13 p-4 rounded-xl border border-dgcc12">
            <p className="text-[10px] font-bold text-dgcc7 uppercase mb-1">
              Service sélectionné
            </p>
            <p className="text-dgcc12 font-bold">{service?.libelle}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <BookmarkPlus size={16} className="text-dgcc6" />
              Nom de la fonction
            </label>
            <InputText
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              placeholder="Ex: Chef de service, Responsable..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button
              label="Annuler"
              onClick={onHide}
              className="p-button-text text-slate-500 font-semibold"
            />
            <Button
              label={
                loading ? "Enregistrement..." : editing ? "Modifier" : "Ajouter"
              }
              icon={!loading && <Save size={18} className="mr-2" />}
              onClick={handleSubmit}
              disabled={!libelle || loading}
              className="bg-dgcc5 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-dgcc3 transition-all"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
