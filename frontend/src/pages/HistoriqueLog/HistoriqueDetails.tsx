// import { Dialog } from "primereact/dialog";
// import { Button } from "primereact/button";
// import {
//   Activity,
//   Database,
//   Calendar,
//   Tag,
//   FileJson,
//   Terminal,
//   User,
//   GitCompare,
//   Trash2,
//   PlusCircle,
//   Edit3,
//   AlertCircle,
//   CheckCircle,
//   ArrowRight,
//   XCircle,
//   ChevronDown,
//   ChevronUp,
//   Eye,
//   Key,
//   Mail,
//   Phone,
//   Hash,
//   Building2,
//   Briefcase,
//   Lock,
//   Globe,
//   Package,
//   FileText,
// } from "lucide-react";
// import type { HistoriqueLog } from "../../interfaces";
// import { useState } from "react";

// // --- Helpers de formatage ---
// const formatAction = (action: string) => {
//   const map: Record<string, string> = {
//     create: "Création",
//     update: "Modification",
//     delete: "Suppression",
//     read: "Consultation",
//     access: "Accès",
//     login: "Connexion",
//     logout: "Déconnexion",
//     upload: "Téléversement",
//   };
//   return map[action] || action;
// };

// const formatResource = (resource: string) => {
//   const map: Record<string, string> = {
//     user: "Agent",
//     droits: "Profil",
//     exercices: "Exercice",
//     fonctions: "Fonction",
//     pieces: "Pièce",
//     document: "Document",
//     documentType: "Type de document",
//     direction: "Direction",
//     sousDirection: "Sous-direction",
//     division: "Division",
//     section: "Section",
//     service: "Service",
//     salle: "Salle",
//     rayon: "Rayon",
//     trave: "Travée",
//     box: "Box",
//     site: "Site",
//     auth: "Authentification",
//   };
//   return map[resource] || resource;
// };

// const getActionColor = (action: string) => {
//   switch (action) {
//     case "create":
//       return {
//         bg: "bg-green-100",
//         text: "text-green-700",
//         icon: PlusCircle,
//         border: "border-green-200",
//         lightBg: "bg-green-50",
//       };
//     case "update":
//       return {
//         bg: "bg-blue-100",
//         text: "text-blue-700",
//         icon: Edit3,
//         border: "border-blue-200",
//         lightBg: "bg-blue-50",
//       };
//     case "delete":
//       return {
//         bg: "bg-red-100",
//         text: "text-red-700",
//         icon: Trash2,
//         border: "border-red-200",
//         lightBg: "bg-red-50",
//       };
//     case "read":
//       return {
//         bg: "bg-purple-100",
//         text: "text-purple-700",
//         icon: Eye,
//         border: "border-purple-200",
//         lightBg: "bg-purple-50",
//       };
//     case "access":
//       return {
//         bg: "bg-yellow-100",
//         text: "text-yellow-700",
//         icon: Key,
//         border: "border-yellow-200",
//         lightBg: "bg-yellow-50",
//       };
//     case "login":
//     case "logout":
//       return {
//         bg: "bg-indigo-100",
//         text: "text-indigo-700",
//         icon: User,
//         border: "border-indigo-200",
//         lightBg: "bg-indigo-50",
//       };
//     default:
//       return {
//         bg: "bg-slate-100",
//         text: "text-slate-700",
//         icon: AlertCircle,
//         border: "border-slate-200",
//         lightBg: "bg-slate-50",
//       };
//   }
// };

// const getMethodStyle = (method: string) => {
//   switch (method?.toUpperCase()) {
//     case "POST":
//       return "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";
//     case "PUT":
//     case "PATCH":
//       return "bg-amber-500/20 text-amber-200 border-amber-500/30";
//     case "DELETE":
//       return "bg-red-500/20 text-red-200 border-red-500/30";
//     case "GET":
//       return "bg-purple-500/20 text-purple-200 border-purple-500/30";
//     default:
//       return "bg-slate-500/20 text-slate-200 border-slate-500/30";
//   }
// };

// const formatDate = (date: string) => {
//   return new Date(date).toLocaleString("fr-FR", {
//     dateStyle: "long",
//     timeStyle: "medium",
//   });
// };

// // ✅ Fonction pour parser les données qui pourraient être des strings JSON
// const parseData = (data: any): any => {
//   if (!data) return data;

//   // Si c'est déjà un objet, le retourner
//   if (typeof data === "object" && data !== null) return data;

//   // Si c'est une string, essayer de parser
//   if (typeof data === "string") {
//     try {
//       // Vérifier si ça ressemble à du JSON
//       if (data.trim().startsWith("{") || data.trim().startsWith("[")) {
//         return JSON.parse(data);
//       }
//     } catch (e) {
//       // Si le parsing échoue, retourner la string originale
//       console.log("Erreur parsing JSON:", e);
//     }
//   }

//   return data;
// };

