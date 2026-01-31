import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Save, PlusCircle, BookmarkPlus } from "lucide-react";
import { createFonction } from "../../../api/fonction";
import { Toast } from "primereact/toast";

export default function EntiteeTroisAjoutFonction({
  visible,
  onHide,
  entiteeTrois,
}: any) {
  const [libelle, setLibelle] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const handleSubmit = async () => {
    // Garde de sécurité : si pas d'entité ou pas de libellé, on s'arrête
    console.log("Tentative d'ajout :", { id: entiteeTrois?.id, libelle });

    if (!entiteeTrois?.id || !libelle.trim()) {
      console.warn("Bloqué par la garde : ID ou Libellé manquant");
      return;
    }
    setLoading(true);
    try {
      await createFonction({ libelle, entitee_trois_id: entiteeTrois.id });
      setLibelle("");
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: `Fonction ajoutée à ${entiteeTrois.libelle}`,
      });
      // Optionnel : fermer la modal après succès
      setTimeout(() => onHide(), 1500);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de créer la fonction",
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
          fonction à la {entiteeTrois?.titre}
        </div>
      }
      visible={visible}
      style={{ width: "450px" }}
      onHide={onHide}
      draggable={false}
    >
      <Toast ref={toast} />
      <div className="pt-4 space-y-5">
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">
            {entiteeTrois?.titre} cible
          </p>
          <p className="text-orange-900 font-bold">{entiteeTrois?.libelle}</p>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <BookmarkPlus size={16} className="text-purple-500" /> Libellé du
            poste
          </label>
          <InputText
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            placeholder="Ex: Technicien de surface"
          />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            label="Ajouter"
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-8 py-3 rounded-xl shadow-lg"
          />
        </div>
      </div>
    </Dialog>
  );
}
