import {
  LayoutDashboard,
  FileText,
  Layers,
  ChevronFirst,
  ChevronLast,
  Search,
  MoreVertical,
  UserRound,
  FolderPen,
  ChevronDown,
  Lock,
  ShieldCheck,
  Split,
  TableOfContents,
  GitFork,
  Landmark,
  History,
  Database,
  Pyramid,
  Archive,
  Warehouse,
  WavesLadder,
  LibraryBig,
  MapPinned,
  GitMerge,
  Building2,
  FileStack,
  Settings2,
  Briefcase,
} from "lucide-react";

import logo from "../../assets/digidoc1.png";
import profil from "../../assets/homme.jpg";
import { Link, useLocation } from "react-router-dom";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProps, SidebarContextType } from "../../interfaces/composant";
import { useAuth } from "../../context/AuthContext";
import { getTypeDocuments } from "../../api/typeDocument";
import {
  TypeDocument,
  User,
  Direction,
  SousDirection,
  Division,
  Section,
} from "../../interfaces";

// NOUVEAUX IMPORTS
import { getDirections } from "../../api/direction";
import { getSousDirections } from "../../api/sousDirection";
import { getDivisions } from "../../api/division";
import { getSections } from "../../api/section";

export const SidebarContext = createContext<SidebarContextType>({
  expended: true,
  treeOpen: {},
  toggleTree: () => {},
});