// const formatValue = (value: any): string => {
//   if (value === null || value === undefined) return "—";
//   if (typeof value === "boolean") return value ? "Oui" : "Non";
//   if (value instanceof Date) return formatDate(value.toISOString());
//   if (typeof value === "object") {
//     try {
//       return JSON.stringify(value, null, 2);
//     } catch (e) {
//       return String(value);
//     }
//   }
//   return String(value);
// };

// const isComplexObject = (value: any): boolean => {
//   return value !== null && typeof value === "object" && !Array.isArray(value);
// };

// interface Props {
//   visible: boolean;
//   onHide: () => void;
//   log: HistoriqueLog | null;
// }

// export default function HistoriqueDetails({ visible, onHide, log }: Props) {
//   const [showRawJson, setShowRawJson] = useState(false);

//   if (!log) return null;

//   // ✅ Parser les données JSON si nécessaire
//   const parsedLog = {
//     ...log,
//     old_data: parseData(log.old_data),
//     new_data: parseData(log.new_data),
//     deleted_data: parseData(log.deleted_data),
//     data: parseData(log.data),
//   };

//   const agent = parsedLog.agent || null;
//   const actionFr = formatAction(parsedLog.action);
//   const resourceFr = formatResource(parsedLog.resource);
//   const actionStyle = getActionColor(parsedLog.action);
//   const ActionIcon = actionStyle.icon;

//   // Fonction pour comparer deux objets et retourner les différences
//   const getCompactChanges = (oldData: any, newData: any) => {
//     // Si ce sont des objets, on compare leurs clés
//     if (
//       typeof oldData === "object" &&
//       oldData !== null &&
//       typeof newData === "object" &&
//       newData !== null
//     ) {
//       const changes: any[] = [];
//       const allKeys = new Set([
//         ...Object.keys(oldData || {}),
//         ...Object.keys(newData || {}),
//       ]);

//       for (const key of Array.from(allKeys).sort()) {
//         if (
//           [
//             "id",
//             "createdAt",
//             "updatedAt",
//             "created_at",
//             "updated_at",
//             "__v",
//             "_id",
//           ].includes(key)
//         )
//           continue;

//         const oldVal = oldData?.[key];
//         const newVal = newData?.[key];

//         if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
//           changes.push({
//             key,
//             old: oldVal,
//             new: newVal,
//           });
//         }
//       }
//       return changes;
//     }

//     // Si ce sont des valeurs simples, on compare directement
//     if (oldData !== newData) {
//       return [
//         {
//           key: "valeur",
//           old: oldData,
//           new: newData,
//         },
//       ];
//     }

//     return [];
//   };

//   const renderChanges = () => {
//     if (
//       parsedLog.action === "update" &&
//       parsedLog.old_data &&
//       parsedLog.new_data
//     ) {
//       const changes = getCompactChanges(parsedLog.old_data, parsedLog.new_data);

//       if (changes.length === 0) {
//         return (
//           <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
//             <CheckCircle size={32} className="mx-auto text-slate-400 mb-3" />
//             <p className="text-sm text-slate-500 font-medium">
//               Aucun changement détecté
//             </p>
//           </div>
//         );
//       }

//       return (
//         <div className="space-y-4">
//           <div className="flex items-center gap-2 px-1">
//             <GitCompare size={16} className="text-blue-600" />
//             <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
//               Modifications ({changes.length})
//             </span>
//           </div>

//           {/* Affichage unique pour les objets JSON complets */}
//           {changes.length === 1 && changes[0].key === "valeur" && (
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-red-50 p-4 rounded-xl border border-red-200">
//                 <p className="text-[10px] font-bold text-red-600 uppercase mb-2">
//                   Avant
//                 </p>
//                 <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
//                   {JSON.stringify(parsedLog.old_data, null, 2)}
//                 </pre>
//               </div>
//               <div className="bg-green-50 p-4 rounded-xl border border-green-200">
//                 <p className="text-[10px] font-bold text-green-600 uppercase mb-2">
//                   Après
//                 </p>
//                 <pre className="text-xs text-green-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
//                   {JSON.stringify(parsedLog.new_data, null, 2)}
//                 </pre>
//               </div>
//             </div>
//           )}

