import { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout/Layoutt";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Search, Layers, FileText } from "lucide-react";
import { getMetaById } from "../../api/metaField";
import { getDocuments } from "../../api/document";
import { getTypeDocuments } from "../../api/typeDocument";
import Pagination from "../../components/layout/Pagination";

export default function Recherche() {
  const [docs, setDocs] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [documentType_id, setDocumentType_id] = useState<number | null>(null);
  const [metaFields, setMetaFields] = useState<any[]>([]);

  // États spécifiques à la recherche dynamique
  const [selectedFields, setSelectedFields] = useState<number[]>([]); // IDs des métadonnées cochées [cite: 1]
  const [searchValues, setSearchValues] = useState<{ [key: number]: string }>(
    {},
  ); // Valeurs saisies pour chaque champ [cite: 2]

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const toast = useRef<Toast>(null);

  // Chargement initial des données [cite: 14]
  useEffect(() => {
    const loadData = async () => {
      const [resDocs, resTypes] = await Promise.all([
        getDocuments(),
        getTypeDocuments(),
      ]);
      setDocs(resDocs);
      setTypes(resTypes.typeDocument);
    };
    loadData();
  }, []);

  // Chargement des métadonnées selon le type sélectionné
  useEffect(() => {
    if (documentType_id) {
      getMetaById(String(documentType_id)).then((res) => {
        setMetaFields(res);
        setSelectedFields([]); // Réinitialiser les checkboxes [cite: 1]
        setSearchValues({}); // Réinitialiser les champs de recherche
      });
    } else {
      setMetaFields([]);
    }
  }, [documentType_id]);

  // Gérer le changement des checkboxes [cite: 2]
  const toggleField = (id: number) => {
    setSelectedFields((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  // Logique de filtrage avancée [cite: 28]
  const filtered = docs.filter((d) => {
    // 1. Filtrer par type de document
    const matchType = documentType_id
      ? d.typeDocument?.id === documentType_id
      : true;
    if (!matchType) return false;

    // 2. Filtrer par valeurs dynamiques (seulement les champs cochés) [cite: 3]
    return selectedFields.every((fieldId) => {
      const searchValue = searchValues[fieldId]?.toLowerCase() || "";
      if (!searchValue) return true; // Si le champ est vide, on ignore ce critère

      const docValue =
        d.values?.find((v: any) => v.metaField?.id === fieldId)?.value || "";
      return String(docValue).toLowerCase().includes(searchValue);
    });
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Layout>
      <Toast ref={toast} />
      <div className="mb-8">
        <h1 className="text-3xl font-black text-emerald-950 flex items-center gap-3">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg">
            <Search size={24} />
          </div>
          Recherche Avancée
        </h1>
      </div>
      {/* Étape 1 : Choix du Type [cite: 35] */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <Layers size={20} className="text-emerald-600" />
          <Dropdown
            value={documentType_id}
            options={types}
            onChange={(e) => setDocumentType_id(e.value)}
            optionLabel="nom"
            optionValue="id"
            placeholder="Sélectionner un type de document"
            className="w-full md:w-80 border-none shadow-none focus:ring-0 bg-emerald-50/50 rounded-xl"
            filter
          />
        </div>

        {/* Étape 2 : Checkboxes des libellés (Critères)  */}
        {metaFields.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-bold text-emerald-800 mb-3">
              Critères de recherche :
            </p>
            <div className="flex flex-wrap gap-4">
              {metaFields.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100"
                >
                  <Checkbox
                    onChange={() => toggleField(m.id)}
                    checked={selectedFields.includes(m.id)}
                  />
                  <label className="text-sm text-emerald-900 font-medium">
                    {m.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Étape 3 : Champs de recherche dynamiques [cite: 2, 3] */}
      {selectedFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-in fade-in duration-300">
          {metaFields
            .filter((m) => selectedFields.includes(m.id))
            .map((m) => (
              <div key={m.id} className="relative group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400"
                  size={16}
                />
                <input
                  placeholder={`Rechercher par ${m.label}...`}
                  value={searchValues[m.id] || ""}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, [m.id]: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-100 rounded-xl shadow-sm outline-none focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            ))}
        </div>
      )}
      {/* Résultats (Tableau similaire à DocumentPage) [cite: 36] */}
      <div className="bg-white rounded-[2rem] border border-emerald-100 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-50/30 border-b border-emerald-50">
              <th className="p-5 text-[11px] font-black text-emerald-800 uppercase w-24">
                Réf.
              </th>
              {metaFields.map((m) => (
                <th
                  key={m.id}
                  className="p-5 text-[11px] font-black text-emerald-800 uppercase"
                >
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {documentType_id &&
              paginated.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-emerald-50/40 transition-colors"
                >
                  <td className="p-5">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold">
                      #{String(d.id).padStart(3, "0")}
                    </span>
                  </td>
                  {metaFields.map((m) => {
                    const value = d.values?.find(
                      (v: any) => v.metaField?.id === m.id,
                    )?.value;
                    return (
                      <td
                        key={m.id}
                        className="p-5 text-sm text-emerald-900 font-medium"
                      >
                        {value || (
                          <span className="text-emerald-200">---</span>
                        )}{" "}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>

        {!documentType_id && (
          <div className="p-20 text-center">
            <div className="inline-flex p-6 bg-emerald-50 rounded-full mb-4 text-emerald-200">
              <FileText size={48} />
            </div>
            <p className="text-emerald-800 font-bold text-lg">
              Choisissez un type pour filtrer
            </p>
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filtered.length}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
}
