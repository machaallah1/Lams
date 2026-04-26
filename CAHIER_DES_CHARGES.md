# Cahier des Charges - "Style App" (Frontend MVP)

Ce document répertorie l'ensemble des cas d'usage, des fonctionnalités techniques et des choix d'architecture implémentés dans la version Frontend MVP du projet. Il peut servir de base pour la documentation de l'API / le développement Backend à venir.

---

## 1. Vision et Concept
**Style App** est une application web combinant les aspects viraux d’un réseau social (type Instagram/Pinterest), l'analyse d'intelligence artificielle pour la mode, et un système de monétisation en pair-à-pair pour des services de stylisme et de mentorat.

**L'écosystème repose sur 3 piliers :**
1. Partage et inspiration (Réseau Social).
2. Notation et assistance personnalisée (Intelligence Artificielle).
3. Monétisation et mise en relation professionnelle (Mentorat).

---

## 2. Architecture Technique (Frontend)
- **Framework** : React (Vite)
- **Routage** : React Router DOM (`/`, `/explore`, `/profile`, `/aichat`, `/messages`, etc.)
- **Stylisation** : Tailwind CSS (Glassmorphism, animations fluides, gradients)
- **Gestionnaire d'état Global** : Zustand
  - `authStore.js` : Gère l'authentification simulée, les paramètres du compte courant et les préférences de monétisation.
  - `socialStore.js` : Gère le feed, les posts, les likes, les sauvegardes, les notifications, les messages et les commentaires.
- **Icônes** : Lucide React

---

## 3. Fonctionnalités Développées par Module

### 3.1. Authentification & Onboarding (`Login`, `Register`, `VerifyOTP`)
- Inscription et Connexion classiques.
- Processus de vérification par code OTP.
- **Statut Actuel** : Maquettes fonctionnelles visuellement (simulation locale gérée par `authStore.js`).

### 3.2. Le Réseau Social & Feed (`Dashboard`, `Explore`, `MainLayout`)
- **MainLayout** : Barre de navigation latérale ergonomique avec un menu de notifications dynamique (cloche avec badge non-lu).
- **Dashboard / Home** : Flux d'actualité présentant les styles publiés par les autres utilisateurs.
- **Explore** : Moteur de recherche et grille pour découvrir de nouveaux styles et créateurs.
- **Interactions Sociales (PostCards)** :
  - Liker (mise à jour incrémentale du compteur).
  - Commenter (Système de commentaires avec fils de réponses multi-niveaux via modal).
  - Sauvegarder dans sa garde-robe privée (Moodboard).
  - Partager un Post (Ouvre un modal pour sélectionner un ami et envoyer un message).
  - S'abonner (Follow) à un créateur.

### 3.3. Intelligence Artificielle (IA Styliste)
- **Évaluation des Posts** : Chaque photo/style (`PostCard`) possède un "Score IA" global. Au survol, une infobulle dévoile les notes détaillées (Harmonie, Cohérence, Propreté, etc.).
- **AiChat** : Un module conversationnel (Chatbot) fonctionnant comme un styliste personnel.
  - L'utilisateur peut discuter, demander des conseils et envoyer des photos pour analyse.
  - Comprend un blocage progressif vers un abonnement (**PremiumPaywall**) pour les fonctionnalités avancées.

### 3.4. Profil, Paramètres et Garde-Robe (`Profile`, `Settings`)
- **Paramètres (Settings)** : 
  - Modification classique du profil (Pseudo, Bio).
  - Activation du système de monétisation (Mentorat) et définition manuelle de la tarification Horaire ($/h).
- **Profil Utilisateur (Profile)** :
  - **Onglet Récent** : Affiche les publications de l'utilisateur.
  - **Onglet Garde-Robe** : Affiche tous les posts likés via le bouton "Signet" (uniquement visible sur le profil privé).
  - **Gamification "Devenez Mentor"** : Un affichage conditionnel montrant une barre de progression avec 5 pré-requis nécessaires (Score IA de 85%, Validation Sociale, etc.) pour inciter les utilisateurs à publier de la qualité. Dès que le compte est défini en mentor, ce bloc disparaît.
  
### 3.5. Modèle de Monétisation (Mentorat Hybride)
- **Le Flux "Booking" (`BookingModal.jsx`)** : 
  - Visiter le profil d'un Mentor permet de "Réserver".
  - La Modale propose la saisie d'une date, d'une heure et d'un Message introductif.
  - Le système calcule transparent les frais de plateforme (ex: 15%).
  - L'approche "Hybride" relie la monétisation à la communication.
  
### 3.6. Messagerie Sécurisée (`Messages.jsx`)
- **Inbox** : Interface type iMessage modélisant des "Threads".
- **Intégration du Mentorat** : Lors du paiement sur le `BookingModal`, un message formaté avec le résumé de la réservation est automatiquement injecté dans le chat du Mentor, forçant l'échange et la prise de contact pour poursuivre les sessions monétisées.
- **Intégration des Partages** : Les utilisateurs peuvent s'envoyer des styles. La messagerie est capable d'afficher un widget photo cliquable si le message contient une pièce jointe `POST`.

---

## 4. Ce Qui Restera à Faire (Intégration API / Backend)

Bien que le Front-End simule activement l'expérience complète en utilisant un Mock local (`socialStore` / Zustand), les briques suivantes seront requises pour la mise en production :
1. **Implémenter une Base de Données (ex: PostgreSQL/Firebase)** pour la persistance des données.
2. **Implémenter un Provider d'Authentification (ex: Auth0, JWT)**.
3. **Traiter les images avec un bucket distant** (S3, Cloudinary) via des requêtes form-data sur la page `CreatePost`.
4. **Intégrer Stripe ou PayPal** : Remplacer la Modale de validation factice par une véritable API Checkout pour sécuriser les fonds lors d'une transaction de Mentorat.
---

## 5. Spécifications Backend (En cours de développement 🏗️)

### 5.1. Architecture Serveur
- **Serveur** : Node.js avec Express.js.
- **Base de Données** : SQLite (via Prisma ORM) pour un lancement sans configuration et un prototypage rapide.
- **Sécurité** : JSON Web Tokens (JWT) pour l'authentification et bcrypt pour le hashage des mots de passe.

### 5.2. Schéma de Base de Données (Prisma)
*(Les tables seront définies ici au fur et à mesure de leur création)*
- **User** : Enregistrement des profils, paramètres de mentorat, solde.
- **Post** : Stockage des styles, compteur de likes, métadonnées de l'IA.
- **Conversation / Message** : Support du tchat et des validations de réservation.

### 5.3. Routes API Implémentées
- `POST /api/auth/register` : Création de compte + hashage bcrypt + génération du JWT.
- `POST /api/auth/login` : Vérification des identifiants et retour du Token et profil.
- `GET /api/posts` : Protocole initial fonctionnel pour alimenter le Dashboard.

## 6. Prochaines Étapes Techniques (En cours)
- Pousser le backend plus en avant (Upload image réel, Websockets pour la vraie messagerie).
