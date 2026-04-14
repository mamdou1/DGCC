// pages/Service/ServiceForm.tsx
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Save, Briefcase, Hash, Info, Building2, Building } from "lucide-react";
import { Service, Direction } from "../../../interfaces";

type Props = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: Partial<Service>) => Promise<void>;
  refresh: () => void;
  initial?: Partial<Service>;
  directions: Direction[];
  title?: string;
};

export default function ServiceForm({
  visible,
  onHide,
  onSubmit,
  refresh,
  initial = {},
  directions,
  title = "Nouveau service",
}: Props) {
  //const [code, setCode] = useState("");
  const [libelle, setLibelle] = useState("");
  const [directionId, setDirectionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      //setCode(initial.code || "");
      setLibelle(initial.libelle || "");
      setDirectionId(initial.direction_id || null);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!libelle) return;

    setLoading(true);
    try {
      await onSubmit({
        //code,
        libelle,
        direction_id: directionId || undefined,
      });
      refresh();
      onHide();
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
          <div className="bg-dgcc12 p-2 rounded-lg">
            <Building size={20} className="text-dgcc5" />
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
            <Building2 size={16} className="text-dgcc6" /> Direction de
            rattachement
          </label>
          <Dropdown
            value={directionId}
            options={directions}
            onChange={(e) => setDirectionId(e.value)}
            optionLabel="libelle"
            optionValue="id"
            placeholder="Sélectionner une direction"
            className="w-full border-slate-200 rounded-xl"
          />
        </div>

        {/* <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <Hash size={16} className="text-dgcc6" /> Code
          </label>
          <InputText
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-dgcc6/10"
            placeholder="Ex: SERV-RH, SERV-INFO"
          />
        </div> */}

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <Info size={16} className="text-dgcc6" /> Libellé{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-dgcc6/10 outline-none"
            placeholder="Ex: Service Informatique"
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
            className="bg-dgcc5 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-dgcc3 transition-all"
          />
        </div>
      </div>
    </Dialog>
  );
}
