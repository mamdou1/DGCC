import { useAuth } from "../../context/AuthContext";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  // États pour les dropdowns des entitees

  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center h-20 px-8 bg-dgcc1 border-b border-orange-100 sticky top-0 z-40 shadow-sm">
      {/* Côté Gauche */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-white tracking-tight">DGCC</h1>
        <p className="text-xs text-orange-300 font-medium">
          Direction Général du Commerce et de la Concurrence ,{" "}
        </p>
      </div>

      {/* Côté Droit */}
      <div className="flex items-center gap-3">
        {/* <div className="hidden md:flex items-center bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48 text-emerald-900 placeholder:text-emerald-400"
          />
        </div> */}

        <div className="h-8 w-[1px] bg-emerald-100 mx-2 hidden md:block" />

        <div className="flex items-center gap-1">
          {/* <button className="relative p-2.5 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 bg-orange-500 border-2 border-white text-[10px] font-bold text-white rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button> */}
          <button
            onClick={() => navigate("/change-password")}
            className="p-2.5 text-orange-50 hover:bg-orange-100 rounded-xl transition-all"
            title="Changer le mot de passe"
          >
            <Settings size={20} />
          </button>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 ml-2 bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all font-semibold text-sm"
        >
          <LogOut size={18} />
          <span className="hidden lg:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
