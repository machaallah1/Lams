import { create } from 'zustand';

// Plus aucun MOCK, tout provient de l'API REST.

export const useSocialStore = create((set, get) => ({
  posts: [],
  followedUsers: [],
  likedPosts: [],
  savedPosts: [],
  postComments: {}, // { postId: [ comments ] }
  conversations: [],
  notifications: [],

  // INITIALISATION UTILISATEUR CONNECTÉ
  initUserData: async () => {
    const token = localStorage.getItem('style_token');
    if(!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/me', {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) {
         const data = await res.json();
         set({ 
           likedPosts: data.likes.map(l => l.postId),
           savedPosts: data.saves.map(s => s.postId),
           followedUsers: data.following.map(f => f.followingId)
         });
      }
    } catch(e) { console.error(e); }
  },

  // CHARGEMENT FEED
  fetchPosts: async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      if(res.ok) {
        const posts = await res.json();
        set({ posts });
      }
    } catch(e) { console.error(e); }
  },

  publishPostAPI: async (formData) => {
    const token = localStorage.getItem('style_token');
    const res = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData 
    });
    const data = await res.json();
    if (res.ok) {
      // Pour l'affichage rapide
      data.img = data.img.startsWith('http') ? data.img : `http://localhost:5000${data.img}`;
      set((state) => ({ posts: [data, ...state.posts] }));
      return data; // Return full object with detailed ALGORITHM scores
    } else {
      throw new Error(data.error || "Erreur de publication.");
    }
  },

  // INTERACTIONS
  toggleLike: async (postId) => {
    const token = localStorage.getItem('style_token');
    if(!token) return;
    // Mise à jour optimiste du Frontend
    const { likedPosts, posts } = get();
    const isLiked = likedPosts.includes(postId);
    
    set({
      likedPosts: isLiked ? likedPosts.filter(id => id !== postId) : [...likedPosts, postId],
      posts: posts.map(p => p.id === postId ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p)
    });

    try {
      await fetch(`http://localhost:5000/api/posts/${postId}/like`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
    } catch(e) { console.error(e); }
  },

  toggleSave: async (postId) => {
    const token = localStorage.getItem('style_token');
    if(!token) return;
    const { savedPosts } = get();
    const isSaved = savedPosts.includes(postId);
    
    set({
      savedPosts: isSaved ? savedPosts.filter(id => id !== postId) : [...savedPosts, postId],
    });

    try {
      await fetch(`http://localhost:5000/api/posts/${postId}/save`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
    } catch(e) { console.error(e); }
  },

  toggleFollow: async (userId) => {
    const token = localStorage.getItem('style_token');
    if(!token) return;
    const { followedUsers } = get();
    const isFollowed = followedUsers.includes(userId);
    
    set({
      followedUsers: isFollowed ? followedUsers.filter(id => id !== userId) : [...followedUsers, userId],
    });

    try {
      await fetch(`http://localhost:5000/api/users/${userId}/follow`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
    } catch(e) { console.error(e); }
  },

  // COMMENTAIRES
  fetchComments: async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`);
      if(res.ok) {
        const comments = await res.json();
        set(state => ({ postComments: { ...state.postComments, [postId]: comments } }));
      }
    } catch(e) {}
  },

  submitComment: async (postId, text, user) => {
    const token = localStorage.getItem('style_token');
    if(!token) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      if(res.ok) {
         const newComment = await res.json();
         const currentComments = get().postComments[postId] || [];
         set(state => ({
            postComments: { ...state.postComments, [postId]: [...currentComments, newComment] },
            posts: state.posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p)
         }));
      }
    } catch(e) {}
  },

  // NOTIFICATIONS (Local pour le moment)
  addNotification: (notification) => set((state) => ({
    notifications: [{ id: Date.now(), timestamp: new Date().toISOString(), read: false, ...notification }, ...state.notifications]
  })),

  markNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  // MESSAGERIE
  sendMentorshipRequest: (mentorId, mentorName, details) => set((state) => {
    const textMsg = `Demande de mentorat réservée pour le ${details.date} à ${details.time}.\nMessage : ${details.message || "Aucun message."}\nMontant sécurisé : ${details.total.toFixed(2)}$`;
    
    state.addNotification({ type: 'booking', text: `Nouvelle réservation de mentorat envoyée à ${mentorName}.` });
    const newMsg = { id: Date.now().toString(), senderId: "me", text: textMsg, timestamp: new Date().toISOString() };
    const existingConv = state.conversations.find(c => c.user.id === mentorId);

    if (existingConv) {
      return { conversations: state.conversations.map(c => c.user.id === mentorId ? { ...c, messages: [...c.messages, newMsg] } : c) };
    } else {
      const newConv = {
        id: "c_" + Date.now(),
        user: { id: mentorId, tag: mentorName, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
        messages: [newMsg],
        unreadCount: 0
      };
      return { conversations: [newConv, ...state.conversations] };
    }
  }),

  sendMessage: (conversationId, text) => set((state) => {
    const newMsg = { id: Date.now().toString(), senderId: "me", text, timestamp: new Date().toISOString() };
    const newConvs = state.conversations.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, newMsg] } : c);
    return { conversations: newConvs };
  }),

  sendPostShare: (friendId, post, friendData) => set((state) => {
    const existingConv = state.conversations.find(c => c.user.id === friendId);
    const newMsg = { id: Date.now().toString(), senderId: "me", type: 'share', post: post, text: "Regarde ce style ! 🔥", timestamp: new Date().toISOString() };
    if (existingConv) {
      return { conversations: state.conversations.map(c => c.user.id === friendId ? { ...c, messages: [...c.messages, newMsg] } : c) };
    } else {
      const newConv = { id: "c_" + Date.now(), user: friendData, messages: [newMsg], unreadCount: 0 };
      return { conversations: [newConv, ...state.conversations] };
    }
  })
}));
