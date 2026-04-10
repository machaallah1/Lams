import { create } from 'zustand';

const MOCK_POSTS = [
  { 
    id: "p1", 
    userId: "u1",
    tag: "@elena_design", 
    score: "94%", 
    likes: 235, 
    comments: 3,
    shares: 12,
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" 
  },
  { 
    id: "p2", 
    userId: "u2",
    tag: "@marco_vibe", 
    score: "88%", 
    likes: 142, 
    comments: 1,
    shares: 8,
    img: "https://images.unsplash.com/photo-1539109132314-34a9c6553876?auto=format&fit=crop&q=80&w=2000", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150" 
  },
  { 
    id: "p3", 
    userId: "u3",
    tag: "@sofia_officiel", 
    score: "97%", 
    likes: 890, 
    comments: 2,
    shares: 45,
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" 
  }
];

const MOCK_COMMENTS = {
  "p1": [
    { id: 101, text: "Le flow est incroyable 🔥", user: "@street_king", timestamp: new Date(Date.now() - 3600000).toISOString(), replies: [{ id: 1011, text: "Grave d'accord !", user: "@marco_vibe", timestamp: new Date(Date.now() - 100000).toISOString() }] },
    { id: 102, text: "Où as-tu trouvé cette veste ?", user: "@mode_addict", timestamp: new Date(Date.now() - 1800000).toISOString(), replies: [] }
  ],
  "p2": [
    { id: 201, text: "Vraiment propre l'association des couleurs", user: "@design_pro", timestamp: new Date(Date.now() - 7200000).toISOString(), replies: [] }
  ],
  "p3": [
    { id: 301, text: "Je valide fort à 100% 👏", user: "@elena_design", timestamp: new Date(Date.now() - 500000).toISOString(), replies: [] },
    { id: 302, text: "Magnifique silhouette !", user: "@fashion_guru", timestamp: new Date(Date.now() - 300000).toISOString(), replies: [] }
  ]
};

const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    user: { id: "u2", tag: "@marco_vibe", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150" },
    messages: [
      { id: "m1", senderId: "u2", text: "Salut ! J'adore ton dernier post 👏", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: "m2", senderId: "me", text: "Merci Marco ! C'est la nouvelle collection.", timestamp: new Date(Date.now() - 3500000).toISOString() }
    ],
    unreadCount: 0
  },
  {
    id: "c2",
    user: { id: "u1", tag: "@elena_design", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" },
    messages: [
      { id: "m3", senderId: "u1", text: "Est-ce que tu penses que cette veste irait avec un jean clair ?", timestamp: new Date(Date.now() - 100000).toISOString() }
    ],
    unreadCount: 1
  }
];

export const useSocialStore = create((set, get) => ({
  posts: MOCK_POSTS,
  followedUsers: [],
  likedPosts: [],
  savedPosts: [],
  postComments: MOCK_COMMENTS, 
  conversations: MOCK_CONVERSATIONS,

  sendMessage: (conversationId, text) => set((state) => {
    const newMsg = { id: Date.now().toString(), senderId: "me", text, timestamp: new Date().toISOString() };
    const newConvs = state.conversations.map(c => 
      c.id === conversationId ? { ...c, messages: [...c.messages, newMsg] } : c
    );
    return { conversations: newConvs };
  }),

  sendPostShare: (friendId, post, friendData) => set((state) => {
    const existingConv = state.conversations.find(c => c.user.id === friendId);
    
    const newMsg = { 
      id: Date.now().toString(), 
      senderId: "me", 
      type: 'share', 
      post: post, 
      text: "Regarde ce style ! 🔥", 
      timestamp: new Date().toISOString() 
    };

    if (existingConv) {
      const newConvs = state.conversations.map(c => 
        c.user.id === friendId ? { ...c, messages: [...c.messages, newMsg] } : c
      );
      return { conversations: newConvs };
    } else {
      const newConv = {
        id: "c_" + Date.now(),
        user: friendData,
        messages: [newMsg],
        unreadCount: 0
      };
      return { conversations: [newConv, ...state.conversations] };
    }
  }),

  toggleSave: (postId) => set((state) => ({
    savedPosts: state.savedPosts.includes(postId)
      ? state.savedPosts.filter(id => id !== postId)
      : [...state.savedPosts, postId]
  })),

  toggleFollow: (userId) => set((state) => ({
    followedUsers: state.followedUsers.includes(userId)
      ? state.followedUsers.filter(id => id !== userId)
      : [...state.followedUsers, userId]
  })),

  toggleLike: (postId) => set((state) => {
    const isLiked = state.likedPosts.includes(postId);
    const newLiked = isLiked
      ? state.likedPosts.filter(id => id !== postId)
      : [...state.likedPosts, postId];
    
    // On simule aussi l'incrémentation/décrémentation des likes globaux
    const newPosts = state.posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    });

    return { likedPosts: newLiked, posts: newPosts };
  }),

  submitComment: (postId, text, user, parentId = null) => set((state) => {
    const newComment = {
      id: Date.now(),
      text,
      user: user.tag,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    const currentComments = state.postComments[postId] || [];
    let nextComments;

    if (parentId) {
      // On ajoute la réponse (nested comment)
      nextComments = currentComments.map(c => 
        c.id === parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c
      );
    } else {
      // On ajoute le commentaire à la racine
      nextComments = [...currentComments, newComment];
    }
    
    // On met aussi à jour le compteur global du post pour toujours avoir le bon décompte
    const newPosts = state.posts.map(post => {
        if(post.id === postId) return { ...post, comments: post.comments + 1 };
        return post;
    });

    return {
      posts: newPosts,
      postComments: {
        ...state.postComments,
        [postId]: nextComments
      }
    };
  }),
}));
