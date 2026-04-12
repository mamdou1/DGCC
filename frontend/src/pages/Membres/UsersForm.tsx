// // UserForm.tsx (mis à jour)
// import React, { useState, useEffect, useRef } from "react";
// import { InputText } from "primereact/inputtext";
// import { Dropdown } from "primereact/dropdown";
// import { Dialog } from "primereact/dialog";
// import { Button } from "primereact/button";
// import {
//   UserPlus,
//   Save,
//   Building2,
//   Layers,
//   GitMerge,
//   Briefcase,
//   Mail,
//   Phone,
//   User as UserIcon,
//   Fingerprint,
//   Camera,
//   Split,
//   TableOfContents,
// } from "lucide-react";
// import type {
//   Direction,
//   Service,
//   SousDirection,
//   Division,
//   Section,
//   Fonction,
//   Droit,
//   User,
// } from "../../interfaces";

// // API imports pour les nouvelles entités
// import { getDirections } from "../../api/direction";
// import { getServicesByDirection } from "../../api/service";
// import { getSousDirectionsByDirection } from "../../api/sousDirection";
// import { getDivisionsBySousDirection } from "../../api/division";
// import { getSectionsByDivision } from "../../api/section";

// // API imports pour les fonctions (à adapter selon votre structure)
// import { getFunctionsByDirection } from "../../api/direction";
// import { getFunctionsByService } from "../../api/service";
// import { getFunctionsBySousDirection } from "../../api/sousDirection";
// import { getFunctionsByDivision } from "../../api/division";
// import { getFunctionsBySection } from "../../api/section";

// type Props = {
//   visible: boolean;
//   onHide: () => void;
//   onSubmit: (data: Partial<User>, photoFile?: File) => Promise<void>;
//   refresh: () => void;
//   initial?: Partial<User>;
//   title?: string;
//   droits: Droit[];
// };

// export default function UserForm({
//   visible,
//   onHide,
//   onSubmit,
//   refresh,
//   initial = {},
//   title = "Fiche Agent",
//   droits,
// }: Props) {
//   // --- États des champs de base ---
//   const [nom, setNom] = useState("");
//   const [prenom, setPrenom] = useState("");
//   const [email, setEmail] = useState("");
//   const [telephone, setTelephone] = useState("");
//   const [numMatricule, setNumMatricule] = useState("");
//   const [droit, setDroit] = useState<Droit | string>(
//     initial.droit || droits[0]?.id || "",
//   );

//   // --- États pour le chemin d'affectation ---
//   const [selectedPath, setSelectedPath] = useState<
//     "direction-service" | "sousdirection-division-section" | null
//   >(null);

//   // IDs sélectionnés
//   const [direction_id, setDirection_id] = useState<number | undefined>();
//   const [service_id, setService_id] = useState<number | undefined>();
//   const [sous_direction_id, setSous_direction_id] = useState<
//     number | undefined
//   >();
//   const [division_id, setDivision_id] = useState<number | undefined>();
//   const [section_id, setSection_id] = useState<number | undefined>();

//   // Listes déroulantes
//   const [allDirections, setAllDirections] = useState<Direction[]>([]);
//   const [allServices, setAllServices] = useState<Service[]>([]);
//   const [allSousDirections, setAllSousDirections] = useState<SousDirection[]>(
//     [],
//   );
//   const [allDivisions, setAllDivisions] = useState<Division[]>([]);
//   const [allSections, setAllSections] = useState<Section[]>([]);

//   // Fonctions disponibles
//   const [fonctions, setFonctions] = useState<Fonction[]>([]);
//   const [fonctionId, setFonctionId] = useState<number | undefined>();

//   // Photo
//   const [photoFile, setPhotoFile] = useState<File | null>(null);

//   // --- Chargement initial ---
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       const dirs = await getDirections();
//       setAllDirections(Array.isArray(dirs) ? dirs : []);
//     };
//     fetchInitialData();
//   }, []);

//   // --- Chargement des données d'édition ---
//   useEffect(() => {
//     if (visible) {
//       setNom(initial.nom || "");
//       setPrenom(initial.prenom || "");
//       setEmail(initial.email || "");
//       setTelephone(initial.telephone || "");
//       setNumMatricule(initial.num_matricule || "");
//       setPhotoFile(null);
//       setDroit(initial.droit || droits[0]?.id || "");

