import React, { ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthSwitcher from "../pages/Auth/AuthSwitcher";
import Pieces from "../pages/Pieces/PiecesPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import Membre from "../pages/Membres/UserPage";
import ExercicePage from "../pages/Exercice/ExercicePage";
import RecherchePage from "../pages/Recherche/Recherche";
import DroitPage from "../pages/Droit/DroitPage";
import { useAuth } from "../context/AuthContext";
import HistoriquePage from "../pages/HistoriqueLog/HistoriquePage";
//import DocumentTypePage from "../pages/DomentType/DocumentTypePage";
import DocumentPage from "../pages/Document/DocumentPage";
import DocumentTypeEntitee from "../pages/DomentType/DocumentTypeEntitee";
import WelcomeLandingPage from "../pages/Dashboard/DashbordBis";
import ChangePassword from "../pages/Auth/ChangePassword";
import SendEmail from "../pages/Auth/SendEmail";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import UpdatePassword from "../pages/Auth/UpdatePassword";
import DirectionPage from "../pages/Organigrame/Direction/DirectionPage";
import SousDirectionPage from "../pages/Organigrame/Sous Direction/SousDirectionPage";
import DivisionPage from "../pages/Organigrame/Division/DivisionPage";
import SectionPage from "../pages/Organigrame/Section/SectionPage";
import ServicePage from "../pages/Organigrame/Service/ServicePage";
import FonctionPage from "../pages/Fonction/FonctionPage";

// 🔥FIX ICI🔥
const PrivateRoute: React.FC<{ children: ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  // ❗ condition correcte
  if (!user) return <Navigate to="/connexion" replace />;

  return children;
};

export default function AppRouter() {
  const { can, loading } = useAuth();
  if (loading) return <div>Chargement...</div>;
  return (
    <Routes>
      <Route path="/" element={<AuthSwitcher />} />
      <Route path="/connexion" element={<AuthSwitcher />} />
      <Route path="/send-code" element={<SendEmail />} />
      <Route path="/verify-code" element={<VerifyEmail />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            {/* 💡 On vérifie ici aussi la permission ! */}
            {can("statistique", "read") ? (
              <AuthSwitcher />
            ) : (
              <Navigate to="/welcome" replace />
            )}
          </PrivateRoute>
        }
      />
      <Route
        path="/welcome"
        element={
          <PrivateRoute>
            <WelcomeLandingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/agents"
        element={
          <PrivateRoute>
            <Membre />
          </PrivateRoute>
        }
      />

      <Route
        path="/exercices"
        element={
          <PrivateRoute>
            <ExercicePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pieces"
        element={
          <PrivateRoute>
            <Pieces />
          </PrivateRoute>
        }
      />
      <Route
        path="/recherche"
        element={
          <PrivateRoute>
            <RecherchePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profils"
        element={
          <PrivateRoute>
            <DroitPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/historique"
        element={
          <PrivateRoute>
            <HistoriquePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/document"
        element={
          <PrivateRoute>
            <DocumentPage />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/dossierType"
        element={
          <PrivateRoute>
            <DocumentTypePage />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/dossierType"
        element={
          <PrivateRoute>
            <DocumentTypeEntitee />
          </PrivateRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        }
      />
      <Route
        path="/direction"
        element={
          <PrivateRoute>
            <DirectionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/sous-direction"
        element={
          <PrivateRoute>
            <SousDirectionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/division"
        element={
          <PrivateRoute>
            <DivisionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/section"
        element={
          <PrivateRoute>
            <SectionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/service"
        element={
          <PrivateRoute>
            <ServicePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/fonction"
        element={
          <PrivateRoute>
            <FonctionPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