//           {/* Tableau comparatif pour les changements par champ */}
//           {changes.length > 0 && changes[0].key !== "valeur" && (
//             <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 border-b border-slate-200">
//                   <tr>
//                     <th className="p-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-1/4">
//                       Champ
//                     </th>
//                     <th className="p-3 text-left text-[10px] font-bold text-red-500 uppercase tracking-wider w-[35%]">
//                       Avant
//                     </th>
//                     <th className="p-3 text-left text-[10px] font-bold text-green-500 uppercase tracking-wider w-[35%]">
//                       Après
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {changes.map(({ key, old, new: newVal }) => (
//                     <tr
//                       key={key}
//                       className="hover:bg-slate-50/50 transition-colors"
//                     >
//                       <td className="p-3 font-medium text-slate-700 capitalize">
//                         {key.replace(/_/g, " ")}
//                       </td>
//                       <td className="p-3">
//                         {old !== null && old !== undefined ? (
//                           isComplexObject(old) ? (
//                             <div className="bg-red-50 p-2 rounded-lg border border-red-100">
//                               <pre className="text-[10px] text-red-700 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
//                                 {JSON.stringify(old, null, 2)}
//                               </pre>
//                             </div>
//                           ) : (
//                             <span className="text-red-700 font-medium break-all">
//                               {formatValue(old)}
//                             </span>
//                           )
//                         ) : (
//                           <span className="text-slate-400 italic">—</span>
//                         )}
//                       </td>
//                       <td className="p-3">
//                         {newVal !== null && newVal !== undefined ? (
//                           isComplexObject(newVal) ? (
//                             <div className="bg-green-50 p-2 rounded-lg border border-green-100">
//                               <pre className="text-[10px] text-green-700 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
//                                 {JSON.stringify(newVal, null, 2)}
//                               </pre>
//                             </div>
//                           ) : (
//                             <span className="text-green-700 font-medium break-all">
//                               {formatValue(newVal)}
//                             </span>
//                           )
//                         ) : (
//                           <span className="text-slate-400 italic">—</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       );
//     }

//     if (parsedLog.action === "delete" && parsedLog.deleted_data) {
//       return (
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 px-1">
//             <Trash2 size={16} className="text-red-600" />
//             <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
//               Élément supprimé
//             </span>
//           </div>
//           <div className="bg-red-50 p-5 rounded-xl border border-red-200">
//             {isComplexObject(parsedLog.deleted_data) ? (
//               <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
//                 {JSON.stringify(parsedLog.deleted_data, null, 2)}
//               </pre>
//             ) : (
//               <p className="text-sm text-red-800">
//                 {formatValue(parsedLog.deleted_data)}
//               </p>
//             )}
//           </div>
//         </div>
//       );
//     }

//     if (parsedLog.action === "create" && parsedLog.new_data) {
//       return (
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 px-1">
//             <PlusCircle size={16} className="text-green-600" />
//             <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
//               Nouvel élément créé
//             </span>
//           </div>
//           <div className="bg-green-50 p-5 rounded-xl border border-green-200">
//             {isComplexObject(parsedLog.new_data) ? (
//               <pre className="text-xs text-green-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
//                 {JSON.stringify(parsedLog.new_data, null, 2)}
//               </pre>
//             ) : (
//               <p className="text-sm text-green-800">
//                 {formatValue(parsedLog.new_data)}
//               </p>
//             )}
//           </div>
//         </div>
//       );
//     }

//     if (parsedLog.action === "read" && parsedLog.data) {
//       return (
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 px-1">
//             <Eye size={16} className="text-purple-600" />
//             <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
//               Données consultées
//             </span>
//           </div>
//           <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
//             {isComplexObject(parsedLog.data) ? (
//               <pre className="text-xs text-purple-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
//                 {JSON.stringify(parsedLog.data, null, 2)}
//               </pre>
//             ) : (
//               <p className="text-sm text-purple-800">
//                 {formatValue(parsedLog.data)}
//               </p>
//             )}
//           </div>
//         </div>
//       );
//     }

//     return null;
//   };

//   return (
//     <Dialog
//       header={
//         <div className="flex items-center gap-3">
//           <div
//             className={`p-2.5 ${actionStyle.bg} rounded-xl ${actionStyle.text} shadow-sm`}
//           >
//             <ActionIcon size={20} />
//           </div>
//           <div>
//             <h3 className="text-lg font-black text-slate-900 leading-tight">
//               Journal d'Audit
//             </h3>
//             <div className="flex items-center gap-2 mt-0.5">
//               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                 {actionFr}
//               </span>
//               <ArrowRight size={12} className="text-slate-400" />
//               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                 {resourceFr}
//               </span>
//             </div>
//           </div>
//         </div>
//       }
//       visible={visible}
//       style={{ width: "95vw", maxWidth: "900px" }}
//       onHide={onHide}
//       draggable={false}
//       blockScroll
//       className="historique-details-dialog"
//       footer={
//         <div className="flex justify-end gap-2 p-4 border-t border-slate-100">
//           <Button
//             label="Fermer"
//             onClick={onHide}
//             className="bg-slate-100 text-slate-700 font-bold px-8 py-2.5 rounded-xl hover:bg-slate-200 border-none transition-all text-sm"
//           />
//         </div>
//       }
//     >
//       <div className="space-y-4 pt-2 font-sans max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
//         {/* En-tête avec agent et métadonnées */}
//         <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-xl">
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-black text-lg">
//                 {agent?.nom?.charAt(0)}
//                 {agent?.prenom?.charAt(0)}
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-white">
//                   {agent
//                     ? `${agent.prenom} ${agent.nom}`
//                     : "Système Automatique"}
//                 </p>
//                 <p className="text-xs text-slate-300 mt-1">
//                   {typeof agent?.droit === "object"
//                     ? agent.droit.libelle
//                     : agent?.droit || "Utilisateur système"}
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <span
//                 className={`text-[10px] font-black px-2 py-1 rounded border ${getMethodStyle(parsedLog.method)}`}
//               >
//                 {parsedLog.method}
//               </span>
//               {parsedLog.status < 400 ? (
//                 <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
//                   <CheckCircle size={10} /> Succès
//                 </span>
//               ) : (
//                 <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30 flex items-center gap-1">
//                   <XCircle size={10} /> Erreur {parsedLog.status}
//                 </span>
//               )}
//             </div>
//           </div>

//           <p className="text-lg font-bold text-white mb-3">
//             {parsedLog.description || `${actionFr} de ${resourceFr}`}
//           </p>

//           {parsedLog.resource_identifier && (
//             <div className="mb-3 p-3 bg-white/10 rounded-xl border border-white/20">
//               <p className="text-xs text-slate-300 mb-1">Élément concerné</p>
//               <p className="text-sm font-bold text-white">
//                 {parsedLog.resource_identifier}
//               </p>
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
//             <div>
//               <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
//                 Date
//               </p>
//               <p className="text-sm font-medium text-white">
//                 {formatDate(parsedLog.createdAt)}
//               </p>
//             </div>
//             <div>
//               <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
//                 IP / Appareil
//               </p>
//               <p className="text-sm font-medium text-white break-all">
//                 {parsedLog.ip || "—"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Carte des métadonnées */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//           <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
//             <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
//               ID Journal
//             </p>
//             <p className="text-sm font-bold text-slate-800">#{parsedLog.id}</p>
//           </div>
//           <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
//             <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
//               Ressource
//             </p>
//             <p className="text-sm font-bold text-slate-800">
//               {parsedLog.resource}
//               {parsedLog.resource_id && (
//                 <span className="text-xs text-slate-500 ml-1">
//                   #{parsedLog.resource_id}
//                 </span>
//               )}
//             </p>
//           </div>
//           <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
//             <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
//               Action
//             </p>
//             <p className="text-sm font-bold text-slate-800">{actionFr}</p>
//           </div>
//           <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
//             <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
//               Statut
//             </p>
//             <p
//               className={`text-sm font-bold ${
//                 parsedLog.status < 400 ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {parsedLog.status}
//             </p>
//           </div>
//         </div>

//         {/* Détails des changements */}
//         <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//           <div className="p-4 border-b border-slate-100 bg-slate-50">
//             <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
//               Détails de l'opération
//             </h4>
//           </div>
//           <div className="p-4">{renderChanges()}</div>
//         </div>

//         {/* Données JSON brutes */}
//         {parsedLog.data && (
//           <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//             <button
//               onClick={() => setShowRawJson(!showRawJson)}
//               className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
//             >
//               <div className="flex items-center gap-2">
//                 <FileJson size={16} className="text-slate-500" />
//                 <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
//                   Données brutes
//                 </span>
//               </div>
//               {showRawJson ? (
//                 <ChevronUp size={18} className="text-slate-400" />
//               ) : (
//                 <ChevronDown size={18} className="text-slate-400" />
//               )}
//             </button>

//             {showRawJson && (
//               <div className="p-4 border-t border-slate-100 bg-slate-900">
//                 <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono overflow-x-auto max-h-96">
//                   {JSON.stringify(parsedLog.data, null, 2)}
//                 </pre>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <style>{`
//         .historique-details-dialog .p-dialog-header {
//           border-bottom: 1px solid #e2e8f0;
//           padding: 1.5rem;
//         }
//         .historique-details-dialog .p-dialog-content {
//           padding: 1.5rem;
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//       `}</style>
//     </Dialog>
//   );
// }

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import {
  Activity,
  Database,
  Calendar,
  Tag,
  FileJson,
  Terminal,
  User,
  GitCompare,
  Trash2,
  PlusCircle,
  Edit3,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  XCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Key,
} from "lucide-react";
import type { HistoriqueLog } from "../../interfaces";
import { useState, useEffect } from "react";
import { getDirectionById } from "../../api/direction";
import { getDivisionById } from "../../api/division";
import { getServiceById } from "../../api/service";
import { getSectionById } from "../../api/section";
import { getDocumentById } from "../../api/document";
import { getPieceById } from "../../api/pieces";
import { getDroitById } from "../../api/droit";
import { getFonctionById } from "../../api/fonction";
import { getSousDirectionById } from "../../api/sousDirection";
import { getTypeDocumentById } from "../../api/typeDocument";
import { getGetUserById } from "../../api/users";
import { getPermissionById } from "../../api/permission";

// --- Helpers de formatage ---
const formatAction = (action: string) => {
  const map: Record<string, string> = {
    create: "Création",
    update: "Modification",
    delete: "Suppression",
    read: "Consultation",
    access: "Accès",
    login: "Connexion",
    logout: "Déconnexion",
    upload: "Téléversement",
  };
  return map[action] || action;
};

const formatResource = (resource: string) => {
  const map: Record<string, string> = {
    user: "Agent",
    droits: "Profil",
    exercices: "Exercice",
    fonctions: "Fonction",
    pieces: "Pièce",
    document: "Document",
    documentType: "Type de document",
    direction: "Direction",
    sousDirection: "Sous-direction",
    division: "Division",
    section: "Section",
    service: "Service",
    salle: "Salle",
    rayon: "Rayon",
    trave: "Travée",
    box: "Box",
    site: "Site",
    auth: "Authentification",
  };
  return map[resource] || resource;
};

const getActionColor = (action: string) => {
  switch (action) {
    case "create":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: PlusCircle,
        border: "border-green-200",
        lightBg: "bg-green-50",
      };
    case "update":
      return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: Edit3,
        border: "border-blue-200",
        lightBg: "bg-blue-50",
      };
    case "delete":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: Trash2,
        border: "border-red-200",
        lightBg: "bg-red-50",
      };
    case "read":
      return {
        bg: "bg-purple-100",
        text: "text-purple-700",
        icon: Eye,
        border: "border-purple-200",
        lightBg: "bg-purple-50",
      };
    case "access":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Key,
        border: "border-yellow-200",
        lightBg: "bg-yellow-50",
      };
    case "login":
    case "logout":
      return {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        icon: User,
        border: "border-indigo-200",
        lightBg: "bg-indigo-50",
      };
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        icon: AlertCircle,
        border: "border-slate-200",
        lightBg: "bg-slate-50",
      };
  }
};

