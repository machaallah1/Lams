import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PostCard from './PostCard';
import CommentsModal from './CommentsModal';
import { useSocialStore } from '../../store/socialStore';

export default function FeedSocial() {
  const posts = useSocialStore(state => state.posts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  const currentPost = posts[currentIndex];

  const nextPost = () => setCurrentIndex(prev => (prev === posts.length - 1 ? 0 : prev + 1));
  const prevPost = () => setCurrentIndex(prev => (prev === 0 ? posts.length - 1 : prev - 1));

  if (!currentPost) return null;

  return (
    <>
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden animate-in fade-in duration-500">
        
        <button 
          onClick={prevPost}
          className="w-[70px] h-[70px] rounded-full bg-white border border-primary/20 text-primary flex items-center justify-center cursor-pointer z-50 shadow-[0_10px_30px_rgba(168,85,247,0.1)] hover:bg-primary hover:text-white transition-all duration-300 mx-10"
        >
          <ChevronLeft size={35} />
        </button>

        <PostCard 
          post={currentPost} 
          onOpenComments={() => setActiveCommentPost(currentPost)} 
        />

        <button 
          onClick={nextPost}
          className="w-[70px] h-[70px] rounded-full bg-white border border-primary/20 text-primary flex items-center justify-center cursor-pointer z-50 shadow-[0_10px_30px_rgba(168,85,247,0.1)] hover:bg-primary hover:text-white transition-all duration-300 mx-10"
        >
          <ChevronRight size={35} />
        </button>
      </div>

      {activeCommentPost && (
        <CommentsModal 
          post={activeCommentPost} 
          onClose={() => setActiveCommentPost(null)} 
        />
      )}
    </>
  );
}
