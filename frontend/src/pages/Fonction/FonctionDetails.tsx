import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import {
  Briefcase,
  Building2,
  Split,
  TableOfContents,
  GitMerge,
  Map,
  Calendar,
  Hash,
} from "lucide-react";
import type { Fonction } from "../../interfaces";

type Props = {
  visible: boolean;
  onHide: () => void;
  fonction: Fonction | null;
};

export default function FonctionDetails({ visible, onHide, fonction }: Props) {
  if (!fonction) return null;

  const formatDate = (date?: string) => {
    if (!date) return "Non définie";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour obtenir l'icône selon le type d'entité
  const getEntityIcon = (type: string) => {
    switch (type) {
      case "direction":
        return <Building2 size={16} className="text-emerald-600" />;
      case "sousDirection":
        return <Split size={16} className="text-indigo-600" />;
      case "division":
        return <TableOfContents size={16} className="text-blue-600" />;
      case "section":
        return <GitMerge size={16} className="text-purple-600" />;
      case "service":
        return <Map size={16} className="text-orange-600" />;
      default:
        return null;
    }
  };

  // Fonction pour obtenir la couleur selon le type d'entité
  const getEntityColor = (type: string) => {
    switch (type) {
      case "direction":
        return "bg-orange-100 text-orange-700";
      case "sousDirection":
        return "bg-indigo-100 text-indigo-700";
      case "division":
        return "bg-blue-100 text-blue-700";
      case "section":
        return "bg-purple-100 text-purple-700";
      case "service":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Briefcase size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">
              Détails de la fonction
            </h2>
            <p className="text-xs text-slate-500">Informations complètes</p>
          </div>
        </div>
      }
      visible={visible}
      style={{ width: "700px" }}
      onHide={onHide}
      className="rounded-3xl"
    >
      <div className="space-y-5 p-2">
        {/* Identité */}
        <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-2xl border border-orange-100">
          <h3 className="text-xs font-black uppercase text-orange-600 tracking-wider mb-3 flex items-center gap-2">
            <Briefcase size={14} /> Identité
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Hash size={16} className="text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  ID
                </p>
                <p className="font-bold text-slate-800">#{fonction.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase size={16} className="text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Libellé
                </p>
                <p className="font-bold text-slate-800 text-lg">
                  {fonction.libelle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Affectation */}
        <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-2xl border border-orange-100">
          <h3 className="text-xs font-black uppercase text-orange-600 tracking-wider mb-3">
            Affectation
          </h3>
          <div className="space-y-3">
            {/* Direction */}
            {fonction.direction && (
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 ${getEntityColor("direction")} rounded-lg flex items-center justify-center`}
                >
                  {getEntityIcon("direction")}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Direction
                  </p>
                  <p className="font-medium text-slate-700">
                    {fonction.direction.libelle}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Code: {fonction.direction.code}
                  </p>
                </div>
              </div>
            )}

            {/* Sous-direction */}
            {fonction.sousDirection && (
              <div className="flex items-center gap-3 ml-4">
                <div
                  className={`w-8 h-8 ${getEntityColor("sousDirection")} rounded-lg flex items-center justify-center`}
                >
                  {getEntityIcon("sousDirection")}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Sous-direction
                  </p>
                  <p className="font-medium text-slate-700">
                    {fonction.sousDirection.libelle}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Code: {fonction.sousDirection.code}
                  </p>
                </div>
              </div>
            )}

            {/* Division */}
            {fonction.division && (
              <div className="flex items-center gap-3 ml-8">
                <div
                  className={`w-8 h-8 ${getEntityColor("division")} rounded-lg flex items-center justify-center`}
                >
                  {getEntityIcon("division")}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Division
                  </p>
                  <p className="font-medium text-slate-700">
                    {fonction.division.libelle}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Code: {fonction.division.code}
                  </p>
                </div>
              </div>
            )}

            {/* Section */}
            {fonction.section && (
              <div className="flex items-center gap-3 ml-12">
                <div
                  className={`w-8 h-8 ${getEntityColor("section")} rounded-lg flex items-center justify-center`}
                >
                  {getEntityIcon("section")}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Section
                  </p>
                  <p className="font-medium text-slate-700">
                    {fonction.section.libelle}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Code: {fonction.section.code}
                  </p>
                </div>
              </div>
            )}

            {/* Service */}
            {fonction.service && (
              <div className="flex items-center gap-3 ml-4">
                <div
                  className={`w-8 h-8 ${getEntityColor("service")} rounded-lg flex items-center justify-center`}
                >
                  {getEntityIcon("service")}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Service
                  </p>
                  <p className="font-medium text-slate-700">
                    {fonction.service.libelle}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Code: {fonction.service.code}
                  </p>
                </div>
              </div>
            )}

            {/* Aucune affectation */}
            {!fonction.direction &&
              !fonction.sousDirection &&
              !fonction.division &&
              !fonction.section &&
              !fonction.service && (
                <div className="text-center py-4">
                  <p className="text-slate-400 text-sm italic">
                    Aucune affectation
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Métadonnées */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">
            Informations système
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  Créé le
                </p>
                <p className="text-xs font-medium text-slate-600">
                  {formatDate(fonction.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  Modifié le
                </p>
                <p className="text-xs font-medium text-slate-600">
                  {formatDate(fonction.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
        <Button
          label="Fermer"
          onClick={onHide}
          className="p-button-text text-slate-500"
        />
      </div>
    </Dialog>
  );
}
