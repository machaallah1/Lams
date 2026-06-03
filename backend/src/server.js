const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const upload = require('./middlewares/upload');
const http = require('http');
const { Server } = require('socket.io');

// Charger manuellement le fichier .env s'il existe
try {
  const dotenvPath = path.join(__dirname, '../.env');
  if (fs.existsSync(dotenvPath)) {
    const envConfig = fs.readFileSync(dotenvPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length > 1) {
        const key = parts[0].trim();
        const value = parts[1].trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.log("Erreur lors de la lecture du fichier .env :", e.message);
}

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

const PORT = 5000;
const JWT_SECRET = "super_secret_key_for_style_app"; 

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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
    if (!data.receiverId) return;
    const conversationId = data.conversationId || [socket.userId, data.receiverId].sort().join('_');
    const msg = await prisma.message.create({
      data: { 
        conversationId, 
        senderId: socket.userId, 
        receiverId: data.receiverId, 
        text: data.text 
      }
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

// GET CONVERSATIONS
app.get('/api/conversations', verifyAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: { timestamp: 'desc' }
    });

    const conversationsMap = {};
    for (const msg of messages) {
      if (!conversationsMap[msg.conversationId]) {
        conversationsMap[msg.conversationId] = msg;
      }
    }

    const convList = Object.keys(conversationsMap).map(convId => conversationsMap[convId]);
    const formattedConversations = [];

    for (const lastMsg of convList) {
      const otherUserId = lastMsg.senderId === userId ? lastMsg.receiverId : lastMsg.senderId;
      if (!otherUserId || otherUserId === userId) continue;

      const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: { id: true, tag: true, avatar: true, isMentor: true }
      });

      if (!otherUser) continue;

      formattedConversations.push({
        id: lastMsg.conversationId,
        user: {
          id: otherUser.id,
          tag: otherUser.tag,
          avatar: otherUser.avatar,
          isMentor: otherUser.isMentor
        },
        messages: [
          {
            id: lastMsg.id,
            senderId: lastMsg.senderId,
            text: lastMsg.text,
            timestamp: lastMsg.timestamp
          }
        ],
        unreadCount: 0
      });
    }

    res.json(formattedConversations);
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: "Erreur" });
  }
});

// GET MESSAGES
app.get('/api/conversations/:conversationId/messages', verifyAuth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' }
    });
    res.json(messages);
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: "Erreur" });
  }
});

