const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage de la base de données...");
  await prisma.kycVote.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.save.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log("Hachage du mot de passe par défaut...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  console.log("Création des utilisateurs...");
  const u1 = await prisma.user.create({
    data: {
      tag: "@sophie_chic",
      email: "sophie@style.com",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      bio: "Styliste professionnelle & passionnée de haute couture. Ici pour partager mes looks préférés et coacher les futurs talents.",
      isMentor: true,
      coachingRate: 45.0,
      kycStatus: "approved"
    }
  });

  const u2 = await prisma.user.create({
    data: {
      tag: "@alex_streetwear",
      email: "alex@style.com",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      bio: "Addict de sneakers et de streetwear japonais. Le style commence dans la rue.",
      isMentor: true,
      coachingRate: 35.0,
      kycStatus: "approved"
    }
  });

  const u3 = await prisma.user.create({
    data: {
      tag: "@elena_minimalist",
      email: "elena@style.com",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      bio: "Less is more. Palette neutre, lignes épurées et matières nobles.",
      isMentor: false,
      kycStatus: "pending"
    }
  });

  const u4 = await prisma.user.create({
    data: {
      tag: "@marcus_casual",
      email: "marcus@style.com",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      bio: "Le casual chic au quotidien. Simplicité et confort d'abord.",
      isMentor: false,
      kycStatus: "pending"
    }
  });

  const u5 = await prisma.user.create({
    data: {
      tag: "@mentor_lams",
      email: "mentor@lams.com",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      bio: "Mentor officiel de style Lams. Conseils personnalisés et audits de look au quotidien.",
      isMentor: true,
      coachingRate: 40.0,
      kycStatus: "approved"
    }
  });
  // password123

  console.log("Création des posts...");
  // Post 1 (Sophie)
  const p1 = await prisma.post.create({
    data: {
      userId: u1.id,
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      detectedStyle: "Chic / Soirée",
      score: 88,
      presenceScore: 18,
      harmonyScore: 17,
      coherenceScore: 19,
      fitScore: 19,
      accessoriesScore: 15
    }
  });

  // Post 2 (Alex)
  const p2 = await prisma.post.create({
    data: {
      userId: u2.id,
      img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
      detectedStyle: "Swagg",
      score: 92,
      presenceScore: 20,
      harmonyScore: 18,
      coherenceScore: 18,
      fitScore: 20,
      accessoriesScore: 16
    }
  });

  // Post 3 (Elena)
  const p3 = await prisma.post.create({
    data: {
      userId: u3.id,
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
      detectedStyle: "Professionnel",
      score: 82,
      presenceScore: 17,
      harmonyScore: 16,
      coherenceScore: 16,
      fitScore: 18,
      accessoriesScore: 15
    }
  });

  // Post 4 (Marcus)
  const p4 = await prisma.post.create({
    data: {
      userId: u4.id,
      img: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=600&auto=format&fit=crop",
      detectedStyle: "Casual",
      score: 75,
      presenceScore: 15,
      harmonyScore: 15,
      coherenceScore: 15,
      fitScore: 16,
      accessoriesScore: 14
    }
  });

  // Post 5 (Mentor Lams)
  const p5 = await prisma.post.create({
    data: {
      userId: u5.id,
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
      detectedStyle: "Casual Chic",
      score: 90,
      presenceScore: 19,
      harmonyScore: 18,
      coherenceScore: 18,
      fitScore: 19,
      accessoriesScore: 16
    }
  });

  console.log("Création des likes et commentaires...");
  // Sophie like Alex's post
  await prisma.like.create({ data: { userId: u1.id, postId: p2.id } });
  // Elena likes Alex's post
  await prisma.like.create({ data: { userId: u3.id, postId: p2.id } });
  // Alex likes Sophie's post
  await prisma.like.create({ data: { userId: u2.id, postId: p1.id } });

  // Comments
  await prisma.comment.create({
    data: {
      text: "J'adore l'harmonie des couleurs sur ce look, c'est super créatif !",
      userId: u1.id,
      postId: p2.id
    }
  });

  await prisma.comment.create({
    data: {
      text: "Un classique indémodable. Très élégant !",
      userId: u3.id,
      postId: p1.id
    }
  });

  console.log("Création des suivis (follows)...");
  await prisma.follow.create({ data: { followerId: u3.id, followingId: u1.id } }); // Elena follows Sophie
  await prisma.follow.create({ data: { followerId: u4.id, followingId: u2.id } }); // Marcus follows Alex
  await prisma.follow.create({ data: { followerId: u2.id, followingId: u1.id } }); // Alex follows Sophie

  console.log("Base de données initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
