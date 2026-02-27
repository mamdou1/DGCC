// pages/Division/DivisionForm.tsx
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Save, Layers, Hash, Info, MapPin } from "lucide-react";
import { Division, SousDirection } from "../../../interfaces";

type Props = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: Partial<Division>) => Promise<void>;
  refresh: () => void;
  initial?: Partial<Division>;
  sousDirections: SousDirection[];
  title?: string;
};

export default function DivisionForm({
  visible,
  onHide,
  onSubmit,
  refresh,
  initial = {},
  sousDirections,
  title = "Nouvelle division",
}: Props) {
  //const [code, setCode] = useState("");
  const [libelle, setLibelle] = useState("");
  const [sousDirectionId, setSousDirectionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      //setCode(initial.code || "");
      setLibelle(initial.libelle || "");
      setSousDirectionId(initial.sous_direction_id || null);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!libelle) return;

    setLoading(true);
    try {
      await onSubmit({
        //code,
        libelle,
        sous_direction_id: sousDirectionId || undefined,
      });
      console.log("le libelle:", libelle);

      refresh();
      //onHide();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Layers size={20} className="text-orange-600" />
          </div>
          <span>{title}</span>
        </div>
      }
      visible={visible}
      style={{ width: "500px" }}
      onHide={onHide}
      draggable={false}
    >
      <div className="pt-4 space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <MapPin size={16} className="text-orange-500" /> Sous-direction de
            rattachement
          </label>
          <Dropdown
            value={sousDirectionId}
            options={sousDirections}
            onChange={(e) => setSousDirectionId(e.value)}
            optionLabel="libelle"
            optionValue="id"
            placeholder="Sélectionner une sous-direction"
            className="w-full border-slate-200 rounded-xl"
          />
        </div>

        {/* <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <Hash size={16} className="text-orange-500" /> Code
          </label>
          <InputText
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10"
            placeholder="Ex: DIV-RH, DIV-FIN"
          />
        </div> */}

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <Info size={16} className="text-orange-500" /> Libellé{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none"
            placeholder="Ex: Division Administration du Personnel"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            label="Annuler"
            onClick={onHide}
            className="p-button-text text-slate-500 font-semibold"
          />
          <Button
            label={loading ? "Enregistrement..." : "Enregistrer"}
            icon={!loading && <Save size={18} className="mr-2" />}
            onClick={handleSubmit}
            disabled={!libelle || loading}
            className="bg-orange-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-orange-700 transition-all"
          />
        </div>
      </div>
    </Dialog>
  );
}