const getMethodStyle = (method: string) => {
  switch (method?.toUpperCase()) {
    case "POST":
      return "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";
    case "PUT":
    case "PATCH":
      return "bg-amber-500/20 text-amber-200 border-amber-500/30";
    case "DELETE":
      return "bg-red-500/20 text-red-200 border-red-500/30";
    case "GET":
      return "bg-purple-500/20 text-purple-200 border-purple-500/30";
    default:
      return "bg-slate-500/20 text-slate-200 border-slate-500/30";
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "medium",
  });
};

// ✅ Fonction pour parser les données qui pourraient être des strings JSON
const parseData = (data: any): any => {
  if (!data) return data;
  if (typeof data === "object" && data !== null) return data;
  if (typeof data === "string") {
    try {
      if (data.trim().startsWith("{") || data.trim().startsWith("[")) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.log("Erreur parsing JSON:", e);
    }
  }
  return data;
};

// ✅ Fonction pour enrichir les données avec des noms depuis l'API
const enrichDataWithNames = async (
  data: any,
  resourceType: string,
): Promise<any> => {
  if (!data || typeof data !== "object") return data;

  const enriched = { ...data };

  // Enrichir les IDs avec leurs noms correspondants
  const enrichmentMap: Record<string, (id: number) => Promise<string>> = {
    direction_id: async (id) => {
      try {
        const direction = await getDirectionById(id);
        return direction?.libelle || `Direction #${id}`;
      } catch {
        return `Direction #${id}`;
      }
    },
    sous_direction_id: async (id) => {
      try {
        const sousDirection = await getSousDirectionById(id);
        return sousDirection?.libelle || `Sous-direction #${id}`;
      } catch {
        return `Sous-direction #${id}`;
      }
    },
    division_id: async (id) => {
      try {
        const division = await getDivisionById(id);
        return division?.libelle || `Division #${id}`;
      } catch {
        return `Division #${id}`;
      }
    },
    section_id: async (id) => {
      try {
        const section = await getSectionById(id);
        return section?.libelle || `Section #${id}`;
      } catch {
        return `Section #${id}`;
      }
    },
    fonction_id: async (id) => {
      try {
        const fonction = await getFonctionById(id);
        return fonction?.libelle || `Fonction #${id}`;
      } catch {
        return `Fonction #${id}`;
      }
    },
    droit_id: async (id) => {
      try {
        const droit = await getDroitById(String(id));
        return droit?.libelle || `Profil #${id}`;
      } catch {
        return `Profil #${id}`;
      }
    },
  };

  for (const [key, fetcher] of Object.entries(enrichmentMap)) {
    if (enriched[key] && typeof enriched[key] === "number") {
      enriched[`${key}_name`] = await fetcher(enriched[key]);
    }
  }

  return enriched;
};