//       // Logique d'édition pour l'affectation
//       if (initial.direction_id) {
//         setDirection_id(initial.direction_id);
//         setSelectedPath("direction-service");
//         loadDirectionData(initial.direction_id);
//       }
//       if (initial.service_id) {
//         setService_id(initial.service_id);
//       }
//       if (initial.sous_direction_id) {
//         setSous_direction_id(initial.sous_direction_id);
//         setSelectedPath("sousdirection-division-section");
//         loadSousDirectionData(initial.sous_direction_id);
//       }
//       if (initial.division_id) {
//         setDivision_id(initial.division_id);
//         loadDivisionData(initial.division_id);
//       }
//       if (initial.section_id) {
//         setSection_id(initial.section_id);
//         loadSectionData(initial.section_id);
//       }
//       if (initial.fonction) {
//         setFonctionId(initial.fonction);
//       }
//     } else {
//       // Reset
//       setDirection_id(undefined);
//       setService_id(undefined);
//       setSous_direction_id(undefined);
//       setDivision_id(undefined);
//       setSection_id(undefined);
//       setSelectedPath(null);
//       setAllServices([]);
//       setAllSousDirections([]);
//       setAllDivisions([]);
//       setAllSections([]);
//       setFonctions([]);
//       setFonctionId(undefined);
//     }
//   }, [visible, droits]);

//   // --- Fonctions de chargement des données ---
//   const loadDirectionData = async (id: number) => {
//     const [services, sousDirections, funcs] = await Promise.all([
//       getServicesByDirection(id),
//       getSousDirectionsByDirection(id),
//       getFunctionsByDirection(id),
//     ]);
//     setAllServices(Array.isArray(services) ? services : []);
//     setAllSousDirections(Array.isArray(sousDirections) ? sousDirections : []);
//     setFonctions(Array.isArray(funcs) ? funcs : []);
//   };

//   const loadSousDirectionData = async (id: number) => {
//     const [divisions, funcs] = await Promise.all([
//       getDivisionsBySousDirection(id),
//       getFunctionsBySousDirection(id),
//     ]);
//     setAllDivisions(Array.isArray(divisions) ? divisions : []);
//     setFonctions(Array.isArray(funcs) ? funcs : []);
//   };

//   const loadDivisionData = async (id: number) => {
//     const [sections, funcs] = await Promise.all([
//       getSectionsByDivision(id),
//       getFunctionsByDivision(id),
//     ]);
//     setAllSections(Array.isArray(sections) ? sections : []);
//     setFonctions(Array.isArray(funcs) ? funcs : []);
//   };

//   const loadSectionData = async (id: number) => {
//     const funcs = await getFunctionsBySection(id);
//     setFonctions(Array.isArray(funcs) ? funcs : []);
//   };

//   // --- Handlers pour le chemin Direction → Service ---
//   const handleDirectionChange = async (id: number) => {
//     setDirection_id(id);
//     setService_id(undefined);
//     setSelectedPath("direction-service");

//     // Réinitialiser l'autre chemin
//     setSous_direction_id(undefined);
//     setDivision_id(undefined);
//     setSection_id(undefined);
//     setAllDivisions([]);
//     setAllSections([]);

//     await loadDirectionData(id);
//   };

//   const handleServiceChange = async (id: number) => {
//     setService_id(id);
//     const funcs = await getFunctionsByService(id);
//     setFonctions(Array.isArray(funcs) ? funcs : []);
//   };

//   // --- Handlers pour le chemin Sous-direction → Division → Section ---
//   const handleSousDirectionChange = async (id: number) => {
//     setSous_direction_id(id);
//     setDivision_id(undefined);
//     setSection_id(undefined);
//     setSelectedPath("sousdirection-division-section");

//     // Réinitialiser l'autre chemin
//     setDirection_id(undefined);
//     setService_id(undefined);
//     setAllServices([]);
//     setAllSousDirections([]);

//     await loadSousDirectionData(id);
//   };

//   const handleDivisionChange = async (id: number) => {
//     setDivision_id(id);
//     setSection_id(undefined);
//     await loadDivisionData(id);
//   };

