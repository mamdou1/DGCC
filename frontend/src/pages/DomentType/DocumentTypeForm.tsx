import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileText, Save, Hash, Info, X } from "lucide-react";

export default function DocumentTypeForm({
  onHide,
  onSubmit,
  initial = {},
  currentStructureLabel = "",
  isFiltered = false,
}: any) {
  //const [code, setCode] = useState("");
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialisation des champs (le visible n'est plus requis ici car le TabView monte le composant)
  useEffect(() => {
    //setCode(initial?.code || "");
    setNom(initial?.nom || "");
  }, [initial]);

  const handleSubmit = async () => {
    if (!nom) return;
    if (!nom) {
      alert("Le nom est obligatoire");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ nom });
      // On peut appeler onHide() ici si on veut fermer la modale après succès
      //refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Alerte Affectation Automatique */}
      {!initial?.id && isFiltered && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl transition-all animate-in fade-in slide-in-from-top-2">
          <Info size={18} className="text-amber-600 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <span className="font-bold block uppercase mb-1">
              Affectation automatique
            </span>
            Ce type de document sera automatiquement lié à : <br />
            <span className="font-black underline italic">
              {currentStructureLabel}
            </span>
          </div>
        </div>
      )}

      {/* 2. Champs de saisie */}
      <div className="space-y-5">
        {/* <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Hash size={14} className="text-dgcc6" /> Code Référence
          </label>
          <InputText
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-dgcc6/20 transition-all font-mono"
            placeholder="ex: FACT-SC"
            autoFocus
          />
        </div> */}

        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FileText size={14} className="text-dgcc6" /> Libellé du document
          </label>
          <InputText
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-dgcc6/20 transition-all"
            placeholder="ex: Facture de service"
          />
        </div>
      </div>

      {/* 3. Footer intégré (Boutons d'action) */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
        <Button
          label="Annuler"
          icon={<X size={16} className="mr-2" />}
          onClick={onHide}
          className="p-button-text text-slate-500 font-bold hover:bg-slate-100 px-4 py-2 rounded-xl transition-all"
          disabled={loading}
        />
        <Button
          label={loading ? "Enregistrement..." : "Enregistrer le type"}
          icon={!loading && <Save size={18} className="mr-2" />}
          onClick={handleSubmit}
          loading={loading}
          disabled={!nom}
          className="bg-dgcc5 hover:bg-dgcc3 text-white border-none px-8 py-3 rounded-xl shadow-lg shadow-dgcc10 transition-all font-bold"
        />
      </div>
    </div>
  );
}
