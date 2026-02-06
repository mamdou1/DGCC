import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { BoxIcon, Hash, Type, BarChart3, MapPin, Save } from "lucide-react";
import { getTraves } from "../../api/trave";
import { Trave } from "../../interfaces";
import { Dropdown } from "primereact/dropdown";

export default function BoxForm({ visible, onHide, onSubmit, initial }: any) {
  const [formData, setFormData] = useState({
    code_box: "",
    libelle: "",
    capacite_max: 10,
    trave_id: "",
  });
  const [trave, setTrave] = useState<Trave[]>([]);
  const [loadingTrave, setLoadingTrave] = useState(false);

  useEffect(() => {
    if (initial?.id) {
      setFormData({
        code_box: initial.code_box || "",
        libelle: initial.libelle || "",
        capacite_max: initial.capacite_max || 0,
        trave_id: initial.trave_id || "",
      });
    } else {
      setFormData({
        code_box: "",
        libelle: "",
        trave_id: "",
        capacite_max: 0,
      });
    }
  }, [initial, visible]);

  // Chargement de la liste des salles pour le menu déroulant
  useEffect(() => {
    if (visible) {
      setLoadingTrave(true);
      getTraves()
        .then((data) => setTrave(data.salle || data)) // S'adapte selon le format de ton API
        .finally(() => setLoadingTrave(false));
    }
  }, [visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // On passe formData au parent (EtagerePage) qui gère l'appel API via handleAction
    onSubmit(formData);
  };

  // useEffect(() => {
  //   if (initial?.id) setFormData({ ...initial });
  //   else setFormData({ code_box: "", libelle: "", capacite_max: 10 });
  // }, [initial, visible]);

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={
        <div className="flex items-center gap-2">
          <BoxIcon className="text-emerald-600" size={20} />{" "}
          <span>{initial?.id ? "Modifier le Box" : "Nouveau Box"}</span>
        </div>
      }
      className="w-full max-w-md"
      modal
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-emerald-600 flex items-center gap-2">
            <Hash size={14} /> Code Identifiant
          </label>
          <InputText
            className="p-3 bg-emerald-50 border-emerald-200 rounded-xl"
            placeholder="Ex: BX-2024-001"
            value={formData.code_box}
            onChange={(e) =>
              setFormData({ ...formData, code_box: e.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-emerald-600 flex items-center gap-2">
            <Type size={14} /> Libellé / Nom
          </label>
          <InputText
            className="p-3 bg-emerald-50 border-emerald-200 rounded-xl"
            placeholder="Ex: Archives RH"
            value={formData.libelle}
            onChange={(e) =>
              setFormData({ ...formData, libelle: e.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-emerald-600 flex items-center gap-2">
            <BarChart3 size={14} /> Capacité maximale (Documents)
          </label>
          <InputNumber
            className="w-full"
            inputClassName="p-3 bg-emerald-50 border-emerald-200 rounded-xl w-full"
            value={formData.capacite_max}
            onValueChange={(e) =>
              setFormData({ ...formData, capacite_max: e.value || 0 })
            }
            min={1}
            showButtons
          />
        </div>
        {/* Sélection de la Salle */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-emerald-600 flex items-center gap-2">
            <MapPin size={14} /> Salle de destination
          </label>
          <Dropdown
            value={formData.trave_id}
            options={trave}
            optionLabel="code"
            optionValue="id"
            placeholder={loadingTrave ? "Chargement..." : "Choisir une Trave"}
            className="w-full bg-emerald-50 border-emerald-200 rounded-xl text-left"
            onChange={(e) => setFormData({ ...formData, trave_id: e.value })}
            filter
            required
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            label="Annuler"
            onClick={onHide}
            className="p-button-text text-emerald-400"
          />
          <Button
            type="submit"
            icon={<Save size={18} className="mr-2" />}
            label="Enregistrer"
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-emerald-700 transition-all"
          />
        </div>
      </form>
    </Dialog>
  );
}