// ✅ Transformer les données JSON en texte lisible
const humanReadableData = (data: any, resourceType?: string): string => {
  if (!data) return "Aucune donnée";

  if (typeof data === "string") return data;
  if (typeof data === "number") return data.toString();
  if (typeof data === "boolean") return data ? "Oui" : "Non";

  if (Array.isArray(data)) {
    if (data.length === 0) return "Aucun élément";
    if (data.length === 1) return humanReadableData(data[0], resourceType);
    return `${data.length} élément(s)`;
  }

  if (typeof data === "object") {
    const labels: Record<string, string> = {
      id: "Identifiant",
      nom: "Nom",
      prenom: "Prénom",
      email: "Email",
      telephone: "Téléphone",
      libelle: "Libellé",
      description: "Description",
      code: "Code",
      adresse: "Adresse",
      created_at: "Date de création",
      updated_at: "Date de modification",
      status: "Statut",
      actif: "Actif",
      direction_id: "Direction",
      direction_id_name: "Direction",
      sous_direction_id: "Sous-direction",
      sous_direction_id_name: "Sous-direction",
      division_id: "Division",
      division_id_name: "Division",
      section_id: "Section",
      section_id_name: "Section",
      fonction_id: "Fonction",
      fonction_id_name: "Fonction",
      droit_id: "Profil",
      droit_id_name: "Profil",
      matricule: "Matricule",
      date_naissance: "Date de naissance",
      lieu_naissance: "Lieu de naissance",
      sexe: "Sexe",
    };

    const ignoreFields = [
      "createdAt",
      "updatedAt",
      "__v",
      "deletedAt",
      "password",
    ];

    const parts: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (ignoreFields.includes(key)) continue;
      if (value === null || value === undefined) continue;

      // Utiliser le nom enrichi si disponible
      let displayKey = key;
      let displayValue = value;

      if (key.endsWith("_name")) {
        continue; // Skip les clés _name car on va utiliser la clé originale
      }

      // Vérifier si on a un nom enrichi pour cette clé
      const enrichedKey = `${key}_name`;
      if (data[enrichedKey]) {
        displayValue = data[enrichedKey];
      }

      const label = labels[key] || key.replace(/_/g, " ");
      const formattedValue = formatValueForDisplay(displayValue);

      if (formattedValue && formattedValue !== "—") {
        parts.push(`${label}: ${formattedValue}`);
      }
    }

    if (parts.length === 0) return "Données disponibles";
    return parts.join(" • ");
  }

  return String(data);
};

