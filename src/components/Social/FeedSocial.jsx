import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PostCard from './PostCard';
import { useSocialStore } from '../../store/socialStore';

export default function FeedSocial() {
  const posts = useSocialStore(state => state.posts);
  const scrollContainerRef = useRef(null);

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
  }, [posts]);

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

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'next' ? cardWidth : -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden animate-in fade-in duration-500 py-4">
      
      {/* Desktop Previous Button */}
      <button 
        onClick={() => handleScroll('prev')}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 md:w-[70px] md:h-[70px] rounded-full bg-white/90 backdrop-blur border border-primary/20 text-primary hidden md:flex items-center justify-center cursor-pointer z-40 shadow-[0_10px_30px_rgba(168,85,247,0.1)] hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
      >
        <ChevronLeft size={24} className="sm:w-[30px] sm:h-[30px]" />
      </button>

      {/* Scrollable container for feed posts */}
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full flex gap-12 overflow-x-auto snap-x snap-mandatory py-4 px-4 sm:px-12 scrollbar-none scroll-smooth items-center min-h-0 cursor-grab active:cursor-grabbing select-none"
      >
        {posts.map((post) => (
          <div key={post.id} className="snap-center shrink-0 w-full flex justify-center">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* Desktop Next Button */}
      <button 
        onClick={() => handleScroll('next')}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 md:w-[70px] md:h-[70px] rounded-full bg-white/90 backdrop-blur border border-primary/20 text-primary hidden md:flex items-center justify-center cursor-pointer z-40 shadow-[0_10px_30px_rgba(168,85,247,0.1)] hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
      >
        <ChevronRight size={24} className="sm:w-[30px] sm:h-[30px]" />
      </button>
    </div>
  );
}
