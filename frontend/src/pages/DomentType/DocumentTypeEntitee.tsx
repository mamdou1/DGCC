import { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout/Layoutt";
import DocumentTypeDetails from "./DocumentTypeDetails";
import DocumentTypeMetaForm from "./DocumentTypeMetaForm";
import { confirmDialog } from "primereact/confirmdialog";
import DocumentTypeAffectationForm from "./DocumentTypeAffectationForm";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  Plus,
  Pencil,
  Trash2,
  Database,
  Settings,
  Search,
  Layers,
  FilePlus,
  SplinePointer,
  XCircle,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";

import {
  getTypeDocuments,
  createTypeDocument,
  updateTypeDocument,
  deleteTypeDocument,
  addPiecesToTypeDocument,
} from "../../api/typeDocument";
import {
  TypeDocument,
  AddPiecesToTypeDocumentPayload,
  Pieces,
} from "../../interfaces";
import { createMetaField, updateMetaField } from "../../api/metaField";
import TypeDocumentAjoutPieces from "./TypeDocumentAjoutPieces";
import { getPieces } from "../../api/pieces";
import { Dropdown } from "primereact/dropdown";
import { getAllEntiteeUn } from "../../api/entiteeUn";
import { getAllEntiteeDeux } from "../../api/entiteeDeux";
import { getAllEntiteeTrois } from "../../api/entiteeTrois";
import DocumentTypeAffectAndForm from "./DocumentTypeAffectAndForm";

export default function DocumentTypeEntitee() {
  const [types, setTypes] = useState<TypeDocument[]>([]);
  const [pieces, setPieces] = useState<Pieces[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [affectationFormVisible, setAffectationFormVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [metaVisible, setMetaVisible] = useState(false);
  const [query, setQuery] = useState("");
  const toast = useRef<Toast>(null);
  const [formPiecesVisible, setFormPiecesVisible] = useState(false);
  const [selectedTypeDoc, setSelectedTypeDoc] = useState<string | null>(null);
  const [optionsEntites, setOptionsEntites] = useState<
    { label: string; value: any }[]
  >([]);

  // États pour l'accordéon
  const [expandedStructure, setExpandedStructure] = useState<string | null>(
    null,
  );

  const [rawE1, setRawE1] = useState<any[]>([]);
  const [rawE2, setRawE2] = useState<any[]>([]);
  const [rawE3, setRawE3] = useState<any[]>([]);

  const load = async () => {
    try {
      const [resTy, resP, resE1, resE2, resE3] = await Promise.all([
        getTypeDocuments(),
        getPieces(),
        getAllEntiteeUn(),
        getAllEntiteeDeux(),
        getAllEntiteeTrois(),
      ]);

      const typesData = resTy.typeDocument || resTy;
      setTypes(Array.isArray(typesData) ? typesData : []);
      setPieces(Array.isArray(resP) ? resP : []);

      const dataE1 = Array.isArray(resE1) ? resE1 : resE1.entiteeUn || [];
      const dataE2 = Array.isArray(resE2) ? resE2 : resE2.entiteeDeux || [];
      const dataE3 = Array.isArray(resE3) ? resE3 : resE3.entiteeTrois || [];

      setRawE1(dataE1);
      setRawE2(dataE2);
      setRawE3(dataE3);

      const allOptions = [
        { label: "Tous les profils", value: null },
        ...dataE1.map((x: any) => ({
          label: `🏢 ${x.libelle}`,
          value: String(x.id),
        })),
        ...dataE2.map((x: any) => ({
          label: `📂 ${x.libelle}`,
          value: `E2-${x.id}`,
        })),
        ...dataE3.map((x: any) => ({
          label: `📄 ${x.libelle}`,
          value: `E3-${x.id}`,
        })),
      ];
      setOptionsEntites(allOptions);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Chargement échoué",
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  // --- LOGIQUE DE GROUPEMENT ---
  const getGroupedData = () => {
    const filtered = types.filter((t) => {
      const search = query.toLowerCase();
      const matchesSearch =
        t.code.toLowerCase().includes(search) ||
        t.nom.toLowerCase().includes(search);

      if (!selectedTypeDoc) return matchesSearch;
      const e1Id = String(t.entitee_un_id || (t.entitee_un as any)?.id);
      const e2Id = `E2-${t.entitee_deux_id || (t.entitee_deux as any)?.id}`;
      const e3Id = `E3-${t.entitee_trois_id || (t.entitee_trois as any)?.id}`;
      return (
        matchesSearch &&
        (selectedTypeDoc === e1Id ||
          selectedTypeDoc === e2Id ||
          selectedTypeDoc === e3Id)
      );
    });

    // On groupe par le libellé de la structure la plus basse
    const groups: Record<string, TypeDocument[]> = {};
    filtered.forEach((t) => {
      const structureLabel =
        t.entitee_trois?.libelle ||
        t.entitee_deux?.libelle ||
        t.entitee_un?.libelle ||
        "Documents non assignés";
      if (!groups[structureLabel]) groups[structureLabel] = [];
      groups[structureLabel].push(t);
    });
    return groups;
  };

  const groupedTypes = getGroupedData();

  // --- HANDLERS (Identiques à ton code original) ---
  const handleSubmit = async (formData: any) => {
    /* Ta logique de submit existante */
  };
  const handleDelete = (id: string) => {
    confirmDialog({
      message: "Supprimer ce type de document ?",
      header: "Confirmation",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await deleteTypeDocument(id);
        setTypes((s) => s.filter((x) => String(x.id) !== String(id)));
        toast.current?.show({ severity: "success", summary: "Supprimé" });
      },
    });
  };

  const handleMetaSubmit = async (fieldsPayload: any[]) => {
    if (!selected?.id) return;
    try {
      for (const field of fieldsPayload) {
        field.id
          ? await updateMetaField(field.id, field)
          : await createMetaField(selected.id, field);
      }
      toast.current?.show({
        severity: "success",
        summary: "Métadonnées à jour",
      });
      load();
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Erreur" });
    }
  };

  const onAddPieces = async (
    typeId: string,
    payload: AddPiecesToTypeDocumentPayload,
  ) => {
    try {
      await addPiecesToTypeDocument(typeId, payload);
      toast.current?.show({ severity: "success", summary: "Pièces ajoutées" });
      load();
      setFormPiecesVisible(false);
    } catch (err) {
      /* erreur */
    }
  };

  const handleAffectationSubmit = async (payload: any) => {
    try {
      if (selected?.id) {
        await updateTypeDocument(selected.id, payload);
        toast.current?.show({
          severity: "success",
          summary: "Affectation mise à jour",
        });
        await load();
        setAffectationFormVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMultipleAffectation = async (typeIds: string[]) => {
    /* Ta logique existante */
  };

  return (
    <Layout>
      <Toast ref={toast} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg">
              <Layers size={24} />
            </div>
            Types par Structure
          </h1>
        </div>
        <Button
          label="Nouveau Type"
          icon={<Plus size={20} />}
          onClick={() => {
            setEditing(null);
            setFormVisible(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-none px-6 py-3 rounded-xl shadow-md font-bold"
        />
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <InputText
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un document..."
            value={query}
          />
        </div>
        <Dropdown
          value={selectedTypeDoc}
          onChange={(e) => setSelectedTypeDoc(e.value)}
          options={optionsEntites}
          placeholder="Filtrer par structure"
          className="w-64 bg-slate-50 border-slate-200 rounded-xl"
          showClear
          filter
        />
      </div>

      {/* ACCORDION LIST */}
      <div className="space-y-4">
        {Object.entries(groupedTypes).length > 0 ? (
          Object.entries(groupedTypes).map(([structureName, docs]) => (
            <div
              key={structureName}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() =>
                  setExpandedStructure(
                    expandedStructure === structureName ? null : structureName,
                  )
                }
                className={`w-full flex items-center justify-between p-5 transition-all ${
                  expandedStructure === structureName
                    ? "bg-emerald-50/50"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${expandedStructure === structureName ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    <Database size={20} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`font-bold ${expandedStructure === structureName ? "text-emerald-800" : "text-emerald-700"}`}
                    >
                      {structureName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {docs.length} type(s) de document
                    </p>
                  </div>
                </div>
                {expandedStructure === structureName ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>

              {expandedStructure === structureName && (
                <div className="border-t border-slate-50 overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-left">
                          Code
                        </th>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-left">
                          Libellé
                        </th>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {docs.map((t) => (
                        <tr
                          key={t.id}
                          onClick={() => {
                            setSelected(t);
                            setDetailsVisible(true);
                          }}
                          className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold">
                              {t.code}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                              <FileText
                                size={14}
                                className="text-emerald-500"
                              />
                              {t.nom}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-1">
                              <button
                                onClick={() => {
                                  setSelected(t);
                                  setFormPiecesVisible(true);
                                }}
                                className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg"
                              >
                                <FilePlus size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelected(t);
                                  setAffectationFormVisible(true);
                                }}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                              >
                                <SplinePointer size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditing(t);
                                  setFormVisible(true);
                                }}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelected(t);
                                  setMetaVisible(true);
                                }}
                                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                              >
                                <Settings size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(String(t.id))}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
              <Search size={40} />
            </div>
            <p className="text-slate-400 font-medium">
              Aucun document trouvé pour cette sélection.
            </p>
          </div>
        )}
      </div>

      {/* MODALS */}
      <DocumentTypeDetails
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        type={selected}
      />
      <DocumentTypeMetaForm
        visible={metaVisible}
        onHide={() => setMetaVisible(false)}
        onSubmit={handleMetaSubmit}
        type={selected}
      />
      <TypeDocumentAjoutPieces
        visible={formPiecesVisible}
        onHide={() => setFormPiecesVisible(false)}
        onSubmit={onAddPieces}
        initial={selected}
        title={"Pièces à fournir"}
        pieces={pieces}
      />
      <DocumentTypeAffectationForm
        visible={affectationFormVisible}
        onHide={() => setAffectationFormVisible(false)}
        onSubmit={handleAffectationSubmit}
        initial={selected}
        title={`Affectation : ${selected?.nom}`}
      />

      <DocumentTypeAffectAndForm
        visible={formVisible}
        onHide={() => setFormVisible(false)}
        onSubmitSingle={handleSubmit}
        onSubmitMultiple={handleMultipleAffectation}
        types={types}
        initial={editing}
        isFiltered={!!selectedTypeDoc}
        structureLabel={
          optionsEntites.find((o) => o.value === selectedTypeDoc)?.label || ""
        }
      />
    </Layout>
  );
}
