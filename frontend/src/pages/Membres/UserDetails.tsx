import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import {
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  Hash,
  Calendar,
  X,
  Shield,
  Building2,
  Trash2,
  Edit2,
  Lock,
  ArrowRight,
  Building,
  Layers,
  FolderTree,
  Split,
  TableOfContents,
  GitMerge,
  Map,
} from "lucide-react";
import {
  User,
  AgentEntiteeAccess,
  Direction,
  SousDirection,
  Division,
  Section,
  Service,
} from "../../interfaces";
import person from "../../assets/person-96.png";
import { revokeAccess } from "../../api/agentEntiteeAccess";
import { confirmDialog } from "primereact/confirmdialog";
import { useState, useEffect, useMemo, useRef } from "react";
import { Toast } from "primereact/toast";

type Props = {
  visible: boolean;
  onHide: () => void;
  user: User | null;
  onEditAccess: (access: AgentEntiteeAccess) => void;
  onRefresh: () => void;
};

export default function UserDetails({
  visible,
  onHide,
  user,
  onEditAccess,
  onRefresh,
}: Props) {
  const [expandedGroups, setExpandedGroups] = useState<number[]>([
    0, 1, 2, 3, 4,
  ]); // ✅ Tous dépliés par défaut
  const [accesses, setAccesses] = useState<AgentEntiteeAccess[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  // Charger les accès depuis user.agent_access
  useEffect(() => {
    if (user?.agent_access) {
      console.log("🔄 Mise à jour des accès:", user.agent_access.length);
      setAccesses(user.agent_access);
    } else {
      setAccesses([]);
    }
  }, [user]);

  const formatLastActivity = (date?: string) => {
    if (!date) return "Inconnue";

    const now = new Date();
    const last = new Date(date);
    const diffMs = now.getTime() - last.getTime();

    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHour < 24) return `Il y a ${diffHour} h`;
    if (diffDay < 7) return `Il y a ${diffDay} jour(s)`;

    return (
      last.toLocaleDateString("fr-FR") +
      " à " +
      last.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const isOnline = user?.is_on_line === true;

  // ✅ GROUPER PAR TYPE D'ENTITÉ (Direction, SousDirection, Division, Section, Service)
  const groupedByEntityType = useMemo(() => {
    const groups = {
      DIRECTION: [] as AgentEntiteeAccess[],
      SOUSDIRECTION: [] as AgentEntiteeAccess[],
      DIVISION: [] as AgentEntiteeAccess[],
      SECTION: [] as AgentEntiteeAccess[],
      SERVICE: [] as AgentEntiteeAccess[],
    };

    accesses.forEach((access: AgentEntiteeAccess) => {
      if (access.direction) {
        groups.DIRECTION.push(access);
      } else if (access.sousDirection) {
        groups.SOUSDIRECTION.push(access);
      } else if (access.division) {
        groups.DIVISION.push(access);
      } else if (access.section) {
        groups.SECTION.push(access);
      } else if (access.service) {
        groups.SERVICE.push(access);
      }
    });

    console.log("📊 Accès par type d'entité:", {
      DIRECTION: groups.DIRECTION.length,
      SOUSDIRECTION: groups.SOUSDIRECTION.length,
      DIVISION: groups.DIVISION.length,
      SECTION: groups.SECTION.length,
      SERVICE: groups.SERVICE.length,
    });

    return groups;
  }, [accesses]);

  const handleRevoke = async (id: number) => {
    confirmDialog({
      message: `Voulez-vous révoquer définitivement cet accès ? Cette action est irréversible.`,
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      acceptClassName: "p-button-danger p-button-raised p-button-rounded p-2",
      rejectClassName:
        "p-button-secondary p-button-outlined p-button-rounded mr-4 p-2",
      style: { width: "450px" },
      accept: async () => {
        try {
          console.log(`🔄 Tentative de révocation de l'accès #${id}`);

          await revokeAccess(id);

          console.log(`✅ Accès #${id} révoqué, rafraîchissement...`);
          await onRefresh();
        } catch (err: any) {
          console.error(`❌ Erreur lors de la révocation #${id}:`, err);

          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail:
              err.response?.data?.message || "Impossible de révoquer l'accès",
            life: 5000,
          });
        }
      },
    });
  };

  const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3 p-2">
      <div className="mt-1 bg-orange-50 p-2 rounded-lg text-orange-500">
        <Icon size={16} />
      </div>
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <p className="text-sm font-semibold text-orange-900">
          {value || "Non renseigné"}
        </p>
      </div>
    </div>
  );

  if (!user) return null;

  // Déterminer l'affectation principale (priorité aux nouvelles entités)
  const libelleEntitee =
    user.fonction_details?.direction?.libelle ||
    user.fonction_details?.sousDirection?.libelle ||
    user.fonction_details?.division?.libelle ||
    user.fonction_details?.section?.libelle ||
    user.fonction_details?.service?.libelle ||
    user.fonction_details?.entitee_trois?.libelle ||
    user.fonction_details?.entitee_deux?.libelle ||
    user.fonction_details?.entitee_un?.libelle ||
    "Aucune affectation";

  // Configuration des types d'entités pour l'affichage
  const entityTypeConfig = [
    {
      type: "DIRECTION" as const,
      label: "Directions",
      icon: <Building size={18} />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
      lightBg: "bg-blue-50",
      lightText: "text-blue-500",
      getEntity: (access: AgentEntiteeAccess) => access.direction,
      getParentInfo: (access: AgentEntiteeAccess) => null,
    },
    {
      type: "SOUSDIRECTION" as const,
      label: "Sous-directions",
      icon: <Split size={18} />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      iconColor: "text-purple-600",
      lightBg: "bg-purple-50",
      lightText: "text-purple-500",
      getEntity: (access: AgentEntiteeAccess) => access.sousDirection,
      getParentInfo: (access: AgentEntiteeAccess) =>
        access.sousDirection?.direction?.libelle,
    },
    {
      type: "DIVISION" as const,
      label: "Divisions",
      icon: <TableOfContents size={18} />,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-700",
      iconColor: "text-indigo-600",
      lightBg: "bg-indigo-50",
      lightText: "text-indigo-500",
      getEntity: (access: AgentEntiteeAccess) => access.division,
      getParentInfo: (access: AgentEntiteeAccess) =>
        `${access.division?.sousDirection?.libelle || ""} • ${access.division?.sousDirection?.direction?.libelle || ""}`,
    },
    {
      type: "SECTION" as const,
      label: "Sections",
      icon: <GitMerge size={18} />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
      iconColor: "text-orange-600",
      lightBg: "bg-orange-50",
      lightText: "text-orange-500",
      getEntity: (access: AgentEntiteeAccess) => access.section,
      getParentInfo: (access: AgentEntiteeAccess) =>
        `${access.section?.division?.libelle || ""} • ${access.section?.division?.sousDirection?.libelle || ""}`,
    },
    {
      type: "SERVICE" as const,
      label: "Services",
      icon: <Map size={18} />,
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-700",
      iconColor: "text-emerald-600",
      lightBg: "bg-emerald-50",
      lightText: "text-emerald-500",
      getEntity: (access: AgentEntiteeAccess) => access.service,
      getParentInfo: (access: AgentEntiteeAccess) =>
        access.service?.direction?.libelle,
    },
  ];

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={
          <div className="flex items-center gap-2 text-orange-900 font-bold">
            <UserIcon size={20} className="text-orange-500" />
            <span>Détails du compte</span>
          </div>
        }
        visible={visible}
        style={{ width: "850px" }}
        onHide={onHide}
        draggable={false}
        footer={
          <div className="flex justify-end border-t pt-3">
            <Button
              label="Fermer"
              icon={<X size={18} className="mr-2" />}
              onClick={onHide}
              className="p-button-text text-slate-500 font-bold"
            />
          </div>
        }
      >
        <div className="space-y-6 pt-2 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
          {/* Section Profil Header */}
          <div className="flex flex-col items-center pb-4 border-b border-slate-100">
            <div className="relative">
              <img
                src={
                  user.photo_profil
                    ? `http://localhost:5000/uploads/profiles/${user.photo_profil}`
                    : person
                }
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover"
                alt={`${user.prenom} ${user.nom}`}
              />
              <div
                className={`absolute -bottom-1 -right-1 text-white p-1.5 rounded-lg shadow-sm ${
                  isOnline ? "bg-green-500" : "bg-slate-400"
                }`}
              >
                <span className="w-2 h-2 block bg-white rounded-full"></span>
              </div>
            </div>
            <h2 className="mt-3 text-lg font-bold text-orange-900 uppercase tracking-tight">
              {user.prenom} {user.nom}
            </h2>
            <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-3 py-1 rounded-full uppercase mt-1">
              {typeof user.droit === "string"
                ? user.droit
                : user.droit?.libelle}
            </span>
            <div className="flex flex-col items-center mt-2 gap-1">
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                  isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                ● {isOnline ? "En ligne" : "Hors ligne"}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Dernière activité : {formatLastActivity(user.last_activity)}
              </span>
            </div>
          </div>

          {/* Grille d'infos principales */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            <InfoRow
              icon={Building2}
              label="Affectation Principale"
              value={libelleEntitee}
            />
            <InfoRow
              icon={Briefcase}
              label="Poste / Fonction"
              value={user.fonction_details?.libelle}
            />
            <InfoRow
              icon={Mail}
              label="Email Professionnel"
              value={user.email}
            />
            <InfoRow
              icon={Hash}
              label="Numéro Matricule"
              value={user.num_matricule}
            />
            <InfoRow
              icon={Phone}
              label="Contact Téléphonique"
              value={user.telephone}
            />
            <InfoRow
              icon={Calendar}
              label="Date de création"
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("fr-FR")
                  : "-"
              }
            />
          </div>

          {/* Section des accès en Accordéon - 5 TYPES D'ENTITÉS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-800 uppercase flex items-center gap-2">
                <Lock size={14} className="text-orange-500" />
                Accès Documents (Spécifiques)
              </h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
                {accesses.length || 0} Autorisation(s)
              </span>
            </div>

            {loading ? (
              <div className="text-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-xs text-slate-400 mt-2">
                  Chargement des accès...
                </p>
              </div>
            ) : accesses.length > 0 ? (
              <Accordion
                activeIndex={expandedGroups}
                onTabChange={(e) => setExpandedGroups(e.index as number[])}
                multiple
                className="custom-accordion"
              >
                {entityTypeConfig.map((config, index) => {
                  const groupAccesses = groupedByEntityType[config.type];
                  if (groupAccesses.length === 0) return null;

                  return (
                    <AccordionTab
                      key={config.type}
                      header={
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${config.bgColor} ${config.iconColor}`}
                            >
                              {config.icon}
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">
                                  {config.label}
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${config.bgColor} ${config.textColor}`}
                                >
                                  {config.type}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium">
                                {groupAccesses.length} accès • Accès aux{" "}
                                {config.label.toLowerCase()}
                              </p>
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <div className="space-y-2 p-1">
                        {groupAccesses.map((acc: AgentEntiteeAccess) => {
                          const entity = config.getEntity(acc);
                          const parentInfo = config.getParentInfo(acc);

                          return (
                            <div
                              key={acc.id}
                              className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-orange-200 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-lg ${config.lightBg} flex items-center justify-center ${config.lightText}`}
                                >
                                  {config.icon}
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-700">
                                      {entity?.libelle}
                                    </span>
                                    {entity?.code && (
                                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                        {entity.code}
                                      </span>
                                    )}
                                  </div>
                                  {parentInfo && (
                                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                      <span>{parentInfo}</span>
                                      <ArrowRight size={8} />
                                      <span className={config.textColor}>
                                        Lecture & Gestion
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-1">
                                <Button
                                  icon={<Edit2 size={14} />}
                                  className="p-button-text p-button-success p-button-sm p-0 w-8 h-8"
                                  onClick={() => onEditAccess(acc)}
                                  title="Modifier"
                                />
                                <Button
                                  icon={<Trash2 size={14} />}
                                  className="p-button-text p-button-danger p-button-sm p-0 w-8 h-8"
                                  onClick={() => handleRevoke(acc.id!)}
                                  title="Révoquer"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionTab>
                  );
                })}
              </Accordion>
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                <Lock size={24} className="mx-auto text-slate-200 mb-2" />
                <p className="text-[11px] text-slate-400 font-medium italic">
                  Aucun accès spécifique configuré.
                  <br />
                  L'agent est limité à son entité principale.
                </p>
              </div>
            )}
          </div>
        </div>

        <style>{`
        .custom-accordion .p-accordion-header {
          margin-bottom: 8px !important;
        }
        .custom-accordion .p-accordion-header-link {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 16px !important;
          padding: 16px !important;
          transition: all 0.2s;
          text-decoration: none !important;
        }
        .custom-accordion .p-accordion-header-link:hover {
          border-color: #f97316 !important;
          background: #fff7ed !important;
        }
        .custom-accordion .p-accordion-content {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-top: none !important;
          border-bottom-left-radius: 16px !important;
          border-bottom-right-radius: 16px !important;
          padding: 16px !important;
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
      `}</style>
      </Dialog>
    </>
  );
}
