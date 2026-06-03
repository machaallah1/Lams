import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { Lock, Mail, Cpu } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loginAPI = useAuthStore(state => state.loginAPI);
  const addToast = useToastStore(state => state.addToast);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await loginAPI(email, password);
      addToast('Connexion réussie ! Ravis de vous revoir.', 'success');
      navigate('/');
    } catch (err) {
      setError(err.message);
      addToast(err.message || 'Erreur de connexion', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden font-inter bg-white relative">
      
      {/* Côté Gauche - Grand Visuel Fashion avec Carte de Style */}
      <div 
        className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-16 text-white overflow-hidden select-none bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop')` }}
      >
        {/* Overlay Dégradé Sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/90 via-indigo-950/75 to-pink-900/50 mix-blend-multiply pointer-events-none" />
        
        {/* Logo/Brand */}
        <div className="z-10 flex items-center gap-2">
          <span className="text-3xl font-black tracking-tighter uppercase">Lams</span>
        </div>

        {/* Carte de Style Vestimentaire Flottante (Visuelle) */}
        <div className="z-10 my-auto w-full flex flex-col items-center">
          <h1 className="text-5xl font-black mb-8 leading-tight tracking-tight text-center max-w-md">
            Bienvenue sur Lams
          </h1>
          
          {/* Mini-carte de style vestimentaire avec image réelle */}
          <div className="glass max-w-sm rounded-[35px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Tag IA */}
            <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-primary flex items-center gap-1.5 shadow-md">
              <Cpu size={14} className="text-primary" /> 92 IA
            </div>
            {/* Image de mode réelle */}
            <div className="w-[280px] h-[340px] rounded-[24px] overflow-hidden mb-4 bg-black/10">
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop" 
                alt="Style vestimentaire" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Infos Style */}
            <div className="text-left px-1">
              <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">Style Détecté</span>
              <h3 className="text-lg font-black text-white mt-0.5">High Fashion Editorial</h3>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-sm text-white/60 font-semibold">
          © 2026 Lams. Tous droits réservés.
        </div>
      </div>

      {/* Côté Droit - Formulaire de Connexion & Filigrane Vestimentaire en arrière plan */}
      <div className="w-full lg:w-5/12 h-full flex flex-col justify-center items-center px-10 sm:px-20 relative bg-white overflow-hidden">
        
        {/* Motifs de vêtements en filigrane discret à droite */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] text-primary">
          <Cpu className="absolute top-[10%] right-[10%] w-32 h-32 rotate-45" />
          <Cpu className="absolute bottom-[10%] left-[10%] w-40 h-40 -rotate-12" />
        </div>

        <div className="w-full max-w-md flex flex-col z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <span className="text-2xl font-black text-primary uppercase tracking-tighter">Lams</span>
          </div>

          <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">
            CONNEXION
          </h2>
          <p className="text-gray-400 font-semibold text-sm mb-10">
            Connectez-vous pour découvrir les tendances du moment
          </p>

          {error && (
            <div className="bg-red-50 text-red-500 font-bold p-4 rounded-2xl text-sm border border-red-100 mb-6 animate-in fade-in duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Adresse email" 
                className="w-full bg-[#f3f4f6]/60 border border-transparent rounded-full py-4 pl-14 pr-6 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-700 placeholder-gray-400 text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Mot de passe" 
                className="w-full bg-[#f3f4f6]/60 border border-transparent rounded-full py-4 pl-14 pr-6 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-700 placeholder-gray-400 text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 px-2 mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 accent-primary" />
                Se souvenir de moi
              </label>
              <a href="#" className="text-primary hover:underline">Mot de passe oublié ?</a>
            </div>
            
            <button 
              disabled={isLoading} 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/95 hover:to-purple-600/95 text-white font-black py-4 rounded-full mt-4 shadow-[0_10px_20px_rgba(168,85,247,0.25)] hover:scale-[1.02] hover:shadow-[0_15px_25px_rgba(168,85,247,0.35)] transition-all cursor-pointer border-none disabled:opacity-50 text-sm uppercase tracking-wider"
            >
              {isLoading ? 'Connexion en cours...' : 'Connexion'}
            </button>
          </form>

          <div className="mt-12 text-center text-sm font-medium text-gray-500">
            Pas encore de compte ? <Link to="/register" className="text-primary font-bold hover:underline">S'inscrire</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