export default function Sidebar({ children }: SidebarProps) {
  const [expended, setExpended] = useState(true);
  const location = useLocation();
  const { user, can } = useAuth();

  const [treeOpen, setTreeOpen] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem("sidebar-tree");
    return saved ? JSON.parse(saved) : {};
  });

  // ✅ QUERY POUR LES TYPES DE DOCUMENTS
  const { data: docTypes = [] } = useQuery({
    queryKey: ["typeDocuments"],
    queryFn: async () => {
      const res = await getTypeDocuments();
      return res.typeDocument || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // ✅ NOUVELLES QUERIES POUR LES ENTITÉS
  const { data: directions = [] } = useQuery({
    queryKey: ["directions"],
    queryFn: async () => {
      const res = await getDirections();
      return Array.isArray(res) ? res : res || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: sousDirections = [] } = useQuery({
    queryKey: ["sousDirections"],
    queryFn: async () => {
      const res = await getSousDirections();
      return Array.isArray(res) ? res : res || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: divisions = [] } = useQuery({
    queryKey: ["divisions"],
    queryFn: async () => {
      const res = await getDivisions();
      return Array.isArray(res) ? res : res || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ["sections"],
    queryFn: async () => {
      const res = await getSections();
      return Array.isArray(res) ? res : res || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // ✅ Fonction pour vérifier si l'utilisateur est admin
  const isUserAdmin = (user: User | null): boolean => {
    if (!user) return false;

    const droitLibelle =
      typeof user.droit === "object" ? user.droit?.libelle : user.droit;

    if (!droitLibelle) return false;

    const libelle = droitLibelle.toString().toLowerCase();
    return (
      libelle.includes("admin") ||
      libelle.includes("administrateur") ||
      libelle === "admin" ||
      libelle === "administrateur"
    );
  };

  // ✅ NOUVELLE FONCTION : Vérifier l'accès à un document avec les nouvelles entités
  const hasAccessToDocument = (typeDoc: TypeDocument): boolean => {
    // ADMIN voit tout
    if (isUserAdmin(user)) return true;

    // NON-ADMIN : vérifier les accès
    const userEntityIds = {
      direction: new Set<number>(),
      sousDirection: new Set<number>(),
      division: new Set<number>(),
      section: new Set<number>(),
    };

    // Entités de la fonction
    if (user?.fonction_details?.direction?.id) {
      userEntityIds.direction.add(user.fonction_details.direction.id);
    }
    if (user?.fonction_details?.sousDirection?.id) {
      userEntityIds.sousDirection.add(user.fonction_details.sousDirection.id);
    }
    if (user?.fonction_details?.division?.id) {
      userEntityIds.division.add(user.fonction_details.division.id);
    }
    if (user?.fonction_details?.section?.id) {
      userEntityIds.section.add(user.fonction_details.section.id);
    }

    // Entités des agent_access - CORRIGÉ (userEntityIds au lieu de ids)
    user?.agent_access?.forEach((access) => {
      // Direction
      if (access.direction_id) {
        userEntityIds.direction.add(access.direction_id);
      } else if (access.direction?.id) {
        userEntityIds.direction.add(access.direction.id);
      }

      // Sous-direction
      if (access.sous_direction_id) {
        userEntityIds.sousDirection.add(access.sous_direction_id);
      } else if (access.sousDirection?.id) {
        userEntityIds.sousDirection.add(access.sousDirection.id);
      }

      // Division
      if (access.division_id) {
        userEntityIds.division.add(access.division_id);
      } else if (access.division?.id) {
        userEntityIds.division.add(access.division.id);
      }

      // Section
      if (access.section_id) {
        userEntityIds.section.add(access.section_id);
      } else if (access.section?.id) {
        userEntityIds.section.add(access.section.id);
      }
    });

    // Vérification par niveau
    if (typeDoc.section_id) {
      return userEntityIds.section.has(typeDoc.section_id);
    }
    if (typeDoc.division_id && !typeDoc.section_id) {
      return userEntityIds.division.has(typeDoc.division_id);
    }
    if (
      typeDoc.sous_direction_id &&
      !typeDoc.division_id &&
      !typeDoc.section_id
    ) {
      return userEntityIds.sousDirection.has(typeDoc.sous_direction_id);
    }
    if (
      typeDoc.direction_id &&
      !typeDoc.sous_direction_id &&
      !typeDoc.division_id &&
      !typeDoc.section_id
    ) {
      return userEntityIds.direction.has(typeDoc.direction_id);
    }

    return false;
  };

  // ✅ Filtrer les documents accessibles
  const accessibleDocTypes = useMemo(() => {
    return docTypes.filter((doc) => hasAccessToDocument(doc));
  }, [docTypes, user]);

  const toggleTree = (label: string) => {
    setTreeOpen((prev) => {
      const next = { ...prev, [label]: !prev[label] };
      localStorage.setItem("sidebar-tree", JSON.stringify(next));
      return next;
    });
  };

  // =============================================
  // MÉTHODES UTILITAIRES POUR LES CAS NON-ADMIN
  // =============================================

  // 1. Récupérer les IDs des entités accessibles par l'utilisateur
  const getUserAccessibleEntityIds = (user: User | null) => {
    if (!user)
      return {
        direction: new Set<number>(),
        sousDirection: new Set<number>(),
        division: new Set<number>(),
        section: new Set<number>(),
      };

    const ids = {
      direction: new Set<number>(),
      sousDirection: new Set<number>(),
      division: new Set<number>(),
      section: new Set<number>(),
    };

    // ✅ CORRECTION : Chercher dans fonction_details d'abord
    if (user.fonction_details) {
      // Nouvelles entités dans fonction_details
      if (user.fonction_details.direction_id) {
        ids.direction.add(user.fonction_details.direction_id);
      }
      if (user.fonction_details.sous_direction_id) {
        ids.sousDirection.add(user.fonction_details.sous_direction_id);
      }
      if (user.fonction_details.division_id) {
        ids.division.add(user.fonction_details.division_id);
      }
      if (user.fonction_details.section_id) {
        ids.section.add(user.fonction_details.section_id);
      }

      // Fallback aux anciennes entités
      if (user.fonction_details.entitee_un?.id) {
        console.log(
          "⚠️ Ancienne entité_un:",
          user.fonction_details.entitee_un.id,
        );
        // Mapper entitee_un -> direction
        ids.direction.add(user.fonction_details.entitee_un.id);
      }
      if (user.fonction_details.entitee_deux?.id) {
        console.log(
          "⚠️ Ancienne entité_deux:",
          user.fonction_details.entitee_deux.id,
        );
        // Mapper entitee_deux -> division
        ids.division.add(user.fonction_details.entitee_deux.id);
      }
      if (user.fonction_details.entitee_trois?.id) {
        console.log(
          "⚠️ Ancienne entité_trois:",
          user.fonction_details.entitee_trois.id,
        );
        // Mapper entitee_trois -> section
        ids.section.add(user.fonction_details.entitee_trois.id);
      }
    }

    // Entités des agent_access
    user.agent_access?.forEach((access) => {
      // Direction
      if (access.direction_id) {
        ids.direction.add(access.direction_id);
      } else if (access.direction?.id) {
        ids.direction.add(access.direction.id);
      }

      // Sous-direction
      if (access.sous_direction_id) {
        ids.sousDirection.add(access.sous_direction_id);
      } else if (access.sousDirection?.id) {
        ids.sousDirection.add(access.sousDirection.id);
      }

      // Division
      if (access.division_id) {
        ids.division.add(access.division_id);
      } else if (access.division?.id) {
        ids.division.add(access.division.id);
      }

      // Section
      if (access.section_id) {
        ids.section.add(access.section_id);
      } else if (access.section?.id) {
        ids.section.add(access.section.id);
      }
    });

    return ids;
  };

  // 2. Compter le nombre total de niveaux accessibles
  const getUserAccessibleNiveauxCount = (user: User | null) => {
    const ids = getUserAccessibleEntityIds(user);
    return (
      ids.direction.size +
      ids.sousDirection.size +
      ids.division.size +
      ids.section.size
    );
  };

  // 3. Vérifier si l'utilisateur a des accès supplémentaires (agent_access)
  const hasAdditionalAccess = (user: User | null): boolean => {
    return (user?.agent_access?.length ?? 0) > 0;
  };

  // 4. Récupérer le type d'entité de la fonction de l'utilisateur (CORRIGÉ)
  const getUserFonctionEntityType = (
    user: User | null,
  ): "direction" | "sousDirection" | "division" | "section" | null => {
    if (!user?.fonction_details) return null;

    // ✅ CORRECTION : Chercher dans fonction_details
    if (user.fonction_details.section_id) return "section";
    if (user.fonction_details.division_id) return "division";
    if (user.fonction_details.sous_direction_id) return "sousDirection";
    if (user.fonction_details.direction_id) return "direction";

    // Fallback aux anciennes entités
    if (user.fonction_details.entitee_trois?.id) return "section";
    if (user.fonction_details.entitee_deux?.id) return "division";
    if (user.fonction_details.entitee_un?.id) return "direction";

    return null;
  };

  // 5. Récupérer l'ID de l'entité de la fonction (CORRIGÉ)
  const getUserFonctionEntityId = (user: User | null): number | null => {
    if (!user?.fonction_details) return null;

    // ✅ CORRECTION : Chercher dans fonction_details
    if (user.fonction_details.section_id)
      return user.fonction_details.section_id;
    if (user.fonction_details.division_id)
      return user.fonction_details.division_id;
    if (user.fonction_details.sous_direction_id)
      return user.fonction_details.sous_direction_id;
    if (user.fonction_details.direction_id)
      return user.fonction_details.direction_id;

    // Fallback aux anciennes entités
    if (user.fonction_details.entitee_trois?.id)
      return user.fonction_details.entitee_trois.id;
    if (user.fonction_details.entitee_deux?.id)
      return user.fonction_details.entitee_deux.id;
    if (user.fonction_details.entitee_un?.id)
      return user.fonction_details.entitee_un.id;

    return null;
  };

  // 6. Récupérer les types de documents de la fonction de l'utilisateur (CORRIGÉ)
  const getUserFonctionTypes = (
    user: User | null,
    docTypes: TypeDocument[],
  ) => {
    const entityType = getUserFonctionEntityType(user);
    const entityId = getUserFonctionEntityId(user);

    console.log("🔍 getUserFonctionTypes - Entity:", { entityType, entityId });
    console.log(
      "🔍 getUserFonctionTypes - fonction_details:",
      user?.fonction_details,
    );

    if (!entityType || !entityId) {
      console.log("❌ Pas d'entité de fonction trouvée");
      return [];
    }

    const filtered = docTypes.filter((doc) => {
      let match = false;

      if (entityType === "direction") {
        match = doc.direction_id === entityId;
        // Fallback aux anciens champs
        if (!match) match = doc.entitee_un_id === entityId;
      }
      if (entityType === "sousDirection") {
        match = doc.sous_direction_id === entityId;
      }
      if (entityType === "division") {
        match = doc.division_id === entityId;
        // Fallback aux anciens champs
        if (!match) match = doc.entitee_deux_id === entityId;
      }
      if (entityType === "section") {
        match = doc.section_id === entityId;
        // Fallback aux anciens champs
        if (!match) match = doc.entitee_trois_id === entityId;
      }

      if (match) {
        console.log(`✅ Document correspondant:`, { id: doc.id, nom: doc.nom });
      }
      return match;
    });

    console.log(`📊 ${filtered.length} document(s) trouvé(s) pour la fonction`);
    return filtered;
  };

  return (
    <aside className="h-screen sticky top-0">
      <nav
        className={`h-full flex flex-col bg-orange-950 border-r border-orange-900 shadow-2xl transition-all duration-300 ${
          expended ? "w-72" : "w-20"
        }`}
      >
        {/* Header - Logo et Toggle */}
        <div className="flex items-center justify-between p-4 h-20 bg-orange-950">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              expended ? "w-full" : "w-0"
            }`}
          >
            <img
              src={logo}
              alt="Logo"
              className="w-full h-20 brightness-0 invert p-2"
            />
          </div>

          <button
            onClick={() => setExpended((v) => !v)}
            className="p-2 rounded-lg bg-orange-800 text-orange-100 hover:bg-orange-600 hover:text-white transition-all shadow-lg"
          >
            {expended ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 mt-4 custom-scrollbar">
          <SidebarContext.Provider value={{ expended, treeOpen, toggleTree }}>
            <ul className="space-y-1">
              {can("statistique", "access") ? (
                <SidebarLink
                  icon={LayoutDashboard}
                  text="Tableau de bord"
                  to="/"
                  active={location.pathname === "/"}
                />
              ) : (
                <SidebarLink
                  icon={LayoutDashboard}
                  text="Tableau de bord"
                  to="/welcome"
                  active={location.pathname === "/welcome"}
                />
              )}

              <div
                className={`my-4 border-t border-orange-800/50 mx-2 ${
                  !expended && "hidden"
                }`}
              />

              {/* ================= ORGANIGRAMME ================= */}
              {(can("direction", "access") ||
                can("sousDirection", "access") ||
                can("division", "access") ||
                can("section", "access")) && (
                <SidebarTree label="Organigramme" icon={GitFork}>
                  {can("direction", "access") && (
                    <SidebarLink
                      icon={Building2}
                      text="Directions"
                      to="/direction"
                      active={location.pathname.startsWith("/direction")}
                    />
                  )}
                  {can("sousDirection", "access") && (
                    <SidebarLink
                      icon={Landmark}
                      text="Sous-directions"
                      to="/sous-direction"
                      active={location.pathname.startsWith("/sous-direction")}
                    />
                  )}
                  {can("division", "access") && (
                    <SidebarLink
                      icon={Split}
                      text="Divisions"
                      to="/division"
                      active={location.pathname.startsWith("/division")}
                    />
                  )}
                  {can("section", "access") && (
                    <SidebarLink
                      icon={TableOfContents}
                      text="Sections"
                      to="/section"
                      active={location.pathname.startsWith("/section")}
                    />
                  )}
                </SidebarTree>
              )}

              {/* ================= GESTION ================= */}
              {(can("type", "access") ||
                can("pieces", "access") ||
                can("documentType", "access") ||
                can("document", "access")) && (
                <SidebarTree label="Gestion" icon={FolderPen}>
                  {can("pieces", "access") && (
                    <SidebarLink
                      icon={FolderPen}
                      text="Type de pièces"
                      to="/pieces"
                      active={location.pathname.startsWith("/pieces")}
                    />
                  )}
                  {can("documentType", "access") && (
                    <SidebarLink
                      icon={Database}
                      text="Types de documents"
                      to="/dossierType"
                      active={location.pathname.startsWith("/dossierType")}
                    />
                  )}
                  {can("document", "access") && (
                    <SidebarTree label="Documents" icon={FileText}>
                      {isUserAdmin(user) ? (
                        /* ===== CAS ADMIN ===== */
                        <>
                          {directions.length > 0 && (
                            <SidebarLink
                              icon={Building2}
                              text="Directions"
                              to="/document?entitee=direction"
                              active={
                                location.pathname === "/document" &&
                                new URLSearchParams(location.search).get(
                                  "entitee",
                                ) === "direction"
                              }
                            />
                          )}

                          {sousDirections.length > 0 && (
                            <SidebarLink
                              icon={Landmark}
                              text="Sous-directions"
                              to="/document?entitee=sousDirection"
                              active={
                                location.pathname === "/document" &&
                                new URLSearchParams(location.search).get(
                                  "entitee",
                                ) === "sousDirection"
                              }
                            />
                          )}

                          {divisions.length > 0 && (
                            <SidebarLink
                              icon={Split}
                              text="Divisions"
                              to="/document?entitee=division"
                              active={
                                location.pathname === "/document" &&
                                new URLSearchParams(location.search).get(
                                  "entitee",
                                ) === "division"
                              }
                            />
                          )}

                          {sections.length > 0 && (
                            <SidebarLink
                              icon={TableOfContents}
                              text="Sections"
                              to="/document?entitee=section"
                              active={
                                location.pathname === "/document" &&
                                new URLSearchParams(location.search).get(
                                  "entitee",
                                ) === "section"
                              }
                            />
                          )}
                        </>
                      ) : (
                        /* ===== CAS NON-ADMIN ===== */
                        <>
                          {(() => {
                            const ids = getUserAccessibleEntityIds(user);
                            const hasDirectionAccess = ids.direction.size > 0;
                            const hasSousDirectionAccess =
                              ids.sousDirection.size > 0;
                            const hasDivisionAccess = ids.division.size > 0;
                            const hasSectionAccess = ids.section.size > 0;

                            // Cas 1 : L'utilisateur a des accès supplémentaires
                            if (hasAdditionalAccess(user)) {
                              return (
                                <>
                                  {hasDirectionAccess && (
                                    <SidebarLink
                                      icon={Building2}
                                      text="Directions"
                                      to="/document?entitee=direction&acces=multiple"
                                      active={
                                        location.pathname === "/document" &&
                                        new URLSearchParams(
                                          location.search,
                                        ).get("entitee") === "direction"
                                      }
                                    />
                                  )}

                                  {hasSousDirectionAccess && (
                                    <SidebarLink
                                      icon={Landmark}
                                      text="Sous-directions"
                                      to="/document?entitee=sousDirection&acces=multiple"
                                      active={
                                        location.pathname === "/document" &&
                                        new URLSearchParams(
                                          location.search,
                                        ).get("entitee") === "sousDirection"
                                      }
                                    />
                                  )}

                                  {hasDivisionAccess && (
                                    <SidebarLink
                                      icon={Split}
                                      text="Divisions"
                                      to="/document?entitee=division&acces=multiple"
                                      active={
                                        location.pathname === "/document" &&
                                        new URLSearchParams(
                                          location.search,
                                        ).get("entitee") === "division"
                                      }
                                    />
                                  )}

                                  {hasSectionAccess && (
                                    <SidebarLink
                                      icon={TableOfContents}
                                      text="Sections"
                                      to="/document?entitee=section&acces=multiple"
                                      active={
                                        location.pathname === "/document" &&
                                        new URLSearchParams(
                                          location.search,
                                        ).get("entitee") === "section"
                                      }
                                    />
                                  )}
                                </>
                              );
                            }
                            // Cas 2 : Aucun accès supplémentaire (uniquement la fonction)
                            else {
                              const fonctionEntityType =
                                getUserFonctionEntityType(user);
                              const fonctionTypes = getUserFonctionTypes(
                                user,
                                docTypes,
                              );

                              if (fonctionTypes.length === 0) {
                                return (
                                  <div className="px-4 py-3 text-xs text-slate-400 italic bg-slate-50/50 rounded-lg mx-2 my-1">
                                    Aucun document disponible pour votre
                                    fonction
                                  </div>
                                );
                              }

                              return fonctionTypes.map((typeDoc) => (
                                <SidebarLink
                                  key={typeDoc.id}
                                  icon={FileStack}
                                  text={typeDoc.nom}
                                  to={`/document?typeId=${typeDoc.id}`}
                                  active={
                                    location.pathname === "/document" &&
                                    new URLSearchParams(location.search).get(
                                      "typeId",
                                    ) === String(typeDoc.id)
                                  }
                                />
                              ));
                            }
                          })()}
                        </>
                      )}
                    </SidebarTree>
                  )}
                </SidebarTree>
              )}

              {/* ================= ARCHIVAGE ================= */}
              {(can("box", "access") ||
                can("trave", "access") ||
                can("rayon", "access") ||
                can("salle", "access") ||
                can("site", "access")) && (
                <SidebarTree label="Archivage" icon={Layers}>
                  {can("box", "access") && (
                    <SidebarLink
                      icon={Archive}
                      text="Box"
                      to="/box"
                      active={location.pathname.startsWith("/box")}
                    />
                  )}
                  {can("trave", "access") && (
                    <SidebarLink
                      icon={LibraryBig}
                      text="Travé"
                      to="/trave"
                      active={location.pathname.startsWith("/trave")}
                    />
                  )}
                  {can("rayon", "access") && (
                    <SidebarLink
                      icon={WavesLadder}
                      text="Rayon"
                      to="/rayon"
                      active={location.pathname.startsWith("/rayon")}
                    />
                  )}
                  {can("salle", "access") && (
                    <SidebarLink
                      icon={Warehouse}
                      text="Salle"
                      to="/salle"
                      active={location.pathname.startsWith("/salle")}
                    />
                  )}
                  {can("site", "access") && (
                    <SidebarLink
                      icon={MapPinned}
                      text="Site"
                      to="/site"
                      active={location.pathname.startsWith("/site")}
                    />
                  )}
                </SidebarTree>
              )}

              {/* ================= SECURITE ================= */}
              {(can("agent", "access") ||
                can("droit", "access") ||
                can("historique", "access")) && (
                <SidebarTree label="Sécurité" icon={Lock}>
                  {can("agent", "access") && (
                    <SidebarLink
                      icon={UserRound}
                      text="Agent"
                      to="/agents"
                      active={location.pathname.startsWith("/agents")}
                    />
                  )}
                  {can("droit", "access") && (
                    <SidebarLink
                      icon={ShieldCheck}
                      text="Profil"
                      to="/profils"
                      active={location.pathname.startsWith("/profils")}
                    />
                  )}
                  {can("historique", "access") && (
                    <SidebarLink
                      icon={History}
                      text="Historique"
                      to="/historique"
                      active={location.pathname.startsWith("/historique")}
                    />
                  )}
                </SidebarTree>
              )}

              {can("fonction", "access") && (
                <SidebarTree label="Paramétrage" icon={Settings2}>
                  {can("fonction", "access") && (
                    <SidebarLink
                      icon={Briefcase}
                      text="Fonction"
                      to="/fonction"
                      active={location.pathname.startsWith("/fonction")}
                    />
                  )}
                </SidebarTree>
              )}

              {can("document", "read") && (
                <SidebarLink
                  icon={Search}
                  text="Recherche"
                  to="/recherche"
                  active={location.pathname.startsWith("/recherche")}
                />
              )}
            </ul>
          </SidebarContext.Provider>
        </div>

        {/* Footer - Profil Utilisateur */}
        <div className="p-4 bg-orange-900/40 backdrop-blur-sm border-t border-orange-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user?.photo_profil ? (
                <img
                  src={`http://localhost:5000/uploads/profiles/${user.photo_profil}`}
                  alt="Profil"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-orange-500/50 shadow-sm"
                />
              ) : (
                <img
                  src={profil}
                  alt="Par défaut"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-orange-500/50 shadow-sm"
                />
              )}
            </div>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                expended ? "w-40 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <p className="text-sm font-bold text-white truncate uppercase tracking-wider">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs text-orange-300 truncate">{user?.email}</p>
            </div>
            {expended && (
              <MoreVertical
                size={18}
                className="text-orange-400 cursor-pointer hover:text-white"
              />
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}

function SidebarLink({ icon: Icon, text, to, active, suffix }: any) {
  const { expended } = useContext(SidebarContext);

  const handleClick = () => {
    sessionStorage.setItem("sidebar_navigation", "true");
  };

  return (
    <Link to={to} className="block group" onClick={handleClick}>
      <li
        className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 relative
        ${
          active
            ? "bg-orange-600 text-white shadow-lg shadow-orange-950/50 scale-[1.02]"
            : "text-orange-200 hover:bg-orange-800/60 hover:text-white"
        }`}
      >
        <Icon
          size={22}
          className={`flex-shrink-0 ${
            active
              ? "text-white"
              : "text-orange-400 group-hover:text-orange-200"
          }`}
        />

        <span
          className={`whitespace-nowrap transition-all duration-300 font-medium flex-1 ${
            expended ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          {text}
        </span>

        {suffix && expended && <span className="ml-auto">{suffix}</span>}

        {!expended && (
          <div className="absolute left-full rounded-md px-3 py-1.5 ml-6 bg-orange-700 text-white text-sm invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-xl border border-orange-500 whitespace-nowrap">
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}

function SidebarTree({ label, icon: Icon, children, badge }: any) {
  const { expended, treeOpen, toggleTree } = useContext(SidebarContext);
  const open = treeOpen[label] || false;

  return (
    <li className="list-none">
      <button
        onClick={() => toggleTree(label)}
        className={`flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 text-orange-200 hover:bg-orange-800/40
          ${!expended && "justify-center"}
        `}
      >
        <Icon size={22} className="flex-shrink-0 text-orange-400" />
        {expended && (
          <>
            <span className="ml-3 font-medium flex-1 text-left">{label}</span>
            {badge && <span className="mr-2">{badge}</span>}
            <span
              className={`transition-transform duration-300 ${
                open ? "rotate-180 text-white" : "text-orange-600"
              }`}
            >
              <ChevronDown size={16} />
            </span>
          </>
        )}
      </button>

      {open && expended && (
        <ul className="ml-6 mt-1 space-y-1 border-l border-orange-800/50 pl-2 animate-in fade-in slide-in-from-left-2 duration-300">
          {children}
        </ul>
      )}
    </li>
  );
}
