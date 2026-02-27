// DocumentTypeAffectationForm.tsx
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import {
  Building2,
  Layers,
  GitMerge,
  Save,
  Split,
  Briefcase,
  TableOfContents,
} from "lucide-react";
import { getDirections } from "../../api/direction";
import { getServicesByDirection } from "../../api/service";
import { getSousDirectionsByDirection } from "../../api/sousDirection"; // ← CHANGÉ ICI !
import { getDivisionsBySousDirection } from "../../api/division";
import { getSectionsByDivision } from "../../api/section";

export default function DocumentTypeAffectationForm({
  visible,
  onHide,
  onSubmit,
  initial,
  title,
}: any) {
  const [loading, setLoading] = useState(false);

  // États pour les IDs sélectionnés
  const [direction_id, setDirection_id] = useState<number | undefined>();
  const [service_id, setService_id] = useState<number | undefined>();
  const [sous_direction_id, setSous_direction_id] = useState<
    number | undefined
  >();
  const [division_id, setDivision_id] = useState<number | undefined>();
  const [section_id, setSection_id] = useState<number | undefined>();

  // États pour les listes déroulantes
  const [allDirections, setAllDirections] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [allSousDirections, setAllSousDirections] = useState<any[]>([]);
  const [allDivisions, setAllDivisions] = useState<any[]>([]);
  const [allSections, setAllSections] = useState<any[]>([]);

  // États pour suivre quel chemin est choisi
  const [selectedPath, setSelectedPath] = useState<
    "direction-service" | "sousdirection-division-section" | null
  >(null);

  // Charger les directions au montage
  useEffect(() => {
    const fetchInitialData = async () => {
      const dirs = await getDirections();
      setAllDirections(Array.isArray(dirs) ? dirs : []);

      // ❌ NE PLUS CHARGER TOUTES LES SOUS-DIRECTIONS ICI
      // Les sous-directions seront chargées quand une direction sera sélectionnée
    };
    fetchInitialData();
  }, []);

  // Charger les données d'édition
  useEffect(() => {
    const loadEditData = async () => {
      if (visible && initial?.id) {
        // Logique d'édition...
        if (initial.direction_id) {
          setDirection_id(initial.direction_id);
          setSelectedPath("direction-service");

          // Charger les services
          const services = await getServicesByDirection(initial.direction_id);
          setAllServices(Array.isArray(services) ? services : []);

          // ✅ Charger les sous-directions de cette direction
          const sousDirections = await getSousDirectionsByDirection(
            initial.direction_id,
          );
          setAllSousDirections(
            Array.isArray(sousDirections) ? sousDirections : [],
          );
        }
        if (initial.service_id) {
          setService_id(initial.service_id);
        }
        if (initial.sous_direction_id) {
          setSous_direction_id(initial.sous_direction_id);
          setSelectedPath("sousdirection-division-section");
          const divisions = await getDivisionsBySousDirection(
            initial.sous_direction_id,
          );
          setAllDivisions(Array.isArray(divisions) ? divisions : []);
        }
        if (initial.division_id) {
          setDivision_id(initial.division_id);
          const sections = await getSectionsByDivision(initial.division_id);
          setAllSections(Array.isArray(sections) ? sections : []);
        }
        if (initial.section_id) {
          setSection_id(initial.section_id);
        }
      } else if (visible) {
        // Reset
        setDirection_id(undefined);
        setService_id(undefined);
        setSous_direction_id(undefined);
        setDivision_id(undefined);
        setSection_id(undefined);
        setSelectedPath(null);
        setAllServices([]);
        setAllSousDirections([]);
        setAllDivisions([]);
        setAllSections([]);
      }
    };
    loadEditData();
  }, [visible, initial]);

  // Handlers pour le chemin Direction → Service
  const handleDirectionChange = async (id: number) => {
    setDirection_id(id);
    setService_id(undefined);
    setSelectedPath("direction-service");

    // Charger les services de cette direction
    const services = await getServicesByDirection(id);
    setAllServices(Array.isArray(services) ? services : []);

    // ✅ Charger les sous-directions de cette direction
    const sousDirections = await getSousDirectionsByDirection(id);
    setAllSousDirections(Array.isArray(sousDirections) ? sousDirections : []);

    // Réinitialiser l'autre chemin
    setSous_direction_id(undefined);
    setDivision_id(undefined);
    setSection_id(undefined);
    setAllDivisions([]);
    setAllSections([]);
  };

  // Handlers pour le chemin Sous-direction → Division → Section
  const handleSousDirectionChange = async (id: number) => {
    setSous_direction_id(id);
    setDivision_id(undefined);
    setSection_id(undefined);
    setSelectedPath("sousdirection-division-section");

    // ✅ Réinitialiser l'autre chemin
    setDirection_id(undefined);
    setService_id(undefined);
    setAllServices([]);
    setAllSousDirections([]); // ← IMPORTANT : vider les sous-directions

    // Charger les divisions de cette sous-direction
    const divisions = await getDivisionsBySousDirection(id);
    setAllDivisions(Array.isArray(divisions) ? divisions : []);
  };

  const handleDivisionChange = async (id: number) => {
    setDivision_id(id);
    setSection_id(undefined);

    // Charger les sections de cette division
    const sections = await getSectionsByDivision(id);
    setAllSections(Array.isArray(sections) ? sections : []);
  };

  const onSave = async () => {
    setLoading(true);

    // Construire le payload selon le chemin choisi
    const payload: any = {};

    if (selectedPath === "direction-service") {
      payload.direction_id = direction_id;
      payload.service_id = service_id;
      // L'entité cible est le service si sélectionné, sinon la direction
      payload.entitee_cible_id = service_id || direction_id;
      payload.entitee_cible_type = service_id ? "service" : "direction";
    } else if (selectedPath === "sousdirection-division-section") {
      payload.sous_direction_id = sous_direction_id;
      payload.division_id = division_id;
      payload.section_id = section_id;
      // L'entité cible est la plus précise : section > division > sous-direction
      payload.entitee_cible_id = section_id || division_id || sous_direction_id;
      payload.entitee_cible_type = section_id
        ? "section"
        : division_id
          ? "division"
          : "sousDirection";
    }

    await onSubmit(payload);
    setLoading(false);
  };

  // Trouver la sous-direction sélectionnée pour l'affichage
  const selectedSousDirection = allSousDirections.find(
    (sd) => sd.id === sous_direction_id,
  );

  return (
    <Dialog
      header={
        <div className="text-xl font-bold flex items-center gap-2">
          <GitMerge className="text-orange-600" />{" "}
          {title || "Affectation à une entité"}
        </div>
      }
      visible={visible}
      style={{ width: 550 }}
      onHide={onHide}
      footer={
        <div className="p-4">
          <Button
            label="Appliquer l'affectation"
            icon={<Save className="mr-2" size={18} />}
            onClick={onSave}
            loading={loading}
            disabled={!selectedPath}
            className="bg-orange-600 hover:bg-orange-700 text-white border-none px-6 py-2.5 rounded-xl shadow-lg shadow-orange-200 transition-all font-bold"
          />
        </div>
      }
    >
      <div className="space-y-6 pt-4">
        <div className="p-4 bg-orange-50 rounded-2xl mb-2 text-orange-800 text-sm">
          Choisissez le chemin d'affectation pour ce document.
        </div>

        {/* CHEMIN 1: Direction → Service */}
        <div className="border rounded-xl p-4 hover:border-orange-200 transition-all">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Building2 size={18} className="text-orange-600" />
            Chemin 1 : Direction → Service
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold mb-1 block text-slate-600">
                Direction
              </label>
              <Dropdown
                value={direction_id}
                options={allDirections}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => handleDirectionChange(e.value)}
                placeholder="Choisir une direction"
                className="w-full"
                filter
              />
            </div>

            <div>
              <label className="text-xs font-bold mb-1 block text-slate-600">
                Service (optionnel)
              </label>
              <Dropdown
                value={service_id}
                options={allServices}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => setService_id(e.value)}
                placeholder="Choisir un service"
                className="w-full"
                disabled={!direction_id}
                filter
                showClear
              />
              {!direction_id && (
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Sélectionnez d'abord une direction
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-bold">OU</span>
          </div>
        </div>

        {/* CHEMIN 2: Sous-direction → Division → Section */}
        <div className="border rounded-xl p-4 hover:border-orange-200 transition-all">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Split size={18} className="text-blue-600" />
            Chemin 2 : Sous-direction → Division → Section
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold mb-1 block text-slate-600">
                Sous-direction
              </label>
              <Dropdown
                value={sous_direction_id}
                options={allSousDirections} // ✅ MAINTENANT FILTRÉES PAR DIRECTION
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => handleSousDirectionChange(e.value)}
                placeholder={
                  direction_id
                    ? "Choisir une sous-direction"
                    : "Sélectionnez d'abord une direction"
                }
                className="w-full"
                disabled={!direction_id}
                filter
              />
              {!direction_id && (
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Sélectionnez d'abord une direction
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold mb-1 block text-slate-600">
                Division
              </label>
              <Dropdown
                value={division_id}
                options={allDivisions}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => handleDivisionChange(e.value)}
                placeholder="Choisir une division"
                className="w-full"
                disabled={!sous_direction_id}
                filter
                showClear
              />
            </div>

            <div>
              <label className="text-xs font-bold mb-1 block text-slate-600">
                Section (optionnel)
              </label>
              <Dropdown
                value={section_id}
                options={allSections}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => setSection_id(e.value)}
                placeholder="Choisir une section"
                className="w-full"
                disabled={!division_id}
                filter
                showClear
              />
            </div>
          </div>
        </div>

        {/* Récapitulatif */}
        {selectedPath && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
              Récapitulatif
            </p>
            <p className="text-xs text-slate-600">
              {selectedPath === "direction-service" ? (
                <>
                  <span className="font-bold">Direction :</span>{" "}
                  {allDirections.find((d) => d.id === direction_id)?.libelle ||
                    "Non sélectionnée"}
                  {service_id && (
                    <>
                      {" "}
                      → <span className="font-bold">Service :</span>{" "}
                      {allServices.find((s) => s.id === service_id)?.libelle}
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="font-bold">Sous-direction :</span>{" "}
                  {selectedSousDirection?.libelle || "Non sélectionnée"}
                  {division_id && (
                    <>
                      {" "}
                      → <span className="font-bold">Division :</span>{" "}
                      {allDivisions.find((d) => d.id === division_id)?.libelle}
                    </>
                  )}
                  {section_id && (
                    <>
                      {" "}
                      → <span className="font-bold">Section :</span>{" "}
                      {allSections.find((s) => s.id === section_id)?.libelle}
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
