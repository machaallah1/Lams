import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const navigate = useNavigate();
  const { state } = useLocation();
  const login = useAuthStore(auth => auth.login);

  if (!state?.email) return <Navigate to="/register" replace />;

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 4) {
      login({ 
        id: "moi", 
        tag: "@nouveau_style", 
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col justify-center items-center relative overflow-hidden animate-in fade-in duration-500">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass w-full max-w-md p-10 rounded-[40px] z-10 text-center relative shadow-xl">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={40} className="text-primary" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Vérification</h1>
        <p className="text-gray-500 mb-10 font-medium text-sm px-4">
          Un code à 4 chiffres a été envoyé à <br/><span className="font-bold text-primary">{state.email}</span>
        </p>
        
        <form onSubmit={handleVerify} className="flex flex-col gap-8">
          <div className="flex justify-between gap-4 px-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-16 h-16 bg-white/80 border border-primary/20 rounded-2xl text-center text-3xl font-black text-primary outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all shadow-sm"
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <button 
            type="submit" 
            disabled={otp.join('').length !== 4}
            className="w-full bg-primary text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer border-none"
          >
            Valider <ArrowRight size={20} />
          </button>
        </form>

        <button className="mt-8 text-sm font-bold text-gray-400 hover:text-primary transition-colors cursor-pointer border-none bg-transparent">
          Renvoyer le code
        </button>
      </div>
    </div>
  );
}
