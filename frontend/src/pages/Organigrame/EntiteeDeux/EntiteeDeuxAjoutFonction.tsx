import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Save, PlusCircle, BookmarkPlus } from "lucide-react";
import { createFonction } from "../../../api/fonction";
import { Toast } from "primereact/toast";

export default function EntiteeDeuxAjoutFonction({
  visible,
  onHide,
  entiteeDeux,
}: any) {
  const [libelle, setLibelle] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  if (!entiteeDeux) return null;

  const handleSubmit = async () => {
    if (!libelle) return;
    setLoading(true);
    try {
      await createFonction({ libelle, entitee_deux_id: entiteeDeux.id });
      setLibelle("");
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: " Créé aves succès",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <PlusCircle className="text-purple-500" size={20} /> Ajouter une
          fonction à la {entiteeDeux.titre}
        </div>
      }
      visible={visible}
      style={{ width: "450px" }}
      onHide={onHide}
      draggable={false}
    >
      <div className="pt-4 space-y-5">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
            cible
            {entiteeDeux.titre}
          </p>
          <p className="text-emerald-900 font-bold">{entiteeDeux?.libelle}</p>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <BookmarkPlus size={16} className="text-purple-500" /> Nom de la
            fonction
          </label>
          <InputText
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl outline-none"
          />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            label="Annuler"
            onClick={onHide}
            className="p-button-text text-slate-500 font-semibold"
          />
          <Button
            label={loading ? "Ajout..." : "Ajouter la fonction"}
            icon={!loading && <Save size={18} className="mr-2" />}
            onClick={handleSubmit}
            disabled={!libelle || loading}
            className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 hover:bg-emerald-700 transition-all"
          />
        </div>
      </div>
    </Dialog>
  );
}
