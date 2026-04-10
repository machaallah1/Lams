import { Settings as SettingsIcon, Bell, Lock, Shield, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full h-full p-10 overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
          <SettingsIcon className="text-primary" size={32} /> Préférences
        </h1>

        <div className="flex gap-8">
          {/* Menu Latéral des Paramètres */}
          <div className="w-1/3 flex flex-col gap-2">
            <button className="flex items-center gap-3 w-full p-4 rounded-2xl font-bold bg-primary text-white border-none cursor-pointer text-left shadow-md transition-all">
              <User size={20} /> Compte & Profil
            </button>
            <button className="flex items-center gap-3 w-full p-4 rounded-2xl font-bold bg-transparent text-gray-500 hover:bg-white hover:text-gray-800 border-none cursor-pointer text-left transition-all">
              <Bell size={20} /> Notifications
            </button>
            <button className="flex items-center gap-3 w-full p-4 rounded-2xl font-bold bg-transparent text-gray-500 hover:bg-white hover:text-gray-800 border-none cursor-pointer text-left transition-all">
              <Shield size={20} /> Confidentialité
            </button>
            <button className="flex items-center gap-3 w-full p-4 rounded-2xl font-bold bg-transparent text-gray-500 hover:bg-white hover:text-gray-800 border-none cursor-pointer text-left transition-all">
              <Lock size={20} /> Sécurité
            </button>
          </div>

          {/* Formulaire Actif */}
          <div className="w-2/3 glass p-8 rounded-[40px]">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Informations Personnelles</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-gray-500 mb-1 block">Pseudo</label>
                <input type="text" defaultValue="@mon_style" className="w-full bg-white/50 border border-primary/20 rounded-xl py-3 px-4 outline-none focus:border-primary text-gray-700 font-medium" />
              </div>
              
              <div>
                <label className="text-sm font-bold text-gray-500 mb-1 block">Bio</label>
                <textarea rows="3" defaultValue="Passionné de streetwear et de haute couture." className="w-full bg-white/50 border border-primary/20 rounded-xl py-3 px-4 outline-none focus:border-primary text-gray-700 font-medium resize-none" />
              </div>
              
              <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-4">
                <button 
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors border-none cursor-pointer flex items-center gap-2"
                >
                  <LogOut size={18} /> Déconnexion
                </button>

                <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-purple-700 transition-colors border-none shadow-md cursor-pointer">
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
