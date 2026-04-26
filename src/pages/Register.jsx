import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [formData, setFormData] = useState({ pseudo: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const registerAPI = useAuthStore(state => state.registerAPI);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await registerAPI(formData.pseudo, formData.email, formData.password);
      // Simulate API registration, then redirect to OTP
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col justify-center items-center relative overflow-hidden animate-in fade-in duration-500">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/30 rounded-full blur-[100px]" />
      
      <div className="glass w-full max-w-md p-10 rounded-[40px] z-10 text-center relative shadow-xl">
        <h1 className="text-4xl font-black text-primary mb-2 tracking-tighter">REJOINDRE</h1>
        <p className="text-gray-500 mb-8 font-medium">Créez votre profil et inspirez la communauté</p>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {error && <div className="bg-red-50 text-red-500 font-bold p-3 rounded-xl text-sm border border-red-100">{error}</div>}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
            <input 
              type="text" 
              placeholder="Pseudo (ex: @mon_style)" 
              className="w-full bg-white/60 border border-primary/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700 placeholder-gray-400"
              value={formData.pseudo}
              onChange={e => setFormData({...formData, pseudo: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
            <input 
              type="email" 
              placeholder="Adresse Email" 
              className="w-full bg-white/60 border border-primary/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700 placeholder-gray-400"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="w-full bg-white/60 border border-primary/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700 placeholder-gray-400"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <button disabled={isLoading} type="submit" className="w-full bg-primary text-white font-black py-4 rounded-2xl mt-4 shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(168,85,247,0.4)] transition-all cursor-pointer border-none disabled:opacity-50">
            {isLoading ? "Création en cours..." : "Création mon compte"}
          </button>
        </form>

        <div className="mt-8 text-sm font-medium text-gray-500">
          Déjà un compte ? <Link to="/login" className="text-primary font-bold hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
