import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
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
} from "lucide-react";
import { User, AgentEntiteeAccess } from "../../interfaces";
import person from "../../assets/person-96.png";
import { revokeAccess } from "../../api/agentEntiteeAccess";
import { confirmDialog } from "primereact/confirmdialog";

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
  if (!user) return null;

  // Helper pour les lignes d'information standard
  const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3 p-2">
      <div className="mt-1 bg-emerald-50 p-2 rounded-lg text-emerald-500">
        <Icon size={16} />
      </div>
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <p className="text-sm font-semibold text-emerald-900">
          {value || "Non renseigné"}
        </p>
      </div>
    </div>
  );

  // Détermination du libellé de l'entité principale (fonction)
  const libelleEntitee =
    user.fonction_details?.entitee_trois?.libelle ||
    user.fonction_details?.entitee_deux?.libelle ||
    user.fonction_details?.entitee_un?.libelle ||
    "Aucune affectation";

  // Action de suppression d'un accès spécifique
  const handleRevoke = async (id: number) => {
    confirmDialog({
      message: "Voulez-vous supprimer définitivement cet accès ?",
      header: "Révocation d'accès",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await revokeAccess(id);
          onRefresh(); // Recharge les données du parent
        } catch (err) {
          console.error("Erreur lors de la révocation:", err);
        }
      },
    });
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2 text-emerald-900 font-bold">
          <UserIcon size={20} className="text-emerald-500" />
          <span>Détails du compte</span>
        </div>
      }
      visible={visible}
      style={{ width: "680px" }}
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
      <div className="space-y-6 pt-2">
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
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-lg shadow-sm">
              <Shield size={14} />
            </div>
          </div>
          <h2 className="mt-3 text-lg font-bold text-emerald-900 uppercase tracking-tight">
            {user.prenom} {user.nom}
          </h2>
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase mt-1">
            {typeof user.droit === "string" ? user.droit : user.droit?.libelle}
          </span>
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
          <InfoRow icon={Mail} label="Email Professionnel" value={user.email} />
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

        {/* Section des accès Multi-Entités */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase flex items-center gap-2">
              <Lock size={14} className="text-orange-500" />
              Accès Documents (Spécifiques)
            </h3>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
              {user.agent_access?.length || 0} Autorisation(s)
            </span>
          </div>

          <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-1">
            {user.agent_access && user.agent_access.length > 0 ? (
              user.agent_access.map((acc: AgentEntiteeAccess) => {
                // On récupère le nom de l'entité liée selon le type
                const entityName =
                  acc.entitee_un?.libelle ||
                  acc.entitee_deux?.libelle ||
                  acc.entitee_trois?.libelle ||
                  "Entité inconnue";

                const levelLabels = {
                  UN: "N1 - Direction",
                  DEUX: "N2 - Service",
                  TROIS: "N3 - Division",
                };

                return (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Building2 size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 leading-none mb-1">
                          {entityName}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                          <span>{levelLabels[acc.entitee_type]}</span>
                          <ArrowRight size={10} />
                          <span className="text-slate-400">
                            Lecture & Gestion
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        icon={<Edit2 size={14} />}
                        className="p-button-text p-button-success p-button-sm p-0 w-8 h-8"
                        onClick={() => onEditAccess(acc)}
                        tooltip="Modifier"
                        tooltipOptions={{ position: "top" }}
                      />
                      <Button
                        icon={<Trash2 size={14} />}
                        className="p-button-text p-button-danger p-button-sm p-0 w-8 h-8"
                        onClick={() => handleRevoke(acc.id!)}
                        tooltip="Révoquer"
                        tooltipOptions={{ position: "top" }}
                      />
                    </div>
                  </div>
                );
              })
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
      </div>
    </Dialog>
  );
}
