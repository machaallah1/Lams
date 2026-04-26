import { Sparkles, Check, Lock } from 'lucide-react';

export default function PremiumPaywall({ onSubscribe }) {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-[40px] max-w-lg w-full p-10 shadow-2xl text-center relative overflow-hidden border border-purple-100">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-purple-500/10 -z-10" />
        
        <div className="w-20 h-20 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-purple-500/30">
          <Sparkles size={40} />
        </div>
        
        <h2 className="text-3xl font-black text-gray-800 mb-4">Débloquez l'IA Styliste</h2>
        <p className="text-gray-500 font-medium mb-8">Obtenez des conseils de style personnalisés 24/7. Notre IA analyse votre garde-robe et les tendances mondiales.</p>

        <div className="space-y-4 mb-8 text-left bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
            <div className="bg-green-100 p-1 rounded-full"><Check size={16} className="text-green-600" /></div>
            Analyses de tenues instantanées
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
            <div className="bg-green-100 p-1 rounded-full"><Check size={16} className="text-green-600" /></div>
            Recommandations d'achats selon votre morphologie
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
            <div className="bg-green-100 p-1 rounded-full"><Check size={16} className="text-green-600" /></div>
            Suivi des tendances mode en temps réel
          </div>
        </div>

        <button 
          onClick={onSubscribe}
          className="w-full bg-primary text-white font-black py-4 rounded-full text-lg shadow-[0_10px_25px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform border-none cursor-pointer flex items-center justify-center gap-2"
        >
          <Lock size={18} />
          S'abonner pour 1.00 $ / semaine
        </button>
        <p className="text-xs text-gray-400 mt-4 font-medium">Facturation via Trust Pay. Sans engagement.</p>
      </div>
    </div>
  );
}