// ✅ Formater une valeur pour l'affichage
const formatValueForDisplay = (value: any): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "✅ Oui" : "❌ Non";
  if (typeof value === "object") {
    if (value.nom) return value.nom;
    if (value.libelle) return value.libelle;
    if (value.prenom && value.nom) return `${value.prenom} ${value.nom}`;
    return "✓";
  }
  return String(value);
};

// ✅ Fonction pour obtenir une description lisible des changements
const getHumanReadableChanges = (oldData: any, newData: any): string[] => {
  const changes: string[] = [];

  if (
    typeof oldData === "object" &&
    oldData !== null &&
    typeof newData === "object" &&
    newData !== null
  ) {
    const allKeys = new Set([
      ...Object.keys(oldData || {}),
      ...Object.keys(newData || {}),
    ]);

    const labels: Record<string, string> = {
      nom: "le nom",
      prenom: "le prénom",
      email: "l'email",
      telephone: "le téléphone",
      libelle: "le libellé",
      description: "la description",
      code: "le code",
      adresse: "l'adresse",
      status: "le statut",
      actif: "le statut actif",
      matricule: "le matricule",
      date_naissance: "la date de naissance",
      lieu_naissance: "le lieu de naissance",
      sexe: "le sexe",
      direction_id: "la direction",
      sous_direction_id: "la sous-direction",
      division_id: "la division",
      section_id: "la section",
      fonction_id: "la fonction",
      droit_id: "le profil",
    };

    for (const key of Array.from(allKeys).sort()) {
      if (
        [
          "id",
          "createdAt",
          "updatedAt",
          "created_at",
          "updated_at",
          "__v",
          "_id",
        ].includes(key) ||
        key.endsWith("_name")
      )
        continue;

      const oldVal = oldData?.[key];
      const newVal = newData?.[key];

      // Utiliser les noms enrichis si disponibles
      const oldDisplay =
        oldData[`${key}_name`] || formatValueForDisplay(oldVal);
      const newDisplay =
        newData[`${key}_name`] || formatValueForDisplay(newVal);

      if (oldDisplay !== newDisplay) {
        const fieldName = labels[key] || key.replace(/_/g, " ");

        if (oldDisplay === "—" && newDisplay !== "—") {
          changes.push(`➕ Ajout de ${fieldName} : ${newDisplay}`);
        } else if (oldDisplay !== "—" && newDisplay === "—") {
          changes.push(
            `➖ Suppression de ${fieldName} (était : ${oldDisplay})`,
          );
        } else {
          changes.push(
            `✏️ Modification de ${fieldName} : "${oldDisplay}" → "${newDisplay}"`,
          );
        }
      }
    }
  } else if (oldData !== newData) {
    changes.push(
      `🔄 Modification : "${formatValueForDisplay(oldData)}" → "${formatValueForDisplay(newData)}"`,
    );
  }

  return changes;
};

