const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const upload = require('./middlewares/upload');
const http = require('http');
const { Server } = require('socket.io');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

const PORT = 5000;
const JWT_SECRET = "super_secret_key_for_style_app"; 

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// AUTHENTIFICATION
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { tag, email, password } = req.body;
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { tag }] } });
    if (existingUser) return res.status(400).json({ error: "L'email ou le tag est déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { tag, email, password: hashedPassword } });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, tag: user.tag, avatar: user.avatar, isMentor: user.isMentor } });
  } catch (error) { res.status(500).json({ error: "Erreur lors de l'inscription." }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Utilisateur introuvable." });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Mot de passe incorrect." });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, tag: user.tag, avatar: user.avatar, isMentor: user.isMentor } });
  } catch (error) { res.status(500).json({ error: "Erreur lors de la connexion." }); }
});

const verifyAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Accès refusé. Token manquant." });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) { res.status(401).json({ error: "Token invalide." }); }
};

// ==========================================
// MOTEUR IA (SIMULATION D'EVALUATION)
// ==========================================
const STYLES = ["Swagg", "Traditionnel", "Professionnel", "Casual", "Sportif", "Chic / Soirée"];

function runMockAI() {
  const detectedStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
  const presenceScore = Math.floor(Math.random() * 6) + 15; // 15 à 20
  const harmonyScore = Math.floor(Math.random() * 11) + 10; // 10 à 20
  const coherenceScore = Math.floor(Math.random() * 11) + 10; // 10 à 20
  const fitScore = Math.floor(Math.random() * 11) + 10; // 10 à 20
  const accessoriesScore = Math.floor(Math.random() * 11) + 5; // 5 à 15
  const score = presenceScore + harmonyScore + coherenceScore + fitScore + accessoriesScore;
  return { detectedStyle, score, presenceScore, harmonyScore, coherenceScore, fitScore, accessoriesScore };
}

// ==========================================
// FEED ET POSTS
// ==========================================
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { 
        user: { select: { tag: true, avatar: true, isMentor: true, coachingRate: true } },
        _count: { select: { likes: true, comments: true, saves: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    const formatted = posts.map(p => ({
      ...p,
      likes: p._count.likes,
      comments: p._count.comments,
      shares: 0,
      _count: undefined
    }));
    res.json(formatted);
  } catch (error) { res.status(500).json({ error: "Erreur" }); }
});

app.post('/api/posts', verifyAuth, upload.single('image'), async (req, res) => {
  try {
    const imgUrl = req.file ? `/uploads/${req.file.filename}` : req.body.img;
    if (!imgUrl) return res.status(400).json({ error: "Une image est requise." });

    const ai = runMockAI();
    const post = await prisma.post.create({
      data: { userId: req.userId, img: imgUrl, ...ai },
      include: { 
        user: { select: { tag: true, avatar: true, isMentor: true } },
        _count: { select: { likes: true, comments: true, saves: true } }
      }
    });

    res.json({
      ...post,
      likes: post._count.likes,
      comments: post._count.comments,
      shares: 0,
      _count: undefined
    });
  } catch (error) { res.status(500).json({ error: "Erreur création." }); }
});

// ==========================================
// INTERACTIONS SOCIALES
// ==========================================
app.post('/api/posts/:id/like', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.like.findFirst({ where: { postId: id, userId: req.userId } });
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      res.json({ liked: false });
    } else {
      await prisma.like.create({ data: { postId: id, userId: req.userId } });
      res.json({ liked: true });
    }
  } catch(e) { res.status(500).json({ error: "Erreur" }); }
});

app.post('/api/posts/:id/save', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.save.findFirst({ where: { postId: id, userId: req.userId } });
    if (existing) {
      await prisma.save.delete({ where: { id: existing.id } });
      res.json({ saved: false });
    } else {
      await prisma.save.create({ data: { postId: id, userId: req.userId } });
      res.json({ saved: true });
    }
  } catch(e) { res.status(500).json({ error: "Erreur" }); }
});

app.post('/api/posts/:id/comments', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const comment = await prisma.comment.create({
      data: { text, postId: id, userId: req.userId },
      include: { user: { select: { tag: true, avatar: true } } }
    });
    res.json(comment);
  } catch(e) { res.status(500).json({ error: "Erreur" }); }
});

app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: req.params.id },
      include: { user: { select: { tag: true, avatar: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json(comments);
  } catch(e) { res.status(500).json({ error: "Erreur" }); }
});

// FOLLOWS
app.post('/api/users/:id/follow', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.follow.findFirst({ where: { followingId: id, followerId: req.userId } });
    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      res.json({ followed: false });
    } else {
      await prisma.follow.create({ data: { followingId: id, followerId: req.userId } });
      res.json({ followed: true });
    }
  } catch(e) { res.status(500).json({ error: "Erreur" }); }
});


// ==========================================
// SOCKET.IO (MESSAGERIE)
// ==========================================
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch(e) { next(new Error("Authentication error")); }
});

io.on('connection', (socket) => {
  console.log('User connected via Socket.io:', socket.userId);
  socket.join(socket.userId); // Salle unique par utilisateur
  
  socket.on('sendMessage', async (data) => {
    // data: { conversationId, receiverId, text }
    const msg = await prisma.message.create({
      data: { conversationId: data.conversationId || "new_conv", senderId: socket.userId, text: data.text }
    });
    io.to(data.receiverId).emit('receiveMessage', msg);
    socket.emit('messageSent', msg);
  });

  socket.on('disconnect', () => { console.log('User disconnected', socket.userId); });
});

// GET USER INFO (pour Stats Profil initialisation)
// (Utilisez /api/me pour récupérer savedPosts, likedPosts, followedUsers connectés)
app.get('/api/me', verifyAuth, async (req, res) => {
   try {
     const me = await prisma.user.findUnique({
       where: { id: req.userId },
       include: {
         likes: { select: { postId: true } },
         saves: { select: { postId: true } },
         following: { select: { followingId: true } }
       }
     });
     res.json(me);
   } catch(e) { res.status(500).json({ error: "Erreur" }); }
});

server.listen(PORT, () => {
  console.log(`Serveur (HTTP + Socket.io) en ligne sur http://localhost:${PORT}`);
});