//   const handleSectionChange = async (id: number) => {
//     setSection_id(id);
//     await loadSectionData(id);
//   };

//   // --- Soumission ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload: Partial<User> = {
//       nom,
//       prenom,
//       email,
//       telephone,
//       num_matricule: numMatricule,
//       droit: typeof droit === "object" ? (droit as any).id : droit,
//     };

//     // Ajouter les IDs d'affectation selon le chemin choisi
//     if (selectedPath === "direction-service") {
//       payload.direction_id = direction_id;
//       payload.service_id = service_id;
//     } else if (selectedPath === "sousdirection-division-section") {
//       payload.sous_direction_id = sous_direction_id;
//       payload.division_id = division_id;
//       payload.section_id = section_id;
//     }

//     // Ajouter la fonction si sélectionnée
//     if (fonctionId) {
//       payload.fonction = fonctionId;
//     }

//     console.log("🚀 Création d'agent avec payload:", payload);
//     console.log("📸 Photo :", photoFile ? photoFile.name : "Aucune");

//     try {
//       await onSubmit(payload, photoFile || undefined);
//       console.log("✅ Agent créé avec succès !");
//       refresh();
//     } catch (error: any) {
//       console.error("❌ ÉCHEC de la création :", error);
//       if (error.response) {
//         console.log("Détails du serveur :", error.response.data);
//       }
//     }
//   };

//   const labelClass =
//     "flex items-center gap-2 text-sm font-bold text-slate-700 mb-2";
//   const inputClass =
//     "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-orange-900 font-medium";

//   return (
//     <Dialog
//       header={
//         <div className="flex items-center gap-2 text-orange-900 font-bold">
//           <UserPlus size={20} className="text-orange-500" />
//           <span>{title}</span>
//         </div>
//       }
//       visible={visible}
//       style={{ width: "900px" }}
//       onHide={onHide}
//       draggable={false}
//       className="rounded-3xl"
//     >
//       <form onSubmit={handleSubmit} className="pt-4 grid grid-cols-2 gap-6">
//         {/* Colonne Gauche: Identité */}
//         <div className="space-y-4">
//           <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b pb-2">
//             Identité
//           </h3>

//           <div className="grid grid-cols-2 gap-3">
//             <div className="group">
//               <label className={labelClass}>
//                 <UserIcon size={14} /> Nom
//               </label>
//               <InputText
//                 value={nom}
//                 onChange={(e) => setNom(e.target.value)}
//                 className={inputClass}
//                 required
//               />
//             </div>
//             <div className="group">
//               <label className={labelClass}>
//                 <UserIcon size={14} /> Prénom
//               </label>
//               <InputText
//                 value={prenom}
//                 onChange={(e) => setPrenom(e.target.value)}
//                 className={inputClass}
//                 required
//               />
//             </div>
//           </div>

//           <div className="group">
//             <label className={labelClass}>
//               <Fingerprint size={14} /> Matricule
//             </label>
//             <InputText
//               value={numMatricule}
//               onChange={(e) => setNumMatricule(e.target.value)}
//               className={inputClass}
//               required
//             />
//           </div>

//           <div>
//             <label className={labelClass}>
//               Profil <span className="text-red-500">*</span>
//             </label>
//             <Dropdown
//               value={droit}
//               options={droits.map((x) => ({ label: x.libelle, value: x.id }))}
//               onChange={(e) => setDroit(e.value)}
//               placeholder="Choisir type d'accréditation"
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl"
//             />
//           </div>

//           <div className="group">
//             <label className={labelClass}>
//               <Mail size={14} /> Email
//             </label>
//             <InputText
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={inputClass}
//               type="email"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="group">
//               <label className={labelClass}>
//                 <Phone size={14} /> Téléphone
//               </label>
//               <InputText
//                 value={telephone}
//                 onChange={(e) => setTelephone(e.target.value)}
//                 className={inputClass}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className={labelClass}>Photo de profil</label>
//             <div className="flex items-center gap-3 p-4 bg-orange-50/50 border-2 border-dashed border-orange-200 rounded-xl">
//               <Camera className="text-orange-500" size={24} />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
//                 className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white cursor-pointer"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Colonne Droite: Affectation */}
//         <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
//           <h3 className="text-xs font-black uppercase text-orange-500 tracking-widest border-b border-orange-100 pb-2">
//             Affectation
//           </h3>

