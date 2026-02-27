import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import {
  Save,
  Building2,
  Layers,
  GitMerge,
  Split,
  TableOfContents,
  Briefcase,
} from "lucide-react";

// Importer les nouvelles API
import { getDirections } from "../../api/direction";
import { getSousDirections } from "../../api/sousDirection";
import { getDivisions } from "../../api/division";
import { getSections } from "../../api/section";
import { getServices } from "../../api/service";

// Types pour les nouvelles entités
import {
  Direction,
  SousDirection,
  Division,
  Section,
  Service,
  AgentEntiteeAccess,
} from "../../interfaces";

type Props = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (payload: any[]) => Promise<void>;
  agentId: number;
  initial?: AgentEntiteeAccess[];
  title?: string;
};

// Interface pour le payload de création multiple (avec nouvelles entités)
interface GrantAccessPayload {
  agent_id: number;
  direction_id?: number | null;
  sous_direction_id?: number | null;
  division_id?: number | null;
  section_id?: number | null;
  service_id?: number | null;
  // Garder les anciennes pour compatibilité
  entitee_un_id?: number | null;
  entitee_deux_id?: number | null;
  entitee_trois_id?: number | null;
}

export default function UserAcces({
  visible,
  onHide,
  onSubmit,
  agentId,
  initial = [],
  title = "Gestion des accès",
}: Props) {
  const [formData, setFormData] = useState({
    directions_id: [] as number[],
    sous_directions_id: [] as number[],
    divisions_id: [] as number[],
    sections_id: [] as number[],
    services_id: [] as number[],
  });

  const [options, setOptions] = useState({
    directions: [] as Direction[],
    sousDirections: [] as SousDirection[],
    divisions: [] as Division[],
    sections: [] as Section[],
    services: [] as Service[],
  });

  const [loading, setLoading] = useState(false);

  // Chargement des options
  useEffect(() => {
    let isMounted = true;

    if (visible) {
      const loadData = async () => {
        try {
          const [dirs, sousDirs, divs, secs, servs] = await Promise.all([
            getDirections(),
            getSousDirections(),
            getDivisions(),
            getSections(),
            getServices(),
          ]);

          if (isMounted) {
            setOptions({
              directions: Array.isArray(dirs) ? dirs : [],
              sousDirections: Array.isArray(sousDirs) ? sousDirs : [],
              divisions: Array.isArray(divs) ? divs : [],
              sections: Array.isArray(secs) ? secs : [],
              services: Array.isArray(servs) ? servs : [],
            });
          }
        } catch (err) {
          console.error("Erreur options:", err);
        }
      };
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [visible]);

  // Initialisation du formulaire avec les données existantes
  useEffect(() => {
    if (visible) {
      if (initial && initial.length > 0) {
        // Mode édition - Extraire les IDs des nouvelles entités
        const directionIds = initial
          .filter(
            (
              acc,
            ): acc is AgentEntiteeAccess & {
              direction: NonNullable<AgentEntiteeAccess["direction"]>;
            } => !!acc.direction,
          )
          .map((acc) => acc.direction!.id)
          .filter((id, index, self) => self.indexOf(id) === index);

        const sousDirectionIds = initial
          .filter(
            (
              acc,
            ): acc is AgentEntiteeAccess & {
              sousDirection: NonNullable<AgentEntiteeAccess["sousDirection"]>;
            } => !!acc.sousDirection,
          )
          .map((acc) => acc.sousDirection!.id)
          .filter((id, index, self) => self.indexOf(id) === index);

        const divisionIds = initial
          .filter(
            (
              acc,
            ): acc is AgentEntiteeAccess & {
              division: NonNullable<AgentEntiteeAccess["division"]>;
            } => !!acc.division,
          )
          .map((acc) => acc.division!.id)
          .filter((id, index, self) => self.indexOf(id) === index);

        const sectionIds = initial
          .filter(
            (
              acc,
            ): acc is AgentEntiteeAccess & {
              section: NonNullable<AgentEntiteeAccess["section"]>;
            } => !!acc.section,
          )
          .map((acc) => acc.section!.id)
          .filter((id, index, self) => self.indexOf(id) === index);

        const serviceIds = initial
          .filter(
            (
              acc,
            ): acc is AgentEntiteeAccess & {
              service: NonNullable<AgentEntiteeAccess["service"]>;
            } => !!acc.service,
          )
          .map((acc) => acc.service!.id)
          .filter((id, index, self) => self.indexOf(id) === index);

        setFormData({
          directions_id: directionIds,
          sous_directions_id: sousDirectionIds,
          divisions_id: divisionIds,
          sections_id: sectionIds,
          services_id: serviceIds,
        });
      } else {
        // Mode création
        setFormData({
          directions_id: [],
          sous_directions_id: [],
          divisions_id: [],
          sections_id: [],
          services_id: [],
        });
      }
    }
  }, [visible, initial]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload: GrantAccessPayload[] = [];

      // Ajouter les accès Directions
      formData.directions_id.forEach((id) => {
        payload.push({
          agent_id: agentId,
          direction_id: id,
          sous_direction_id: null,
          division_id: null,
          section_id: null,
          service_id: null,
        });
      });

      // Ajouter les accès Sous-directions
      formData.sous_directions_id.forEach((id) => {
        payload.push({
          agent_id: agentId,
          direction_id: null,
          sous_direction_id: id,
          division_id: null,
          section_id: null,
          service_id: null,
        });
      });

      // Ajouter les accès Divisions
      formData.divisions_id.forEach((id) => {
        payload.push({
          agent_id: agentId,
          direction_id: null,
          sous_direction_id: null,
          division_id: id,
          section_id: null,
          service_id: null,
        });
      });

      // Ajouter les accès Sections
      formData.sections_id.forEach((id) => {
        payload.push({
          agent_id: agentId,
          direction_id: null,
          sous_direction_id: null,
          division_id: null,
          section_id: id,
          service_id: null,
        });
      });

      // Ajouter les accès Services
      formData.services_id.forEach((id) => {
        payload.push({
          agent_id: agentId,
          direction_id: null,
          sous_direction_id: null,
          division_id: null,
          section_id: null,
          service_id: id,
        });
      });

      await onSubmit(payload);
      onHide();
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer le total des sélections
  const totalSelections =
    formData.directions_id.length +
    formData.sous_directions_id.length +
    formData.divisions_id.length +
    formData.sections_id.length +
    formData.services_id.length;

  // Styles réutilisables
  const labelStyle =
    "text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2";
  const inputWrapper = "flex flex-col gap-1";

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 leading-none">
              {title}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {initial.length > 0
                ? `Modification des accès (${initial.length} existant(s))`
                : "Configurer les accès aux entités"}
            </p>
          </div>
        </div>
      }
      visible={visible}
      style={{ width: "800px" }}
      onHide={onHide}
      className="rounded-[2rem] overflow-hidden"
      footer={
        <div className="flex justify-end gap-3 p-6 bg-slate-50/80">
          <Button
            label="Annuler"
            onClick={onHide}
            className="p-button-text text-slate-400 font-bold hover:bg-slate-200"
            disabled={loading}
          />
          <Button
            label={loading ? "Enregistrement..." : "Sauvegarder"}
            icon={!loading && <Save size={18} className="mr-2" />}
            onClick={handleSubmit}
            loading={loading}
            disabled={totalSelections === 0}
            className="bg-orange-600 text-orange-50 border-none px-8 py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all font-bold"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pt-4 px-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {/* Message d'info */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <p className="text-xs text-amber-800 flex items-center gap-2">
            <span className="font-bold">📌 Note :</span>
            Les accès sélectionnés seront attribués à l'agent. Vous pouvez
            choisir plusieurs entités de différents niveaux.
          </p>
        </div>

        {/* Section Affectations Multiples */}
        <div className="space-y-5 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-black uppercase text-orange-600 tracking-tighter mb-4 flex items-center gap-2">
            <Building2 size={14} />
            Périmètres d'application
          </h3>

          {/* Directions */}
          <div className={inputWrapper}>
            <label className={labelStyle}>
              <Building2 size={14} className="text-blue-500" />
              Directions
              {formData.directions_id.length > 0 && (
                <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {formData.directions_id.length} sélectionnée(s)
                </span>
              )}
            </label>
            <MultiSelect
              value={formData.directions_id}
              options={options.directions}
              optionLabel="libelle"
              optionValue="id"
              onChange={(e) =>
                setFormData({ ...formData, directions_id: e.value })
              }
              placeholder="Sélectionner les directions"
              display="chip"
              filter
              className="w-full border border-slate-200 rounded-xl hover:border-orange-400 transition-all"
              maxSelectedLabels={3}
            />
          </div>

          {/* Sous-directions */}
          <div className={inputWrapper}>
            <label className={labelStyle}>
              <Split size={14} className="text-purple-500" />
              Sous-directions
              {formData.sous_directions_id.length > 0 && (
                <span className="ml-2 text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {formData.sous_directions_id.length} sélectionnée(s)
                </span>
              )}
            </label>
            <MultiSelect
              value={formData.sous_directions_id}
              options={options.sousDirections}
              optionLabel="libelle"
              optionValue="id"
              onChange={(e) =>
                setFormData({ ...formData, sous_directions_id: e.value })
              }
              placeholder="Sélectionner les sous-directions"
              display="chip"
              filter
              className="w-full border border-slate-200 rounded-xl hover:border-orange-400 transition-all"
              maxSelectedLabels={3}
            />
          </div>

          {/* Divisions */}
          <div className={inputWrapper}>
            <label className={labelStyle}>
              <TableOfContents size={14} className="text-indigo-500" />
              Divisions
              {formData.divisions_id.length > 0 && (
                <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  {formData.divisions_id.length} sélectionnée(s)
                </span>
              )}
            </label>
            <MultiSelect
              value={formData.divisions_id}
              options={options.divisions}
              optionLabel="libelle"
              optionValue="id"
              onChange={(e) =>
                setFormData({ ...formData, divisions_id: e.value })
              }
              placeholder="Sélectionner les divisions"
              display="chip"
              filter
              className="w-full border border-slate-200 rounded-xl hover:border-orange-400 transition-all"
              maxSelectedLabels={3}
            />
          </div>

          {/* Sections */}
          <div className={inputWrapper}>
            <label className={labelStyle}>
              <GitMerge size={14} className="text-orange-500" />
              Sections
              {formData.sections_id.length > 0 && (
                <span className="ml-2 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  {formData.sections_id.length} sélectionnée(s)
                </span>
              )}
            </label>
            <MultiSelect
              value={formData.sections_id}
              options={options.sections}
              optionLabel="libelle"
              optionValue="id"
              onChange={(e) =>
                setFormData({ ...formData, sections_id: e.value })
              }
              placeholder="Sélectionner les sections"
              display="chip"
              filter
              className="w-full border border-slate-200 rounded-xl hover:border-orange-400 transition-all"
              maxSelectedLabels={3}
            />
          </div>

          {/* Services */}
          <div className={inputWrapper}>
            <label className={labelStyle}>
              <Briefcase size={14} className="text-emerald-500" />
              Services
              {formData.services_id.length > 0 && (
                <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  {formData.services_id.length} sélectionnée(s)
                </span>
              )}
            </label>
            <MultiSelect
              value={formData.services_id}
              options={options.services}
              optionLabel="libelle"
              optionValue="id"
              onChange={(e) =>
                setFormData({ ...formData, services_id: e.value })
              }
              placeholder="Sélectionner les services"
              display="chip"
              filter
              className="w-full border border-slate-200 rounded-xl hover:border-orange-400 transition-all"
              maxSelectedLabels={3}
            />
          </div>

          {/* Résumé des sélections */}
          {totalSelections > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="text-[11px] font-bold text-orange-700 flex items-center gap-2">
                <span>📋 Récapitulatif</span>
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {formData.directions_id.length > 0 &&
                  `${formData.directions_id.length} Direction(s) `}
                {formData.sous_directions_id.length > 0 &&
                  `${formData.sous_directions_id.length} Sous-direction(s) `}
                {formData.divisions_id.length > 0 &&
                  `${formData.divisions_id.length} Division(s) `}
                {formData.sections_id.length > 0 &&
                  `${formData.sections_id.length} Section(s) `}
                {formData.services_id.length > 0 &&
                  `${formData.services_id.length} Service(s) `}
                <span className="ml-2 text-orange-500">•</span>
                <span className="ml-2 font-bold">
                  Total: {totalSelections} accès
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </Dialog>
  );
}
