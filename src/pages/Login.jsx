import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ 
      id: "moi", 
      tag: "@mon_style", 
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col justify-center items-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/30 rounded-full blur-[100px]" />
      
      <div className="glass w-full max-w-md p-10 rounded-3xl z-10 text-center relative">
        <h1 className="text-4xl font-black text-primary mb-2">STYLE APP</h1>
        <p className="text-gray-500 mb-8 font-medium">Connectez-vous pour découvrir les tendances</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-white/60 border border-primary/20 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="w-full bg-white/60 border border-primary/20 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-2xl mt-2 shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] hover:shadow-[0_15px_25px_rgba(168,85,247,0.4)] transition-all">
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