//           {/* CHEMIN 1: Direction → Service */}
//           <div className="border rounded-xl p-3 hover:border-orange-200 transition-all">
//             <h4 className="text-xs font-bold mb-2 flex items-center gap-1">
//               <Building2 size={14} className="text-orange-600" />
//               Chemin 1 : Direction → Service
//             </h4>

//             <div className="space-y-2">
//               <Dropdown
//                 value={direction_id}
//                 options={allDirections}
//                 optionLabel="libelle"
//                 optionValue="id"
//                 onChange={(e) => handleDirectionChange(e.value)}
//                 placeholder="Choisir une direction"
//                 className="w-full text-sm"
//                 filter
//               />

//               <Dropdown
//                 value={service_id}
//                 options={allServices}
//                 optionLabel="libelle"
//                 optionValue="id"
//                 onChange={(e) => handleServiceChange(e.value)}
//                 placeholder="Service (optionnel)"
//                 className="w-full text-sm"
//                 disabled={!direction_id}
//                 filter
//                 showClear
//               />
//             </div>
//           </div>

//           {/* Séparateur */}
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-slate-200"></div>
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-slate-50 px-4 text-slate-400 font-bold">
//                 OU
//               </span>
//             </div>
//           </div>

//           {/* CHEMIN 2: Sous-direction → Division → Section */}
//           <div className="border rounded-xl p-3 hover:border-orange-200 transition-all">
//             <h4 className="text-xs font-bold mb-2 flex items-center gap-1">
//               <Split size={14} className="text-blue-600" />
//               Chemin 2 : Sous-direction → Division → Section
//             </h4>

//             <div className="space-y-2">
//               <Dropdown
//                 value={sous_direction_id}
//                 options={allSousDirections}
//                 optionLabel="libelle"
//                 optionValue="id"
//                 onChange={(e) => handleSousDirectionChange(e.value)}
//                 placeholder={
//                   direction_id
//                     ? "Choisir une sous-direction"
//                     : "Sélectionnez d'abord une direction"
//                 }
//                 className="w-full text-sm"
//                 disabled={!direction_id}
//                 filter
//               />

//               <Dropdown
//                 value={division_id}
//                 options={allDivisions}
//                 optionLabel="libelle"
//                 optionValue="id"
//                 onChange={(e) => handleDivisionChange(e.value)}
//                 placeholder="Choisir une division"
//                 className="w-full text-sm"
//                 disabled={!sous_direction_id}
//                 filter
//                 showClear
//               />

//               <Dropdown
//                 value={section_id}
//                 options={allSections}
//                 optionLabel="libelle"
//                 optionValue="id"
//                 onChange={(e) => handleSectionChange(e.value)}
//                 placeholder="Section (optionnel)"
//                 className="w-full text-sm"
//                 disabled={!division_id}
//                 filter
//                 showClear
//               />
//             </div>
//           </div>

//           {/* Fonction */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
//               <Briefcase size={14} className="text-purple-500" /> Fonction /
//               Poste
//             </label>
//             <Dropdown
//               value={fonctionId}
//               options={fonctions}
//               optionLabel="libelle"
//               optionValue="id"
//               onChange={(e) => setFonctionId(e.value)}
//               placeholder="Attribuer une fonction"
//               className="w-full rounded-xl"
//               disabled={!direction_id && !sous_direction_id}
//               filter
//             />
//             {!direction_id && !sous_direction_id && (
//               <p className="text-[10px] text-slate-400 mt-1 italic">
//                 Sélectionnez d'abord une entité
//               </p>
//             )}
//           </div>

