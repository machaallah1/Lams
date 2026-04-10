import { useSocialStore } from '../store/socialStore';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Explore() {
  const posts = useSocialStore(state => state.posts);
  const [query, setQuery] = useState('');

  const filtered = posts.filter(p => p.tag.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-full h-full p-10 overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/50" size={24} />
          <input 
            type="text" 
            placeholder="Rechercher des styles, des créateurs..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full glass rounded-full py-5 pl-16 pr-8 text-lg outline-none focus:border-primary transition-all text-primary font-medium shadow-sm"
          />
        </div>

        <h2 className="text-2xl font-black text-gray-800 mb-6 px-4">Tendances Actuelles</h2>
        <div className="grid grid-cols-4 gap-6">
          {filtered.map(post => (
            <div key={post.id} className="aspect-[4/5] rounded-3xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
              <img src={post.img} alt="post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm backdrop-blur-md">
                {post.score} IA
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="font-extrabold text-lg">{post.tag}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 text-center py-20 text-gray-400 font-medium glass rounded-3xl">
              Aucun résultat pour "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
