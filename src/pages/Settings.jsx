import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Shield, User, LogOut, Briefcase } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isMentor, setIsMentor] = useState(user?.isMentor || false);
  const [coachingRate, setCoachingRate] = useState(user?.coachingRate || 30);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = () => {
    updateUser({ isMentor, coachingRate: parseFloat(coachingRate) });
    // Pour l'UX, on pourrait ajouter un toast ici (ex: "Modifications enregistrées")
  };

  return (
    <div className="w-full h-full p-4 sm:p-10 overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
          <SettingsIcon className="text-primary" size={32} /> Préférences
        </h1>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Menu Latéral des Paramètres (Scrollable horizontalement sur mobile) */}
          <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 shrink-0 scrollbar-none">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl font-bold border-none cursor-pointer text-left transition-all shrink-0 whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-white hover:text-gray-800'
              }`}
            >
              <User size={20} /> Compte & Profil
            </button>
            <button 
              onClick={() => setActiveTab('mentorat')}
              className={`flex items-center gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl font-bold border-none cursor-pointer text-left transition-all shrink-0 whitespace-nowrap ${
                activeTab === 'mentorat' ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-white hover:text-gray-800'
              }`}
            >
              <Briefcase size={20} /> Mentorat & Coaching
            </button>
            <button className="flex items-center gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl font-bold bg-transparent text-gray-500 hover:bg-white hover:text-gray-800 border-none cursor-pointer text-left transition-all shrink-0 whitespace-nowrap">
              <Bell size={20} /> Notifications
            </button>
            <button className="flex items-center gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl font-bold bg-transparent text-gray-500 hover:bg-white hover:text-gray-800 border-none cursor-pointer text-left transition-all shrink-0 whitespace-nowrap">
              <Shield size={20} /> Confidentialité
            </button>
            <button className="flex items-center gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl font-bold bg-transparent text-gray-500 hover:bg-white hover:text-gray-800 border-none cursor-pointer text-left transition-all shrink-0 whitespace-nowrap">
              <Lock size={20} /> Sécurité
            </button>
          </div>

          {/* Formulaire Actif */}
          <div className="w-full md:w-2/3 glass p-5 sm:p-8 rounded-[30px] sm:rounded-[40px] animate-in slide-in-from-right-4 duration-300">
            {activeTab === 'profile' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Informations Personnelles</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-500 mb-1 block">Pseudo</label>
                    <input type="text" defaultValue={user?.tag || "@mon_style"} className="w-full bg-white/50 border border-primary/20 rounded-xl py-3 px-4 outline-none focus:border-primary text-gray-700 font-medium" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-gray-500 mb-1 block">Bio</label>
                    <textarea rows="3" defaultValue="Passionné de streetwear et de haute couture." className="w-full bg-white/50 border border-primary/20 rounded-xl py-3 px-4 outline-none focus:border-primary text-gray-700 font-medium resize-none" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'mentorat' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Mentorat & Coaching</h3>
                <div className="flex flex-col gap-6">
                  
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">Activer le mentorat</h4>
                      <p className="text-sm text-gray-500">Permettre aux autres utilisateurs de réserver des séances de coaching privées avec vous.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input type="checkbox" className="sr-only peer" checked={isMentor} onChange={(e) => setIsMentor(e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className={`transition-all duration-300 ${isMentor ? 'opacity-100 h-auto' : 'opacity-50 pointer-events-none'}`}>
                    <label className="text-sm font-bold text-gray-500 mb-1 block">Taux Horaire ($/h)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">$</span>
                      </div>
                      <input 
                        type="number" 
                        value={coachingRate}
                        onChange={(e) => setCoachingRate(e.target.value)}
                        className="w-full bg-white/50 border border-primary/20 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-primary text-gray-700 font-medium" 
                        min="10"
                        step="5"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">La plateforme retient 15% de frais de service sur les transactions.</p>
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-6">
              <button 
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors border-none cursor-pointer flex items-center gap-2"
              >
                <LogOut size={18} /> Déconnexion
              </button>

              <button 
                onClick={handleSave}
                className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-purple-700 transition-colors border-none shadow-md cursor-pointer"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