//           {/* Récapitulatif */}
//           {selectedPath && (
//             <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200">
//               <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
//                 Récapitulatif
//               </p>
//               <p className="text-[11px] text-slate-600">
//                 {selectedPath === "direction-service" ? (
//                   <>
//                     <span className="font-bold">Direction :</span>{" "}
//                     {allDirections.find((d) => d.id === direction_id)
//                       ?.libelle || "Non sélectionnée"}
//                     {service_id && (
//                       <>
//                         {" "}
//                         → <span className="font-bold">Service :</span>{" "}
//                         {allServices.find((s) => s.id === service_id)?.libelle}
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   <>
//                     <span className="font-bold">Sous-direction :</span>{" "}
//                     {allSousDirections.find((sd) => sd.id === sous_direction_id)
//                       ?.libelle || "Non sélectionnée"}
//                     {division_id && (
//                       <>
//                         {" "}
//                         → <span className="font-bold">Division :</span>{" "}
//                         {
//                           allDivisions.find((d) => d.id === division_id)
//                             ?.libelle
//                         }
//                       </>
//                     )}
//                     {section_id && (
//                       <>
//                         {" "}
//                         → <span className="font-bold">Section :</span>{" "}
//                         {allSections.find((s) => s.id === section_id)?.libelle}
//                       </>
//                     )}
//                   </>
//                 )}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="col-span-2 flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
//           <Button
//             type="button"
//             label="Annuler"
//             onClick={onHide}
//             className="p-button-text text-slate-500 font-bold"
//           />
//           <Button
//             type="submit"
//             label="Enregistrer l'agent"
//             icon={<Save size={18} className="mr-2" />}
//             className="bg-orange-600 text-white font-bold px-10 py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
//           />
//         </div>
//       </form>
//     </Dialog>
//   );
// }

// UserForm.tsx - Version avec le checkbox et les nouveaux contrôleurs

import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import {
  UserPlus,
  Save,
  Building2,
  Briefcase,
  Mail,
  Phone,
  User as UserIcon,
  Fingerprint,
  Camera,
  Split,
  TreePine,
} from "lucide-react";
import type {
  Direction,
  Service,
  SousDirection,
  Division,
  Section,
  Fonction,
  Droit,
  User,
} from "../../interfaces";

// API imports
import { getDirections } from "../../api/direction";
import { getServicesByDirection } from "../../api/service";
import { getSousDirectionsByDirection } from "../../api/sousDirection";
import { getDivisionsBySousDirection } from "../../api/division";
import { getSectionsByDivision } from "../../api/section";
import { getFunctionsByDirection } from "../../api/direction";
import { getFunctionsByService } from "../../api/service";
import { getFunctionsBySousDirection } from "../../api/sousDirection";
import { getFunctionsByDivision } from "../../api/division";
import { getFunctionsBySection } from "../../api/section";

// Types pour les props
type Props = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: Partial<User>, photoFile?: File) => Promise<void>;
  refresh: () => void;
  initial?: Partial<User>;
  title?: string;
  droits: Droit[];
};

type CascadeEntityType = "direction" | "sousDirection" | "division";

// Interface pour l'état du cascade
interface CascadeState {
  enabled: boolean;
  checked: boolean;
  entityType: CascadeEntityType | null;
  entityId: number | null;
  subEntitiesCount: number;
}

