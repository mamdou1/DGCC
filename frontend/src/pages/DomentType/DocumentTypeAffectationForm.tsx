import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Building2, Layers, GitMerge, Save } from "lucide-react";
import { getAllEntiteeUn } from "../../api/entiteeUn";
import { getEntiteeDeuxByEntiteeUn } from "../../api/entiteeDeux";
import { getEntiteeTroisByEntiteeDeux } from "../../api/entiteeTrois";

export default function DocumentTypeAffectationForm({
  visible,
  onHide,
  onSubmit,
  initial,
  title,
}: any) {
  const [loading, setLoading] = useState(false);
  const [entitee_un_id, setEntitee_un_id] = useState<number | undefined>();
  const [entitee_deux_id, setEntitee_deux_id] = useState<number | undefined>();
  const [entitee_trois_id, setEntitee_trois_id] = useState<
    number | undefined
  >();

  const [allEntiteeUn, setAllEntiteeUn] = useState<any[]>([]);
  const [allEntiteeDeux, setAllEntiteeDeux] = useState<any[]>([]);
  const [allEntiteeTrois, setAllEntiteeTrois] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const srvs = await getAllEntiteeUn();
      setAllEntiteeUn(Array.isArray(srvs) ? srvs : []);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const loadEditData = async () => {
      if (visible && initial?.id) {
        // 1. Initialiser les IDs
        setEntitee_un_id(initial.entitee_un?.id);
        setEntitee_deux_id(initial.entitee_deux?.id);
        setEntitee_trois_id(initial.entitee_trois?.id);

        // 2. Charger les listes en cascade pour l'affichage
        if (initial.entitee_un?.id) {
          const divs = await getEntiteeDeuxByEntiteeUn(initial.entitee_un.id);
          setAllEntiteeDeux(Array.isArray(divs) ? divs : []);
        }
        if (initial.entitee_deux?.id) {
          const secs = await getEntiteeTroisByEntiteeDeux(
            initial.entitee_deux.id,
          );
          setAllEntiteeTrois(Array.isArray(secs) ? secs : []);
        }
      } else if (visible) {
        setEntitee_un_id(undefined);
        setEntitee_deux_id(undefined);
        setEntitee_trois_id(undefined);
        setAllEntiteeDeux([]);
        setAllEntiteeTrois([]);
      }
    };
    loadEditData();
  }, [visible, initial]);

  const handleUnChange = async (id: number) => {
    setEntitee_un_id(id);
    setEntitee_deux_id(undefined);
    setEntitee_trois_id(undefined);
    const res = await getEntiteeDeuxByEntiteeUn(id);
    setAllEntiteeDeux(Array.isArray(res) ? res : []);
  };

  const handleDeuxChange = async (id: number) => {
    setEntitee_deux_id(id);
    setEntitee_trois_id(undefined);
    const res = await getEntiteeTroisByEntiteeDeux(id);
    setAllEntiteeTrois(res);
  };

  const onSave = async () => {
    setLoading(true);
    const cibleId = entitee_trois_id || entitee_deux_id || entitee_un_id;
    await onSubmit({
      entitee_un_id,
      entitee_deux_id,
      entitee_trois_id,
      entitee_cible_id: cibleId,
    });
    setLoading(false);
  };

  return (
    <Dialog
      header={
        <div className="text-xl font-bold flex items-center gap-2">
          <GitMerge className="text-emerald-600" /> {title}
        </div>
      }
      visible={visible}
      style={{ width: 500 }}
      onHide={onHide}
      footer={
        <div className="p-4">
          <Button
            label="Appliquer l'affectation"
            icon={<Save className="mr-2" />}
            onClick={onSave}
            loading={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white border-none px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all font-bold"
          />
        </div>
      }
    >
      <div className="space-y-4 pt-4">
        <div className="p-4 bg-emerald-50 rounded-2xl mb-4 text-emerald-800 text-sm">
          Sélectionnez le niveau de structure auquel ce document appartient.
        </div>

        <div>
          <label className="text-xs font-bold mb-2 block">
            Entité Niveau 1
          </label>
          <Dropdown
            value={entitee_un_id}
            options={allEntiteeUn}
            optionLabel="libelle"
            optionValue="id"
            onChange={(e) => handleUnChange(e.value)}
            placeholder="Choisir Direction"
            className="w-full"
            filter
          />
        </div>

        <div>
          <label className="text-xs font-bold mb-2 block">
            Entité Niveau 2
          </label>
          <Dropdown
            value={entitee_deux_id}
            options={allEntiteeDeux}
            optionLabel="libelle"
            optionValue="id"
            onChange={(e) => handleDeuxChange(e.value)}
            placeholder="Choisir Service"
            className="w-full"
            disabled={!entitee_un_id}
            filter
          />
        </div>

        <div>
          <label className="text-xs font-bold mb-2 block">
            Entité Niveau 3 (Optionnel)
          </label>
          <Dropdown
            value={entitee_trois_id}
            options={allEntiteeTrois}
            optionLabel="libelle"
            optionValue="id"
            onChange={(e) => setEntitee_trois_id(e.value)}
            placeholder="Choisir Section"
            className="w-full"
            disabled={!entitee_deux_id}
            filter
            showClear
          />
        </div>
      </div>
    </Dialog>
  );
}