interface Props {
  visible: boolean;
  onHide: () => void;
  log: HistoriqueLog | null;
}

export default function HistoriqueDetails({ visible, onHide, log }: Props) {
  const [showRawJson, setShowRawJson] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);
  const [loadingEnrichment, setLoadingEnrichment] = useState(false);

  useEffect(() => {
    const enrichData = async () => {
      if (!log) return;

      setLoadingEnrichment(true);

      try {
        const parsedLog = {
          ...log,
          old_data: parseData(log.old_data),
          new_data: parseData(log.new_data),
          deleted_data: parseData(log.deleted_data),
          data: parseData(log.data),
        };

        // Enrichir les données avec les noms depuis l'API
        const enrichedOldData = await enrichDataWithNames(
          parsedLog.old_data,
          log.resource,
        );
        const enrichedNewData = await enrichDataWithNames(
          parsedLog.new_data,
          log.resource,
        );
        const enrichedDeletedData = await enrichDataWithNames(
          parsedLog.deleted_data,
          log.resource,
        );
        const enrichedDataField = await enrichDataWithNames(
          parsedLog.data,
          log.resource,
        );

        setEnrichedData({
          ...parsedLog,
          old_data: enrichedOldData,
          new_data: enrichedNewData,
          deleted_data: enrichedDeletedData,
          data: enrichedDataField,
        });
      } catch (error) {
        console.error("Erreur lors de l'enrichissement des données:", error);
        setEnrichedData({
          ...log,
          old_data: parseData(log.old_data),
          new_data: parseData(log.new_data),
          deleted_data: parseData(log.deleted_data),
          data: parseData(log.data),
        });
      } finally {
        setLoadingEnrichment(false);
      }
    };

    if (visible && log) {
      enrichData();
    }
  }, [visible, log]);

  if (!log) return null;
  if (!enrichedData && loadingEnrichment) {
    return (
      <Dialog
        visible={visible}
        onHide={onHide}
        style={{ width: "95vw", maxWidth: "900px" }}
        header="Chargement..."
      >
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dgcc5"></div>
          <p className="ml-3 text-slate-600">Chargement des détails...</p>
        </div>
      </Dialog>
    );
  }

  const parsedLog = enrichedData || {
    ...log,
    old_data: parseData(log.old_data),
    new_data: parseData(log.new_data),
    deleted_data: parseData(log.deleted_data),
    data: parseData(log.data),
  };

  const agent = parsedLog.agent || null;
  const actionFr = formatAction(parsedLog.action);
  const resourceFr = formatResource(parsedLog.resource);
  const actionStyle = getActionColor(parsedLog.action);
  const ActionIcon = actionStyle.icon;

  const renderChanges = () => {
    if (
      parsedLog.action === "update" &&
      parsedLog.old_data &&
      parsedLog.new_data
    ) {
      const changes = getHumanReadableChanges(
        parsedLog.old_data,
        parsedLog.new_data,
      );

      if (changes.length === 0) {
        return (
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
            <CheckCircle size={32} className="mx-auto text-slate-400 mb-3" />
            <p className="text-sm text-slate-500 font-medium">
              Aucun changement détecté
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <GitCompare size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Modifications effectuées ({changes.length})
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {changes.map((change, idx) => (
                <div
                  key={idx}
                  className="p-4 hover:bg-slate-50/50 transition-colors"
                >
                  <p className="text-sm text-slate-700">{change}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé avant/après pour information supplémentaire */}
          <details className="text-xs text-slate-500">
            <summary className="cursor-pointer hover:text-slate-700">
              Voir le détail technique
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="font-bold text-red-700 mb-2">Avant</p>
                <pre className="text-[10px] text-red-600 whitespace-pre-wrap">
                  {JSON.stringify(parsedLog.old_data, null, 2)}
                </pre>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-bold text-green-700 mb-2">Après</p>
                <pre className="text-[10px] text-green-600 whitespace-pre-wrap">
                  {JSON.stringify(parsedLog.new_data, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      );
    }

    if (parsedLog.action === "delete" && parsedLog.deleted_data) {
      const deletedText = humanReadableData(
        parsedLog.deleted_data,
        parsedLog.resource,
      );

      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Trash2 size={16} className="text-red-600" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
              Élément supprimé
            </span>
          </div>
          <div className="bg-red-50 p-5 rounded-xl border border-red-200">
            <p className="text-sm text-red-800 font-medium">{deletedText}</p>
          </div>
        </div>
      );
    }

    if (parsedLog.action === "create" && parsedLog.new_data) {
      const createdText = humanReadableData(
        parsedLog.new_data,
        parsedLog.resource,
      );

      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <PlusCircle size={16} className="text-green-600" />
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
              Nouvel élément créé
            </span>
          </div>
          <div className="bg-green-50 p-5 rounded-xl border border-green-200">
            <p className="text-sm text-green-800 font-medium">{createdText}</p>
          </div>
        </div>
      );
    }

    if (parsedLog.action === "read" && parsedLog.data) {
      const readText = humanReadableData(parsedLog.data, parsedLog.resource);

      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Eye size={16} className="text-purple-600" />
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
              Données consultées
            </span>
          </div>
          <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-800 font-medium">{readText}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 ${actionStyle.bg} rounded-xl ${actionStyle.text} shadow-sm`}
          >
            <ActionIcon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              Détail de l'opération
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {actionFr}
              </span>
              <ArrowRight size={12} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {resourceFr}
              </span>
            </div>
          </div>
        </div>
      }
      visible={visible}
      style={{ width: "95vw", maxWidth: "900px" }}
      onHide={onHide}
      draggable={false}
      blockScroll
      className="historique-details-dialog"
      footer={
        <div className="flex justify-end gap-2 p-4 border-t border-slate-100">
          <Button
            label="Fermer"
            onClick={onHide}
            className="bg-slate-100 text-slate-700 font-bold px-8 py-2.5 rounded-xl hover:bg-slate-200 border-none transition-all text-sm"
          />
        </div>
      }
    >
      <div className="space-y-4 pt-2 font-sans max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
        {/* En-tête avec agent et métadonnées */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-black text-lg">
                {agent?.nom?.charAt(0)}
                {agent?.prenom?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {agent
                    ? `${agent.prenom} ${agent.nom}`
                    : "Système Automatique"}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  {typeof agent?.droit === "object"
                    ? agent.droit.libelle
                    : agent?.droit || "Utilisateur système"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <span
                className={`text-[10px] font-black px-2 py-1 rounded border ${getMethodStyle(parsedLog.method)}`}
              >
                {parsedLog.method}
              </span>
              {parsedLog.status < 400 ? (
                <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                  <CheckCircle size={10} /> Succès
                </span>
              ) : (
                <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30 flex items-center gap-1">
                  <XCircle size={10} /> Erreur {parsedLog.status}
                </span>
              )}
            </div>
          </div>

          <p className="text-lg font-bold text-white mb-3">
            {parsedLog.description || `${actionFr} de ${resourceFr}`}
          </p>

          {parsedLog.resource_identifier && (
            <div className="mb-3 p-3 bg-white/10 rounded-xl border border-white/20">
              <p className="text-xs text-slate-300 mb-1">Élément concerné</p>
              <p className="text-sm font-bold text-white">
                {parsedLog.resource_identifier}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="text-sm font-medium text-white">
                {formatDate(parsedLog.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                IP / Appareil
              </p>
              <p className="text-sm font-medium text-white break-all">
                {parsedLog.ip || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Carte des métadonnées */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              ID Journal
            </p>
            <p className="text-sm font-bold text-slate-800">#{parsedLog.id}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              Ressource
            </p>
            <p className="text-sm font-bold text-slate-800">
              {parsedLog.resource}
              {parsedLog.resource_id && (
                <span className="text-xs text-slate-500 ml-1">
                  #{parsedLog.resource_id}
                </span>
              )}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              Action
            </p>
            <p className="text-sm font-bold text-slate-800">{actionFr}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              Statut
            </p>
            <p
              className={`text-sm font-bold ${
                parsedLog.status < 400 ? "text-green-600" : "text-red-600"
              }`}
            >
              {parsedLog.status}
            </p>
          </div>
        </div>

        {/* Détails des changements - Version lisible */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Détails de l'opération
            </h4>
          </div>
          <div className="p-4">{renderChanges()}</div>
        </div>

        {/* Données JSON brutes (optionnel, pour les administrateurs) */}
        {(parsedLog.data || parsedLog.old_data || parsedLog.new_data) && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileJson size={16} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Données techniques (JSON)
                </span>
              </div>
              {showRawJson ? (
                <ChevronUp size={18} className="text-slate-400" />
              ) : (
                <ChevronDown size={18} className="text-slate-400" />
              )}
            </button>

            {showRawJson && (
              <div className="p-4 border-t border-slate-100 bg-slate-900">
                <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono overflow-x-auto max-h-96">
                  {JSON.stringify(
                    {
                      data: parsedLog.data,
                      old_data: parsedLog.old_data,
                      new_data: parsedLog.new_data,
                      deleted_data: parsedLog.deleted_data,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .historique-details-dialog .p-dialog-header {
          border-bottom: 1px solid #e2e8f0;
          padding: 1.5rem;
        }
        .historique-details-dialog .p-dialog-content {
          padding: 1.5rem;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        details > summary {
          list-style: none;
        }
        details > summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </Dialog>
  );
}
