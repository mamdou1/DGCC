import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileText, Info, Hash, Split } from "lucide-react";

export default function PiecesDetails({ visible, onHide, pieces }: any) {
  if (!pieces) return null;

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Info size={18} className="text-emerald-600" />
          </div>
          <span>Détails de la pièce</span>
        </div>
      }
      visible={visible}
      style={{ width: "450px" }}
      onHide={onHide}
      draggable={false}
      footer={
        <div className="flex justify-end p-2">
          <Button
            label="Fermer"
            onClick={onHide}
            className="bg-slate-100 text-slate-600 font-bold px-8 py-2 rounded-xl hover:bg-slate-200 border-none transition-all"
          />
        </div>
      }
    >
      <div className="pt-2">
        {/* Card Header Style - emerald Theme */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl mb-6 flex flex-col items-center text-center">
          <div className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-200 mb-3">
            <Split size={32} />
          </div>
          <div className="flex">
            <h3 className="text-md font-black text-emerald-900 leading-tight">
              Source de production:
            </h3>
            {/* Remplacement de la division par la structure hiérarchique */}
            {(pieces.entitee_trois?.libelle ||
              pieces.entitee_deux?.libelle ||
              pieces.entitee_un?.libelle) && (
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-3 border border-white/10 shadow-inner">
                <div className="flex flex-col">
                  <span className="text-white text-sm font-bold">
                    {pieces.entitee_trois?.libelle ||
                      pieces.entitee_deux?.libelle ||
                      pieces.entitee_un?.libelle}
                  </span>
                  <span className="text-[9px] text-blue-200/60 uppercase font-black tracking-tighter">
                    {pieces.entitee_trois
                      ? "Structure Niveau 3"
                      : pieces.entitee_deux
                        ? "Structure Niveau 2"
                        : "Structure Niveau 1"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-4 px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <FileText size={16} className="text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Libellé pièce
              </span>
            </div>
            <span className="mt-2 text-xs font-mono font-bold  text-emerald-800 px-3 py-1 ">
              {pieces.libelle}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Hash size={16} className="text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Code pièce
              </span>
            </div>
            <span className="mt-2 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
              {pieces.code_pieces}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
              Observation
            </p>
            <p className="text-xs text-slate-500 italic">
              Cette pièce est configurée pour être utilisée dans les processus
              de liquidation standards.
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
