import { useSocialStore } from '../store/socialStore';
import { Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Explore() {
  const posts = useSocialStore(state => state.posts);
  const [query, setQuery] = useState('');
  const scrollContainerRef = useRef(null);

  const filtered = posts.filter(p => p.tag.toLowerCase().includes(query.toLowerCase()));

  // Translate vertical wheel scroll to horizontal scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [filtered]);

  // Mouse drag-to-scroll logic
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div className="w-full md:h-full p-4 md:p-10 md:overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-6 sm:mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/50" size={24} />
          <input
            type="text"
            placeholder="Rechercher des styles, des créateurs..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full glass rounded-full py-4 sm:py-5 pl-16 pr-8 text-base sm:text-lg outline-none focus:border-primary transition-all text-primary font-medium shadow-sm"
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 sm:mb-6 px-2 sm:px-4">Tendances Actuelles</h2>
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 px-2 sm:px-4 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
        >
          {filtered.map(post => (
            <div key={post.id} className="snap-start shrink-0 w-[220px] sm:w-[280px] aspect-[4/5] rounded-[24px] sm:rounded-3xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
              <img src={post.img} alt="post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-primary shadow-sm backdrop-blur-md">
                {post.score} IA
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 text-white">
                <span className="font-extrabold text-sm sm:text-lg">{post.tag}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="w-full text-center py-20 text-gray-400 font-medium glass rounded-3xl">
              Aucun résultat pour "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
