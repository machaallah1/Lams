import PostCard from './PostCard';
import { useSocialStore } from '../../store/socialStore';

export default function FeedSocial() {
  const posts = useSocialStore(state => state.posts);

  if (!posts || posts.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-8 items-center py-4 animate-in fade-in duration-500">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
