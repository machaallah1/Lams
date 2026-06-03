import { create } from 'zustand';
import { io } from 'socket.io-client';
import { API_URL } from '../config';

const formatMessageFromDb = (msg, posts) => {
  if (msg.text && msg.text.startsWith('{')) {
    try {
      const parsed = JSON.parse(msg.text);
      if (parsed.type === 'share') {
        const postData = posts.find(p => p.id === parsed.postId);
        return {
          ...msg,
          type: 'share',
          post: postData,
          text: "Regarde ce style ! 🔥"
        };
      }
    } catch(e) {}
  }
  return msg;
};

// Plus aucun MOCK, tout provient de l'API REST.

export const useSocialStore = create((set, get) => ({
  posts: [],
  followedUsers: [],
  likedPosts: [],
  savedPosts: [],
  postComments: {}, // { postId: [ comments ] }
  conversations: [],
  notifications: [],
  socket: null,

  // INITIALISATION UTILISATEUR CONNECTÉ
  initUserData: async () => {
    const token = localStorage.getItem('style_token');
    if(!token) return;
    try {
      get().initSocket(token);

      const res = await fetch(`${API_URL}/api/me`, {
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

  initSocket: (token) => {
    const { socket } = get();
    if (socket) return;

    const newSocket = io(API_URL, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connecté au serveur Socket.io pour la messagerie !');
    });

    newSocket.on('receiveMessage', (msg) => {
      const currentConversations = get().conversations;
      const existingConvIndex = currentConversations.findIndex(c => c.id === msg.conversationId);
      const posts = get().posts;
      const formattedMsg = formatMessageFromDb(msg, posts);

      if (existingConvIndex !== -1) {
        const updatedConversations = [...currentConversations];
        const conv = updatedConversations[existingConvIndex];
        const msgExists = conv.messages.some(m => m.id === msg.id);
        if (!msgExists) {
          updatedConversations[existingConvIndex] = {
            ...conv,
            messages: [...conv.messages, formattedMsg],
            unreadCount: conv.unreadCount + 1
          };
          set({ conversations: updatedConversations });
        }
      } else {
        get().fetchConversations();
      }
    });

    newSocket.on('messageSent', (msg) => {
      const currentConversations = get().conversations;
      const existingConvIndex = currentConversations.findIndex(c => c.id === msg.conversationId);
      const posts = get().posts;
      const formattedMsg = formatMessageFromDb(msg, posts);

      if (existingConvIndex !== -1) {
        const updatedConversations = [...currentConversations];
        const conv = updatedConversations[existingConvIndex];
        const msgExists = conv.messages.some(m => m.id === msg.id);
        if (!msgExists) {
          updatedConversations[existingConvIndex] = {
            ...conv,
            messages: [...conv.messages, formattedMsg]
          };
          set({ conversations: updatedConversations });
        }
      }
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchConversations: async () => {
    const token = localStorage.getItem('style_token');
    if(!token) return;
    try {
      const res = await fetch(`${API_URL}/api/conversations`, {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) {
         const convs = await res.json();
         const posts = get().posts;
         const formatted = convs.map(c => ({
           ...c,
           messages: c.messages.map(m => formatMessageFromDb(m, posts))
         }));
         set({ conversations: formatted });
      }
    } catch(e) { console.error(e); }
  },

  fetchMessages: async (conversationId) => {
    const token = localStorage.getItem('style_token');
    if(!token) return;
    try {
      const res = await fetch(`${API_URL}/api/conversations/${conversationId}/messages`, {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) {
         const msgs = await res.json();
         const posts = get().posts;
         const formattedMsgs = msgs.map(m => formatMessageFromDb(m, posts));
         set(state => ({
           conversations: state.conversations.map(c => c.id === conversationId ? {
             ...c,
             messages: formattedMsgs,
             unreadCount: 0
           } : c)
         }));
      }
    } catch(e) { console.error(e); }
  },

  // CHARGEMENT FEED
  fetchPosts: async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts`);
      if(res.ok) {
        const posts = await res.json();
        const formatted = posts.map(p => ({
          ...p,
          tag: p.user?.tag || p.tag || "@inconnu",
          avatar: p.user?.avatar || p.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
          isMentor: p.user?.isMentor || p.isMentor || false,
          img: p.img.startsWith('http') ? p.img : `${API_URL}${p.img}`,
          aiEvaluation: {
            styleScore: p.presenceScore || 0,
            harmonyScore: p.harmonyScore || 0,
            coherenceScore: p.coherenceScore || 0,
            cleanlinessScore: p.fitScore || 0,
            accessoriesScore: p.accessoriesScore || 0
          }
        }));
        set({ posts: formatted });
      }
    } catch(e) { console.error(e); }
  },

  publishPostAPI: async (formData) => {
    const token = localStorage.getItem('style_token');
    const res = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData 
    });
    const data = await res.json();
    if (res.ok) {
      // Pour l'affichage rapide
      const formatted = {
        ...data,
        tag: data.user?.tag || data.tag || "@inconnu",
        avatar: data.user?.avatar || data.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
        isMentor: data.user?.isMentor || data.isMentor || false,
        img: data.img.startsWith('http') ? data.img : `${API_URL}${data.img}`,
        aiEvaluation: {
          styleScore: data.presenceScore || 0,
          harmonyScore: data.harmonyScore || 0,
          coherenceScore: data.coherenceScore || 0,
          cleanlinessScore: data.fitScore || 0,
          accessoriesScore: data.accessoriesScore || 0
        }
      };
      set((state) => ({ posts: [formatted, ...state.posts] }));
      return formatted; // Return full object with detailed ALGORITHM scores
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
      await fetch(`${API_URL}/api/posts/${postId}/like`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
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
      await fetch(`${API_URL}/api/posts/${postId}/save`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
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
      await fetch(`${API_URL}/api/users/${userId}/follow`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
    } catch(e) { console.error(e); }
  },

  // COMMENTAIRES
  fetchComments: async (postId) => {
    try {
      const res = await fetch(`${API_URL}/api/posts/${postId}/comments`);
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
      const res = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
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
  sendMentorshipRequest: (mentorId, mentorName, details) => {
    const textMsg = `Demande de mentorat réservée pour le ${details.date} à ${details.time}.\nMessage : ${details.message || "Aucun message."}\nMontant sécurisé : ${details.total.toFixed(2)}$`;
    get().addNotification({ type: 'booking', text: `Nouvelle réservation de mentorat envoyée à ${mentorName}.` });
    
    const conversations = get().conversations;
    let conv = conversations.find(c => c.user.id === mentorId);
    let convId = conv ? conv.id : null;

    const { socket } = get();
    if (socket) {
      socket.emit('sendMessage', {
        conversationId: convId,
        receiverId: mentorId,
        text: textMsg
      });
      setTimeout(() => get().fetchConversations(), 300);
    }
  },

  sendMessage: (conversationId, text) => {
    const conv = get().conversations.find(c => c.id === conversationId);
    if (!conv) return;
    const receiverId = conv.user.id;
    const { socket } = get();

    if (socket) {
      socket.emit('sendMessage', {
        conversationId,
        receiverId,
        text
      });
      
      const optimisticMsg = {
        id: "temp_" + Date.now(),
        conversationId,
        senderId: "me",
        receiverId,
        text,
        timestamp: new Date().toISOString()
      };
      
      set(state => ({
        conversations: state.conversations.map(c => c.id === conversationId ? {
          ...c,
          messages: [...c.messages, optimisticMsg]
        } : c)
      }));
    }
  },

  sendPostShare: (friendId, post, friendData) => {
    const sharePayload = JSON.stringify({ type: 'share', postId: post.id });
    const conversations = get().conversations;
    let conv = conversations.find(c => c.user.id === friendId);
    let convId = conv ? conv.id : null;

    const { socket } = get();
    if (socket) {
      socket.emit('sendMessage', {
        conversationId: convId,
        receiverId: friendId,
        text: sharePayload
      });
      setTimeout(() => get().fetchConversations(), 300);
    }
  }
}));
