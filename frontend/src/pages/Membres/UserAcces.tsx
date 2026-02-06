import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Save, Building2, Layers, GitMerge } from "lucide-react";

import { getAllEntiteeUn } from "../../api/entiteeUn";
import { getAllEntiteeDeux } from "../../api/entiteeDeux";
import { getAllEntiteeTrois } from "../../api/entiteeTrois";
import { EntiteeDeux, EntiteeTrois, EntiteeUn } from "../../interfaces";

type Props = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (payload: any[]) => Promise<void>;
  agentId: number;
  initial?: any;
  title?: string;
};

export default function UserAcces({
  visible,
  onHide,
  onSubmit,
  agentId,
  initial = {},
  title = "Gestion des accès",
}: Props) {
  const [formData, setFormData] = useState({
    entites_un_id: [] as number[],
    entites_deux_id: [] as number[],
    entites_trois_id: [] as number[],
  });

  const [options, setOptions] = useState({
    n1: [] as EntiteeUn[],
    n2: [] as EntiteeDeux[],
    n3: [] as EntiteeTrois[],
  });

  const [loading, setLoading] = useState(false);

  // Chargement des options
  useEffect(() => {
    if (visible) {
      const loadData = async () => {
        try {
          const [r1, r2, r3] = await Promise.all([
            getAllEntiteeUn(),
            getAllEntiteeDeux(),
            getAllEntiteeTrois(),
          ]);
          setOptions({
            n1: Array.isArray(r1) ? r1 : [],
            n2: Array.isArray(r2) ? r2 : [],
            n3: Array.isArray(r3) ? r3 : [],
          });
        } catch (err) {
          console.error("Erreur options:", err);
        }
      };
      loadData();
    }
  }, [visible]);

  // Initialisation du formulaire (Edit vs Create)
  useEffect(() => {
    if (visible && initial?.id) {
      setFormData({
        entites_un_id: initial.entites_un?.map((e: any) => e.id) || [],
        entites_deux_id: initial.entites_deux?.map((e: any) => e.id) || [],
        entites_trois_id: initial.entites_trois?.map((e: any) => e.id) || [],
      });
    } else {
      setFormData({
        entites_un_id: [],
        entites_deux_id: [],
        entites_trois_id: [],
      });
    }
  }, [visible, initial]);

  const handleSubmit = async () => {
    const payload: any[] = [];

    formData.entites_un_id.forEach((id) =>
      payload.push({ agent_id: agentId, entitee_type: "UN", entitee_id: id }),
    );
    formData.entites_deux_id.forEach((id) =>
      payload.push({ agent_id: agentId, entitee_type: "DEUX", entitee_id: id }),
    );
    formData.entites_trois_id.forEach((id) =>
      payload.push({
        agent_id: agentId,
        entitee_type: "TROIS",
        entitee_id: id,
      }),
    );

    await onSubmit(payload);
    onHide();
  };

  // Styles réutilisables
  const labelStyle =
    "text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2";
  const inputWrapper = "flex flex-col gap-1";

  return (
    <Dialog
      header={
        <div className="text-xl font-black text-slate-800 px-2">{title}</div>
      }
      visible={visible}
      style={{ width: "700px" }}
      onHide={onHide}
      className="rounded-[2rem] overflow-hidden"
      footer={
        <div className="flex justify-end gap-3 p-6 bg-slate-50/80">
          <Button
            label="Annuler"
            onClick={onHide}
            className="p-button-text text-slate-400 font-bold"
          />
          <Button
            label={loading ? "Enregistrement..." : "Sauvegarder"}
            icon={!loading && <Save size={18} className="mr-2" />}
            onClick={handleSubmit}
            loading={loading}
            className="bg-emerald-600 text-emerald-50 border-none px-8 py-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pt-4 px-2">
        <hr className="border-slate-100" />

        {/* Section Affectations Multiples */}
        <div className="space-y-5 bg-slate-100/40 p-5 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-tighter mb-4">
            Périmètres d'application
          </h3>

          <div className={inputWrapper}>
            <label className={labelStyle}>
              <Building2 size={14} /> Ministères (Niveau 1)
            </label>
            <MultiSelect
              value={formData.entites_un_id}
              options={options.n1}
              optionLabel="libelle"
              optionValue="id"
              onChange={(e) =>
                setFormData({ ...formData, entites_un_id: e.value })
              }
              placeholder="Sélectionner les ministères"
              display="chip"
              filter
              className="w-full border border-emerald-200 rounded-xl hover:border-emerald-400"
            />
          </div>

          <div className={inputWrapper}>
            <label className={labelStyle}>
              <Layers size={14} /> Directions (Niveau 2)
            </label>
            <MultiSelect
              value={formData.entites_deux_id}
              options={options.n2}
              optionLabel="libelle"
              optionValue="id"
              onChange={(e) =>
                setFormData({ ...formData, entites_deux_id: e.value })
              }
              placeholder="Sélectionner les directions"
              display="chip"
              filter
              className="w-full border border-emerald-200 rounded-xl hover:border-emerald-400"
            />
          </div>

          <div className={inputWrapper}>
            <label className={labelStyle}>
              <GitMerge size={14} /> Services (Niveau 3)
            </label>
            <MultiSelect
              value={formData.entites_trois_id}
              options={options.n3}
              optionLabel="libelle"
              optionValue="id"
              onChange={(e) =>
                setFormData({ ...formData, entites_trois_id: e.value })
              }
              placeholder="Sélectionner les services"
              display="chip"
              filter
              className="w-full border border-emerald-200 rounded-xl hover:border-emerald-400"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
