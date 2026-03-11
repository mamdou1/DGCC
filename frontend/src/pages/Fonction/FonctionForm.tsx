import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import {
  Save,
  X,
  Briefcase,
  Building2,
  Split,
  TableOfContents,
  GitMerge,
  Map,
} from "lucide-react";
import type {
  Direction,
  SousDirection,
  Division,
  Section,
  Service,
  Fonction,
} from "../../interfaces";

type Props = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: Partial<Fonction>) => Promise<void>;
  initial?: Partial<Fonction> | null;
  directions: Direction[];
  sousDirections: SousDirection[];
  divisions: Division[];
  sections: Section[];
  services: Service[];
};

export default function FonctionForm({
  visible,
  onHide,
  onSubmit,
  initial,
  directions,
  sousDirections,
  divisions,
  sections,
  services,
}: Props) {
  const [libelle, setLibelle] = useState("");

  // États pour les entités
  const [direction_id, setDirection_id] = useState<number | undefined>();
  const [sous_direction_id, setSous_direction_id] = useState<
    number | undefined
  >();
  const [division_id, setDivision_id] = useState<number | undefined>();
  const [section_id, setSection_id] = useState<number | undefined>();
  const [service_id, setService_id] = useState<number | undefined>();

  const [loading, setLoading] = useState(false);

  // États pour les listes filtrées
  const [filteredSousDirections, setFilteredSousDirections] = useState<
    SousDirection[]
  >([]);
  const [filteredDivisions, setFilteredDivisions] = useState<Division[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  // Initialisation
  useEffect(() => {
    if (visible) {
      if (initial) {
        setLibelle(initial.libelle || "");
        setDirection_id(initial.direction_id);
        setSous_direction_id(initial.sous_direction_id);
        setDivision_id(initial.division_id);
        setSection_id(initial.section_id);
        setService_id(initial.service_id);
      } else {
        setLibelle("");
        setDirection_id(undefined);
        setSous_direction_id(undefined);
        setDivision_id(undefined);
        setSection_id(undefined);
        setService_id(undefined);
      }
    }
  }, [visible, initial]);

  // Filtrer les sous-directions quand la direction change
  useEffect(() => {
    if (direction_id) {
      const filtered = sousDirections.filter(
        (sd) => sd.direction_id === direction_id,
      );
      setFilteredSousDirections(filtered);
      setSous_direction_id(undefined);
      setDivision_id(undefined);
      setSection_id(undefined);
    } else {
      setFilteredSousDirections([]);
    }
  }, [direction_id, sousDirections]);

  // Filtrer les divisions quand la sous-direction change
  useEffect(() => {
    if (sous_direction_id) {
      const filtered = divisions.filter(
        (d) => d.sous_direction_id === sous_direction_id,
      );
      setFilteredDivisions(filtered);
      setDivision_id(undefined);
      setSection_id(undefined);
    } else {
      setFilteredDivisions([]);
    }
  }, [sous_direction_id, divisions]);

  // Filtrer les sections quand la division change
  useEffect(() => {
    if (division_id) {
      const filtered = sections.filter((s) => s.division_id === division_id);
      setFilteredSections(filtered);
      setSection_id(undefined);
    } else {
      setFilteredSections([]);
    }
  }, [division_id, sections]);

  // Filtrer les services quand la direction change
  useEffect(() => {
    if (direction_id) {
      const filtered = services.filter((s) => s.direction_id === direction_id);
      setFilteredServices(filtered);
      setService_id(undefined);
    } else {
      setFilteredServices([]);
    }
  }, [direction_id, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!libelle.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        libelle,
        direction_id,
        sous_direction_id,
        division_id,
        section_id,
        service_id,
      });
      onHide();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      showHeader={false}
      style={{ width: "700px" }}
      className="rounded-lg overflow-hidden shadow-2xl border-none"
      contentClassName="p-0 bg-white"
    >
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* HEADER */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-900 p-6 text-white">
            <button
              type="button"
              onClick={onHide}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Briefcase size={18} className="text-orange-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">
                {initial ? "Modification" : "Nouvelle fonction"}
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">
              {initial ? "Modifier la fonction" : "Créer une fonction"}
            </h2>
          </div>

          {/* CORPS */}
          <div className="p-6 space-y-5">
            {/* Libellé */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Libellé de la fonction <span className="text-red-500">*</span>
              </label>
              <InputText
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                placeholder="Ex: Chef de service, Directeur..."
                className="w-full p-4 bg-slate-50 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
            </div>

            {/* Directions */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Building2 size={12} className="text-orange-500" />
                Direction
              </label>
              <Dropdown
                value={direction_id}
                options={directions}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => setDirection_id(e.value)}
                placeholder="Sélectionner une direction"
                className="w-full border rounded-xl border-orange-300 focus:ring-2 focus:ring-orange-500"
                filter
                showClear
              />
            </div>

            {/* Sous-directions */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Split size={12} className="text-indigo-500" />
                Sous-direction
              </label>
              <Dropdown
                value={sous_direction_id}
                options={filteredSousDirections}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => setSous_direction_id(e.value)}
                placeholder="Sélectionner une sous-direction"
                className="w-full rounded-xl border border-orange-300"
                disabled={!direction_id}
                filter
                showClear
              />
            </div>

            {/* Divisions */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <TableOfContents size={12} className="text-blue-500" />
                Division
              </label>
              <Dropdown
                value={division_id}
                options={filteredDivisions}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => setDivision_id(e.value)}
                placeholder="Sélectionner une division"
                className="w-full rounded-xl border border-orange-300"
                disabled={!sous_direction_id}
                filter
                showClear
              />
            </div>

            {/* Sections */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <GitMerge size={12} className="text-purple-500" />
                Section
              </label>
              <Dropdown
                value={section_id}
                options={filteredSections}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => setSection_id(e.value)}
                placeholder="Sélectionner une section"
                className="w-full rounded-xl border border-orange-300"
                disabled={!division_id}
                filter
                showClear
              />
            </div>

            {/* Services */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Map size={12} className="text-orange-500" />
                Service
              </label>
              <Dropdown
                value={service_id}
                options={filteredServices}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => setService_id(e.value)}
                placeholder="Sélectionner un service"
                className="w-full rounded-xl border border-orange-300"
                disabled={!direction_id}
                filter
                showClear
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
            <Button
              type="button"
              label="Annuler"
              icon={<X size={16} />}
              onClick={onHide}
              className="p-button-text text-slate-500"
              disabled={loading}
            />
            <Button
              type="submit"
              label={
                loading ? "Enregistrement..." : initial ? "Modifier" : "Créer"
              }
              icon={<Save size={16} />}
              loading={loading}
              disabled={!libelle.trim()}
              className="bg-orange-600 text-white font-bold px-10 py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
}
