import { BarChart2, TrendingUp, Users, Eye, ArrowUpRight } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="w-full h-full p-10 overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
          <BarChart2 className="text-primary" size={32} /> Vos Statistiques
        </h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Users size={24} /></div>
              <span className="flex items-center text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-full"><ArrowUpRight size={14} /> +12%</span>
            </div>
            <div className="text-3xl font-black text-gray-800">1,240</div>
            <div className="text-sm text-gray-500 font-medium">Abonnés totaux</div>
          </div>
          
          <div className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500"><Eye size={24} /></div>
              <span className="flex items-center text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-full"><ArrowUpRight size={14} /> +34%</span>
            </div>
            <div className="text-3xl font-black text-gray-800">45.2k</div>
            <div className="text-sm text-gray-500 font-medium">Vues sur vos styles</div>
          </div>

          <div className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><TrendingUp size={24} /></div>
              <span className="flex items-center text-gray-400 font-bold text-sm bg-gray-100 px-2 py-1 rounded-full">Statu quo</span>
            </div>
            <div className="text-3xl font-black text-gray-800">89%</div>
            <div className="text-sm text-gray-500 font-medium">Score IA Moyen</div>
          </div>
        </div>

        {/* Chart placeholder */}
        <div className="glass w-full h-80 rounded-[40px] p-8 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Évolution des impressions (7 derniers jours)</h3>
          <div className="w-full h-full flex items-end gap-4 pb-10">
            {/* Fake bars */}
            {[40, 60, 45, 80, 50, 90, 100].map((height, i) => (
              <div key={i} className="flex-1 bg-primary/10 rounded-t-xl relative group">
                <div 
                  className="absolute bottom-0 left-0 w-full bg-primary rounded-t-xl transition-all duration-1000 group-hover:bg-purple-500"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