export default function UserForm({
  visible,
  onHide,
  onSubmit,
  refresh,
  initial = {},
  title = "Fiche Agent",
  droits,
}: Props) {
  // --- États des champs de base ---
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [numMatricule, setNumMatricule] = useState("");
  const [droit, setDroit] = useState<Droit | string>(
    initial.droit || droits[0]?.id || "",
  );

  // --- États pour le chemin d'affectation ---
  const [selectedPath, setSelectedPath] = useState<
    "direction-service" | "sousdirection-division-section" | null
  >(null);

  // IDs sélectionnés
  const [direction_id, setDirection_id] = useState<number | undefined>();
  const [service_id, setService_id] = useState<number | undefined>();
  const [sous_direction_id, setSous_direction_id] = useState<
    number | undefined
  >();
  const [division_id, setDivision_id] = useState<number | undefined>();
  const [section_id, setSection_id] = useState<number | undefined>();

  // Listes déroulantes
  const [allDirections, setAllDirections] = useState<Direction[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [allSousDirections, setAllSousDirections] = useState<SousDirection[]>(
    [],
  );
  const [allDivisions, setAllDivisions] = useState<Division[]>([]);
  const [allSections, setAllSections] = useState<Section[]>([]);

  // État du checkbox cascade
  const [cascadeState, setCascadeState] = useState<CascadeState>({
    enabled: false,
    checked: false,
    entityType: null,
    entityId: null,
    subEntitiesCount: 0,
  });

  // Fonctions disponibles
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [fonctionId, setFonctionId] = useState<number | undefined>();

  // Photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // --- Chargement initial ---
  useEffect(() => {
    const fetchInitialData = async () => {
      const dirs = await getDirections();
      setAllDirections(Array.isArray(dirs) ? dirs : []);
    };
    fetchInitialData();
  }, []);

  // --- Fonction pour vérifier les sous-entités ---
  const checkSubEntities = async (
    type: string,
    id: number,
  ): Promise<number> => {
    try {
      let count = 0;
      switch (type) {
        case "direction":
          const services = await getServicesByDirection(id);
          const sousDirections = await getSousDirectionsByDirection(id);
          count = services.length + sousDirections.length;
          break;
        case "sousDirection":
          const divisions = await getDivisionsBySousDirection(id);
          count = divisions.length;
          break;
        case "division":
          const sections = await getSectionsByDivision(id);
          count = sections.length;
          break;
      }
      return count;
    } catch (error) {
      console.error("Erreur vérification sous-entités:", error);
      return 0;
    }
  };

  // --- Surveiller les changements d'entité ---
  useEffect(() => {
    const updateCascadeState = async () => {
      if (selectedPath === "direction-service" && direction_id) {
        const count = await checkSubEntities("direction", direction_id);
        setCascadeState({
          enabled: count > 0,
          checked: false,
          entityType: "direction",
          entityId: direction_id,
          subEntitiesCount: count,
        });
      } else if (
        selectedPath === "sousdirection-division-section" &&
        sous_direction_id
      ) {
        const count = await checkSubEntities(
          "sousDirection",
          sous_direction_id,
        );
        setCascadeState({
          enabled: count > 0,
          checked: false,
          entityType: "sousDirection",
          entityId: sous_direction_id,
          subEntitiesCount: count,
        });
      } else if (
        selectedPath === "sousdirection-division-section" &&
        division_id &&
        !sous_direction_id
      ) {
        const count = await checkSubEntities("division", division_id);
        setCascadeState({
          enabled: count > 0,
          checked: false,
          entityType: "division",
          entityId: division_id,
          subEntitiesCount: count,
        });
      } else {
        setCascadeState((prev) => ({
          ...prev,
          enabled: false,
          checked: false,
        }));
      }
    };

    updateCascadeState();
  }, [direction_id, sous_direction_id, division_id, selectedPath]);

  // --- Chargement des données d'édition ---
  useEffect(() => {
    if (visible) {
      setNom(initial.nom || "");
      setPrenom(initial.prenom || "");
      setEmail(initial.email || "");
      setTelephone(initial.telephone || "");
      setNumMatricule(initial.num_matricule || "");
      setPhotoFile(null);
      setDroit(initial.droit || droits[0]?.id || "");

      if (initial.direction_id) {
        setDirection_id(initial.direction_id);
        setSelectedPath("direction-service");
        loadDirectionData(initial.direction_id);
      }
      if (initial.service_id) {
        setService_id(initial.service_id);
      }
      if (initial.sous_direction_id) {
        setSous_direction_id(initial.sous_direction_id);
        setSelectedPath("sousdirection-division-section");
        loadSousDirectionData(initial.sous_direction_id);
      }
      if (initial.division_id) {
        setDivision_id(initial.division_id);
        loadDivisionData(initial.division_id);
      }
      if (initial.section_id) {
        setSection_id(initial.section_id);
        loadSectionData(initial.section_id);
      }
      if (initial.fonction) {
        setFonctionId(initial.fonction);
      }
    } else {
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
      setFonctions([]);
      setFonctionId(undefined);
      setCascadeState((prev) => ({ ...prev, enabled: false, checked: false }));
    }
  }, [visible, droits]);

  // --- Fonctions de chargement ---
  const loadDirectionData = async (id: number) => {
    const [services, sousDirections, funcs] = await Promise.all([
      getServicesByDirection(id),
      getSousDirectionsByDirection(id),
      getFunctionsByDirection(id),
    ]);
    setAllServices(Array.isArray(services) ? services : []);
    setAllSousDirections(Array.isArray(sousDirections) ? sousDirections : []);
    setFonctions(Array.isArray(funcs) ? funcs : []);
  };

  const loadSousDirectionData = async (id: number) => {
    const [divisions, funcs] = await Promise.all([
      getDivisionsBySousDirection(id),
      getFunctionsBySousDirection(id),
    ]);
    setAllDivisions(Array.isArray(divisions) ? divisions : []);
    setFonctions(Array.isArray(funcs) ? funcs : []);
  };

  const loadDivisionData = async (id: number) => {
    const [sections, funcs] = await Promise.all([
      getSectionsByDivision(id),
      getFunctionsByDivision(id),
    ]);
    setAllSections(Array.isArray(sections) ? sections : []);
    setFonctions(Array.isArray(funcs) ? funcs : []);
  };

  const loadSectionData = async (id: number) => {
    const funcs = await getFunctionsBySection(id);
    setFonctions(Array.isArray(funcs) ? funcs : []);
  };

  // --- Handlers ---
  const handleDirectionChange = async (id: number) => {
    setDirection_id(id);
    setService_id(undefined);
    setSelectedPath("direction-service");
    setSous_direction_id(undefined);
    setDivision_id(undefined);
    setSection_id(undefined);
    setAllDivisions([]);
    setAllSections([]);
    await loadDirectionData(id);
  };

  const handleServiceChange = async (id: number) => {
    setService_id(id);
    const funcs = await getFunctionsByService(id);
    setFonctions(Array.isArray(funcs) ? funcs : []);
  };

  const handleSousDirectionChange = async (id: number) => {
    setSous_direction_id(id);
    setDivision_id(undefined);
    setSection_id(undefined);
    setSelectedPath("sousdirection-division-section");
    setDirection_id(undefined);
    setService_id(undefined);
    setAllServices([]);
    setAllSousDirections([]);
    await loadSousDirectionData(id);
  };

  const handleDivisionChange = async (id: number) => {
    setDivision_id(id);
    setSection_id(undefined);
    await loadDivisionData(id);
  };

  const handleSectionChange = async (id: number) => {
    setSection_id(id);
    await loadSectionData(id);
  };

  // --- Soumission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<User> & {
      cascadeAccess?: {
        enabled: boolean;
        entityType: string | null;
        entityId: number | null;
      };
    } = {
      nom,
      prenom,
      email,
      telephone,
      num_matricule: numMatricule,
      droit: typeof droit === "object" ? (droit as any).id : droit,
    };

    if (selectedPath === "direction-service") {
      payload.direction_id = direction_id;
      payload.service_id = service_id;
    } else if (selectedPath === "sousdirection-division-section") {
      payload.sous_direction_id = sous_direction_id;
      payload.division_id = division_id;
      payload.section_id = section_id;
    }

    if (fonctionId) {
      payload.fonction = fonctionId;
    }

    // Ajouter les informations du cascade si la case est cochée
    if (
      cascadeState.checked &&
      cascadeState.entityType &&
      cascadeState.entityId
    ) {
      payload.cascadeAccess = {
        enabled: true,
        entityType: cascadeState.entityType,
        entityId: cascadeState.entityId,
      };
    }

    try {
      await onSubmit(payload, photoFile || undefined);
      refresh();
    } catch (error: any) {
      console.error("❌ ÉCHEC:", error);
    }
  };

  const labelClass =
    "flex items-center gap-2 text-sm font-bold text-slate-700 mb-2";
  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-orange-900 font-medium";

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2 text-orange-900 font-bold">
          <UserPlus size={20} className="text-orange-500" />
          <span>{title}</span>
        </div>
      }
      visible={visible}
      style={{ width: "950px" }}
      onHide={onHide}
      draggable={false}
      className="rounded-3xl"
    >
      <form onSubmit={handleSubmit} className="pt-4 grid grid-cols-2 gap-6">
        {/* Colonne Gauche: Identité */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b pb-2">
            Identité
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                <UserIcon size={14} /> Nom
              </label>
              <InputText
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                <UserIcon size={14} /> Prénom
              </label>
              <InputText
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              <Fingerprint size={14} /> Matricule
            </label>
            <InputText
              value={numMatricule}
              onChange={(e) => setNumMatricule(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Profil <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={droit}
              options={droits.map((x) => ({ label: x.libelle, value: x.id }))}
              onChange={(e) => setDroit(e.value)}
              placeholder="Choisir type d'accréditation"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className={labelClass}>
              <Mail size={14} /> Email
            </label>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              type="email"
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              <Phone size={14} /> Téléphone
            </label>
            <InputText
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Photo de profil</label>
            <div className="flex items-center gap-3 p-4 bg-orange-50/50 border-2 border-dashed border-orange-200 rounded-xl">
              <Camera className="text-orange-500" size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Colonne Droite: Affectation */}
        <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-black uppercase text-orange-500 tracking-widest border-b border-orange-100 pb-2">
            Affectation
          </h3>

          {/* CHEMIN 1 */}
          <div className="border rounded-xl p-3">
            <h4 className="text-xs font-bold mb-2 flex items-center gap-1">
              <Building2 size={14} className="text-orange-600" /> Direction →
              Service
            </h4>
            <div className="space-y-2">
              <Dropdown
                value={direction_id}
                options={allDirections}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => handleDirectionChange(e.value)}
                placeholder="Choisir une direction"
                className="w-full text-sm"
                filter
              />
              <Dropdown
                value={service_id}
                options={allServices}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => handleServiceChange(e.value)}
                placeholder="Service (optionnel)"
                className="w-full text-sm"
                disabled={!direction_id}
                filter
                showClear
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-4 text-slate-400 font-bold">
                OU
              </span>
            </div>
          </div>

          {/* CHEMIN 2 */}
          <div className="border rounded-xl p-3">
            <h4 className="text-xs font-bold mb-2 flex items-center gap-1">
              <Split size={14} className="text-blue-600" /> Sous-direction →
              Division → Section
            </h4>
            <div className="space-y-2">
              <Dropdown
                value={sous_direction_id}
                options={allSousDirections}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => handleSousDirectionChange(e.value)}
                placeholder="Choisir une sous-direction"
                className="w-full text-sm"
                disabled={!direction_id}
                filter
              />
              <Dropdown
                value={division_id}
                options={allDivisions}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => handleDivisionChange(e.value)}
                placeholder="Choisir une division"
                className="w-full text-sm"
                disabled={!sous_direction_id}
                filter
                showClear
              />
              <Dropdown
                value={section_id}
                options={allSections}
                optionLabel="libelle"
                optionValue="id"
                onChange={(e) => handleSectionChange(e.value)}
                placeholder="Section (optionnel)"
                className="w-full text-sm"
                disabled={!division_id}
                filter
                showClear
              />
            </div>
          </div>

          {/* CHECKBOX CASCADE */}
          {cascadeState.enabled && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Checkbox
                  inputId="cascadeAccess"
                  checked={cascadeState.checked}
                  onChange={(e) =>
                    setCascadeState((prev) => ({
                      ...prev,
                      checked: e.checked || false,
                    }))
                  }
                  className="mt-1 border border-blue"
                />
                <div>
                  <label
                    htmlFor="cascadeAccess"
                    className="text-sm font-bold text-orange-700 cursor-pointer flex items-center gap-2"
                  >
                    <TreePine size={16} /> Accorder l'accès à toutes les
                    sous-entités
                  </label>
                  <p className="text-xs text-orange-600 mt-1">
                    {cascadeState.subEntitiesCount} sous-entité(s) seront
                    accessibles
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Fonction */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Briefcase size={14} className="text-purple-500" /> Fonction
            </label>
            <Dropdown
              value={fonctionId}
              options={fonctions}
              optionLabel="libelle"
              optionValue="id"
              onChange={(e) => setFonctionId(e.value)}
              placeholder="Attribuer une fonction"
              className="w-full rounded-xl"
              disabled={!direction_id && !sous_direction_id}
              filter
            />
          </div>
        </div>

        {/* Footer */}
        <div className="col-span-2 flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
          <Button
            type="button"
            label="Annuler"
            onClick={onHide}
            className="p-button-text text-slate-500 font-bold"
          />
          <Button
            type="submit"
            label="Enregistrer"
            icon={<Save size={18} className="mr-2" />}
            className="bg-orange-600 text-white font-bold px-10 py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
          />
        </div>
      </form>
    </Dialog>
  );
}