// ROUTE CHAT IA STYLISTE (Gemini ou fallback intelligent)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { text, image, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const contents = [];
      
      if (history && Array.isArray(history)) {
        history.slice(-6).forEach(msg => {
          contents.push({
            role: msg.sender === 'me' ? 'user' : 'model',
            parts: [{ text: msg.text || "Regarde cette photo de style." }]
          });
        });
      }

      const parts = [];
      if (text) {
        parts.push({ text });
      }
      
      if (image) {
        const match = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const base64Data = match[2];
          parts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          });
        }
      }

      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents[contents.length - 1].parts.push(...parts);
      } else {
        contents.push({
          role: 'user',
          parts: parts
        });
      }

      const geminiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "Tu es un styliste de mode professionnel nommé 'Lams Vision Stylist AI'. Tu conseilles les utilisateurs sur leurs tenues, les harmonies de couleurs, le fit et les accessoires. Reste chaleureux, moderne et amical. Donne toujours des conseils précis et constructifs." }]
          },
          contents: contents
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return res.json({ text: generatedText });
        }
      } else {
        console.error("Gemini API Error:", await geminiRes.text());
      }
    }

    // Fallback intelligent
    const cleanText = text ? text.toLowerCase() : "";
    
    if (image) {
      const STYLES = ["Casual Chic", "Streetwear urbain", "Minimaliste moderne", "Sophistiqué / Formel", "Sportswear rétro"];
      const SUGGESTIONS = [
        "une ceinture en cuir texturé pour marquer la taille",
        "des sneakers blanches épurées pour apporter une touche moderne",
        "une surchemise ouverte en flanelle ou velours pour donner du relief",
        "quelques bijoux fins argentés ou dorés pour habiller le col et les poignets",
        "un sac ou une pochette en cuir minimaliste assorti"
      ];
      const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
      const randomScore = Math.floor(Math.random() * 21) + 75;
      const randomSuggestion = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
      
      const responses = [
        `Je viens d'analyser votre photo ! C'est un look ${randomStyle} très réussi. L'harmonie générale de la tenue est excellente, avec un score de style estimé à ${randomScore}/100. Pour rendre l'ensemble encore plus percutant, je vous conseille d'ajouter ${randomSuggestion}.`,
        `Superbe silhouette ! L'esprit ${randomStyle} ressort parfaitement. Le fit général est bien équilibré. Côté accessoires, vous pourriez opter pour ${randomSuggestion} pour finaliser le style. Score d'harmonie : ${randomScore}/100 !`,
        `Cette tenue a beaucoup de potentiel ! Nous sommes sur une base ${randomStyle}. Mon conseil de styliste : ajoutez ${randomSuggestion} pour créer un point d'intérêt visuel fort. Note de style globale : ${randomScore}/100.`
      ];
      return res.json({ text: responses[Math.floor(Math.random() * responses.length)] });
    }

    const KEYWORDS_RESPONSES = [
      {
        keywords: ['mariage', 'cérémonie', 'fête', 'soirée', 'chic', 'costume', 'robe'],
        responses: [
          "Pour un événement formel ou une soirée, je recommande un costume bien ajusté ou une robe fluide en satin. Privilégiez des couleurs intemporelles (noir, bleu nuit, bordeaux) et des accessoires minimalistes de qualité.",
          "Un look chic réussit grâce aux détails : une belle montre, une pochette de costume assortie, ou des bijoux discrets et élégants. Évitez de porter plus de trois teintes différentes !"
        ]
      },
      {
        keywords: ['casual', 'décontracté', 'quotidien', 'jean', 'streetwear', 'sneakers', 't-shirt'],
        responses: [
          "Pour un style décontracté et efficace, associer un jean brut bien coupé, un t-shirt blanc épais et des sneakers de style épuré est un classique indémodable. Vous pouvez ajouter du relief avec une surchemise.",
          "Le secret du streetwear réside dans l'équilibre des volumes. Si vous optez pour un sweat ou un t-shirt oversize, associez-le à un bas plus structuré et ajusté."
        ]
      },
      {
        keywords: ['couleur', 'associer', 'accorder', 'teinte', 'ton', 'couleurs'],
        responses: [
          "Pour bien accorder les couleurs, utilisez la règle du contraste : associez des tons sombres (bleu marine, noir) avec des tons clairs (beige, blanc cassé). Les teintes naturelles (kaki, marron, sable) fonctionnent également très bien ensemble.",
          "Essayez de ne pas porter plus de 3 couleurs distinctes simultanément pour maintenir une bonne harmonie visuelle. Vous pouvez aussi essayer un look monochrome moderne."
        ]
      },
      {
        keywords: ['froid', 'hiver', 'manteau', 'laine', 'pull', 'veste'],
        responses: [
          "En hiver, le 'layering' (la superposition de couches) est idéal. Superposez par exemple une chemise en flanelle, un pull fin col rond, puis un manteau long en laine pour structurer la silhouette.",
          "Un grand manteau en laine beige ou gris anthracite est une pièce forte incontournable pour rester chic même par temps froid."
        ]
      },
      {
        keywords: ['chaud', 'été', 'chaleur', 'lin', 'short', 'soleil'],
        responses: [
          "Pour faire face à la chaleur, optez pour des matières respirantes comme le lin ou le coton léger. Une chemise en lin blanc avec les manches retroussées et un chino beige court forment une tenue parfaite.",
          "Privilégiez les teintes claires et naturelles qui réfléchissent la lumière. Côté chaussures, des mocassins en daim léger ou des baskets en toile propre feront l'affaire."
        ]
      }
    ];

    for (const category of KEYWORDS_RESPONSES) {
      if (category.keywords.some(k => cleanText.includes(k))) {
        return res.json({ text: category.responses[Math.floor(Math.random() * category.responses.length)] });
      }
    }

    const GENERAL_RESPONSES = [
      "C'est une excellente question de style. N'oubliez pas que le 'fit' (la coupe) est primordial. Même un vêtement simple aura l'air haut de gamme s'il est parfaitement ajusté à votre morphologie.",
      "Pour donner du relief à cette idée de tenue, essayez d'associer différentes matières et textures (du cuir avec de la maille, du jean avec du coton doux) pour créer du contraste visuel.",
      "Parfois, le minimalisme est la meilleure option. Essayez d'épurer votre tenue en retirant un accessoire superflu pour laisser respirer les pièces fortes de votre look.",
      "Le secret d'un style réussi réside souvent dans les petits détails : une belle ceinture en cuir assortie, des lunettes de soleil adaptées à votre visage, ou des bijoux discrets."
    ];

    let responseText = GENERAL_RESPONSES[Math.floor(Math.random() * GENERAL_RESPONSES.length)];
    if (history && history.length > 0) {
      const lastAiMsg = history.filter(m => m.sender === 'ai').pop();
      if (lastAiMsg) {
        const filtered = GENERAL_RESPONSES.filter(r => r !== lastAiMsg.text);
        if (filtered.length > 0) {
          responseText = filtered[Math.floor(Math.random() * filtered.length)];
        }
      }
    }

    res.json({ text: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

server.listen(PORT, () => {
  console.log(`Serveur (HTTP + Socket.io) en ligne sur http://localhost:${PORT}`);
});
