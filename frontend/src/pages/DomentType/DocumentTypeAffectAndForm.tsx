import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import {
  PlusCircle,
  FilePlus,
  Layers,
  Edit3,
  Settings2,
  Building2,
  Briefcase,
  Split,
  TableOfContents,
  GitMerge,
} from "lucide-react";
import DocumentTypeForm from "./DocumentTypeForm";
import DocumentTypeMultipleAffectation from "./DocumentTypeMultipleAffectation";

export default function DocumentTypeAffectAndForm({
  visible,
  onHide,
  onSubmitSingle,
  onSubmitMultiple,
  types,
  isFiltered,
  structureLabel,
  initial = null,
}: any) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Switcher automatiquement d'onglet si on passe en mode édition
  useEffect(() => {
    if (initial?.id) {
      setActiveIndex(0);
    }
  }, [initial]);

  // Déterminer l'icône en fonction du libellé de structure
  const getStructureIcon = () => {
    if (!structureLabel) return <Settings2 size={22} />;

    if (structureLabel.includes("Direction")) return <Building2 size={22} />;
    if (structureLabel.includes("Service")) return <Briefcase size={22} />;
    if (structureLabel.includes("Sous-direction")) return <Split size={22} />;
    if (structureLabel.includes("Division"))
      return <TableOfContents size={22} />;
    if (structureLabel.includes("Section")) return <GitMerge size={22} />;

    return <Settings2 size={22} />;
  };

  // Personnalisation du Header en fonction du mode (Ajout vs Edition)
  const renderHeader = () => (
    <div className="flex items-center justify-between w-full pr-8">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl ${initial?.id ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700"}`}
        >
          {initial?.id ? <Edit3 size={22} /> : <PlusCircle size={22} />}
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 leading-none">
            {initial?.id ? "Modifier le Type" : "Nouveau Type"}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {initial?.id
              ? `Édition de : ${initial.nom}`
              : "Configuration et affectation des documents"}
          </p>
        </div>
      </div>

      {/* Badge indicateur de structure si sélectionnée */}
      {isFiltered && structureLabel && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-200">
          {getStructureIcon()}
          <span className="text-[10px] font-bold text-orange-700 uppercase tracking-tighter">
            Cible : {structureLabel}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      style={{ width: "950px" }}
      header={renderHeader()}
      className="document-type-dialog rounded-3xl"
      contentClassName="rounded-b-3xl"
      draggable={false}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <div className="mt-4 px-2">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          className="custom-tabview"
        >
          <TabPanel
            header={initial?.id ? "Informations" : "Création Simple"}
            leftIcon={<FilePlus size={18} className="mr-2" />}
          >
            <div className="py-6 transition-all duration-300">
              <DocumentTypeForm
                onSubmit={onSubmitSingle}
                initial={initial}
                isFiltered={isFiltered}
                currentStructureLabel={structureLabel}
                onHide={onHide}
              />
            </div>
          </TabPanel>

          <TabPanel
            header="Affectation en masse"
            leftIcon={<Layers size={18} className="mr-2" />}
            disabled={!!initial?.id}
          >
            <div className="py-6 transition-all duration-300">
              <DocumentTypeMultipleAffectation
                types={types}
                isFiltered={isFiltered}
                structureLabel={structureLabel}
                onSubmit={onSubmitMultiple}
                onHide={onHide}
              />
            </div>
          </TabPanel>
        </TabView>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
  .custom-tabview .p-tabview-nav {
    border: none !important;
    background: transparent !important;
    display: flex;
    gap: 10px;
    margin-bottom: 1rem;
    padding: 0;
    list-style: none;
  }
  .custom-tabview .p-tabview-nav li .p-tabview-nav-link {
    border-radius: 12px !important;
    border: 1px solid #e2e8f0 !important;
    background: #f8fafc !important;
    transition: all 0.2s;
    padding: 12px 20px !important;
    text-decoration: none !important;
    color: #64748b !important;
    font-weight: 700;
  }
  .custom-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    background: #f97316 !important;
    color: white !important;
    border-color: #f97316 !important;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
  }
  .custom-tabview .p-tabview-panels {
    background: transparent !important;
    padding: 0 !important;
  }
`,
        }}
      />
    </Dialog>
  );
}
