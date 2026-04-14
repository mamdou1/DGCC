import { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { FileText, Tag, Box, ArrowLeft, Eye } from "lucide-react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useAuth } from "../../context/AuthContext";

export default function DocumentDetails({
  visible,
  onHide,
  doc,
  onRefresh,
}: any) {
  const [showArchiveForm, setShowArchiveForm] = useState(false);
  const toast = useRef<Toast>(null);
  const { can } = useAuth();

  if (!doc) return null;

  // Réinitialiser l'état quand on ferme la modale
  const handleClose = () => {
    setShowArchiveForm(false);
    onHide();
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={
          <div className="flex items-center gap-3 text-dgcc1">
            <div className="p-2 bg-dgcc12 rounded-lg text-dgcc5">
              <FileText size={18} />
            </div>
            <span className="font-black tracking-tight">
              Consultation Document
            </span>
          </div>
        }
        visible={visible}
        style={{ width: "600px" }}
        onHide={handleClose}
        className="custom-dialog overflow-hidden"
        footer={
          <div className="flex justify-end p-4 bg-dgcc13/50">
            <Button
              label="Fermer la vue"
              onClick={handleClose}
              className="px-8 py-2.5 bg-white text-dgcc3 border border-dgcc10 rounded-xl font-bold hover:bg-dgcc12 transition-all"
            />
          </div>
        }
      >
        <div className="space-y-6 pt-4">
          {/* Banner Référence */}
          <div className="bg-dgcc1 p-6 rounded-3xl shadow-xl shadow-dgcc/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 bg-dgcc2/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-dgcc7 text-[10px] uppercase font-black tracking-widest mb-1">
                  ID Archive
                </p>
                <h2 className="text-3xl font-black text-white">
                  #{String(doc.id).padStart(4, "0")}
                </h2>
              </div>
              <div className="bg-dgcc6 text-white px-4 py-1.5 rounded-xl text-xs font-black">
                {doc.typeDocument?.nom || "Non classé"}
              </div>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-dgcc2/40 uppercase tracking-widest ml-1">
              Métadonnées indexées
            </p>
            <div className="grid grid-cols-1 gap-2">
              {doc.values?.map((v: any) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-4 bg-white border border-dgcc13 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-dgcc13 rounded-lg text-dgcc6">
                      <Tag size={14} />
                    </div>
                    <span className="text-xs font-bold text-dgcc3">
                      {v.metaField?.label}
                    </span>
                  </div>
                  <span className="text-sm font-black text-dgcc1">
                    {v.metaField?.field_type === "file" ? (
                      <a
                        href={v.value}
                        target="_blank"
                        rel="noreferrer"
                        className="text-dgcc5 hover:underline"
                      >
                        Ouvrir
                      </a>
                    ) : (
                      v.value || "-"
                    )}
                  </span>
                </div>
              ))}
              {/* Section des pièces justificatives */}
              {doc.pieces && doc.pieces.length > 0 && (
                <div className="space-y-3 mt-6">
                  <p className="text-[10px] font-black text-dgcc2/40 uppercase tracking-widest ml-1">
                    Pièces justificatives ({doc.pieces.length})
                  </p>
                  <div className="space-y-2">
                    {doc.pieces.map((piece: any) => {
                      const isDisponible =
                        piece.DocumentPieces?.disponible || false;
                      const hasFiles =
                        piece.fichiers && piece.fichiers.length > 0;

                      return (
                        <div
                          key={piece.id}
                          className={`p-3 rounded-xl border ${
                            isDisponible
                              ? "bg-dgcc13 border-dgcc10"
                              : "bg-white border-slate-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-1.5 rounded-lg ${
                                  isDisponible ? "bg-dgcc10" : "bg-slate-100"
                                }`}
                              >
                                <FileText
                                  size={14}
                                  className={
                                    isDisponible
                                      ? "text-dgcc3"
                                      : "text-slate-400"
                                  }
                                />
                              </div>
                              <div>
                                <span
                                  className={`text-sm font-bold ${
                                    isDisponible
                                      ? "text-dgcc"
                                      : "text-slate-600"
                                  }`}
                                >
                                  {piece.libelle}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                      isDisponible
                                        ? "bg-dgcc10 text-dgcc2"
                                        : "bg-slate-200 text-slate-600"
                                    }`}
                                  >
                                    {isDisponible
                                      ? "Disponible"
                                      : "Non disponible"}
                                  </span>
                                  {hasFiles && (
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                      {piece.fichiers.length} fichier(s)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {hasFiles && (
                              <button
                                onClick={() =>
                                  window.open(
                                    `http://localhost:5000/${piece.fichiers[0].fichier}`,
                                  )
                                }
                                className="p-2 text-dgcc5 hover:bg-dgcc12 rounded-lg"
                              >
                                <Eye size={14} />
                              </button>
                            )}
                          </div>

                          {/* Liste des fichiers si plusieurs */}
                          {hasFiles && piece.fichiers.length > 1 && (
                            <div className="mt-2 pl-8 space-y-1">
                              {piece.fichiers.slice(1).map((file: any) => (
                                <div
                                  key={file.id}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span className="truncate flex-1">
                                    {file.original_name}
                                  </span>
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `http://localhost:5000/${file.fichier}`,
                                      )
                                    }
                                    className="text-dgcc5 hover:text-dgcc2 ml-2"
                                  >
                                    <Eye size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
