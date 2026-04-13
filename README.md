# Excellent Training — Système de Gestion de Formation

> Application web de gestion de formations pour le centre **Excellent Training** de la société **Green Building**.

---

## Table des matières

- [Contexte](#contexte)
- [Stack Technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation et lancement](#installation-et-lancement)
- [Structure de la base de données](#structure-de-la-base-de-données)
- [Acteurs et permissions](#acteurs-et-permissions)
- [Endpoints API](#endpoints-api)
- [Documentation UML](#documentation-uml)
- [Équipe](#équipe)

---

## Contexte

Le centre de formation **Excellent Training** gère chaque année des sessions de formation au profit des personnels de la société Green Building. Avant ce projet, la gestion était entièrement manuelle : papier, Excel, email.

Cette application web centralise et automatise :
- Le suivi des formations (titre, année, durée, budget, domaine)
- La gestion des formateurs (internes et externes)
- L'inscription des participants (liés à une structure et un profil)
- La consultation des statistiques par le responsable du centre
- La gestion des comptes et des référentiels par l'administrateur

---

## Stack Technique

| Couche | Technologie | Version |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | React 18 / Vite 6 |
| Backend | Spring Boot + Java | Spring Boot 4.0.5 / Java 25 |
| Sécurité | Spring Security + JWT | Stateless |
| ORM | Hibernate via Spring Data JPA | - |
| Base de données | MySQL | 9.6 |
| Build Backend | Maven | 3.9.14 |
| Build Frontend | npm | 11.x |

---

## Architecture du projet

```
excellent-training/
├── backend/                    # API REST Spring Boot
│   ├── src/main/java/com/greenbuilding/excellenttraining/
│   │   ├── controller/         # Endpoints REST
│   │   ├── service/            # Logique métier
│   │   ├── repository/         # Accès base de données (JPA)
│   │   ├── entity/             # Entités JPA (tables)
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── security/           # Configuration JWT + Spring Security
│   │   └── exception/          # Gestion globale des erreurs
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                   # Interface React
│   ├── src/
│   │   ├── components/         # Composants réutilisables
│   │   ├── pages/              # Pages par rôle (Admin, Responsable, Utilisateur)
│   │   ├── services/           # Appels API (fetch natif)
│   │   ├── context/            # Contexte Auth (JWT, rôle)
│   │   └── routes/             # Routes protégées par rôle
│   ├── index.html
│   └── vite.config.js
│
├── database/                   # Scripts SQL
│   ├── schema.sql              # Création des tables
│   └── data.sql                # Données initiales (rôles, domaines...)
│
├── documentation/              # Rapport et diagrammes
│   └── UML/
│       ├── README.md           # Index des diagrammes
│       ├── 01-classe.md        # Diagramme de classes
│       ├── 02-auth.md          # Séquence authentification
│       ├── 03-creation-formation.md
│       ├── 04-affectation-formateur.md
│       ├── 05-inscription-participant.md
│       ├── 06-dashboard-stats.md
│       ├── 07-creation-compte.md
│       └── 08-referentiels.md
│
└── README.md                   # Ce fichier
```

---

## Prérequis

Avant de lancer le projet, assure-toi d'avoir installé :

| Outil | Version minimale |
|---|---|
| Java (OpenJDK) | 25 |
| Maven | 3.9+ |
| Node.js | 18+ |
| npm | 10+ |
| MySQL | 8+ |

---

## Installation et lancement

### 1. Cloner le repository

```bash
git clone https://github.com/Louay-Barraq/excellent-training.git
cd excellent-training
```

### 2. Démarrer MySQL

```bash
brew services start mysql
```

### 3. Lancer le Backend

```bash
cd backend
./mvnw spring-boot:run
```

La base de données `excellent_training` est créée automatiquement au premier lancement.

> Backend disponible sur : `http://localhost:8080`

### 4. Lancer le Frontend

```bash
cd frontend
npm install
npm run dev
```

> Frontend disponible sur : `http://localhost:5173`

---

## Structure de la base de données

### Entités principales

| Table | Description |
|---|---|
| `utilisateur` | Comptes des employés du centre |
| `role` | Droits d'accès (Admin, Responsable, Utilisateur) |
| `formation` | Sessions de formation |
| `formateur` | Animateurs (internes ou externes) |
| `employeur` | Sociétés des formateurs externes |
| `participant` | Employés inscrits aux formations |
| `domaine` | Catégories de formation |
| `structure` | Directions des participants |
| `profil` | Postes des participants |
| `formation_participant` | Table de jointure Many-to-Many |

### Relations clés

```
Formation  ──Many-to-One──▶  Domaine
Formation  ──Many-to-One──▶  Formateur
Formation  ──Many-to-Many──  Participant  (via formation_participant)
Formateur  ──Many-to-One──▶  Employeur   (optionnel, formateurs externes)
Participant ─Many-to-One──▶  Structure
Participant ─Many-to-One──▶  Profil
Utilisateur ─Many-to-One──▶  Role
```

---

## Acteurs et permissions

| Rôle | Permissions |
|---|---|
| `UTILISATEUR` | Gérer les formations, formateurs et participants (CRUD complet) |
| `RESPONSABLE` | Consulter le tableau de bord statistique (lecture seule) |
| `ADMINISTRATEUR` | Tout faire + gérer les comptes utilisateurs + maintenir les référentiels |

---

## Endpoints API

### Authentification
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| POST | `/api/auth/login` | Connexion + génération JWT | Public |

### Formations
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/formations` | Lister toutes les formations | AUTH |
| GET | `/api/formations/{id}` | Détail d'une formation | AUTH |
| POST | `/api/formations` | Créer une formation | UTILISATEUR |
| PUT | `/api/formations/{id}` | Modifier une formation | UTILISATEUR |
| DELETE | `/api/formations/{id}` | Supprimer une formation | UTILISATEUR |
| PUT | `/api/formations/{id}/formateur/{fId}` | Affecter un formateur | UTILISATEUR |
| POST | `/api/formations/{id}/participants` | Inscrire des participants | UTILISATEUR |

### Formateurs
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/formateurs` | Lister tous les formateurs | AUTH |
| POST | `/api/formateurs` | Ajouter un formateur | UTILISATEUR |
| PUT | `/api/formateurs/{id}` | Modifier un formateur | UTILISATEUR |
| DELETE | `/api/formateurs/{id}` | Supprimer un formateur | UTILISATEUR |

### Participants
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/participants` | Lister tous les participants | AUTH |
| POST | `/api/participants` | Ajouter un participant | UTILISATEUR |
| PUT | `/api/participants/{id}` | Modifier un participant | UTILISATEUR |
| DELETE | `/api/participants/{id}` | Supprimer un participant | UTILISATEUR |

### Statistiques
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/stats/dashboard` | Tableau de bord complet | RESPONSABLE |

### Administration
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/utilisateurs` | Lister les comptes | ADMIN |
| POST | `/api/utilisateurs` | Créer un compte | ADMIN |
| PUT | `/api/utilisateurs/{id}` | Modifier un compte | ADMIN |
| DELETE | `/api/utilisateurs/{id}` | Supprimer un compte | ADMIN |
| GET | `/api/referentiels` | Lister domaines, structures, profils | ADMIN |
| POST | `/api/referentiels/{type}` | Ajouter un référentiel | ADMIN |
| PUT | `/api/referentiels/{type}/{id}` | Modifier un référentiel | ADMIN |
| DELETE | `/api/referentiels/{type}/{id}` | Supprimer un référentiel | ADMIN |

---

## Documentation UML

Tous les diagrammes sont disponibles dans [`documentation/UML/`](./documentation/UML/README.md) :

- Diagramme de classes (9 entités + toutes les relations)
- 7 diagrammes de séquences couvrant tous les scénarios métier

---

## Workflow Git

```
main        ← code stable pour la soutenance
develop     ← fusion des fonctionnalités terminées
feat/xxx    ← une branche par fonctionnalité
```

### Exemples de branches
```bash
git checkout -b feat/auth
git checkout -b feat/crud-formation
git checkout -b feat/inscription-participant
git checkout -b feat/dashboard-stats
```

---

## Informations
- Binômes : Louay Barraq - Maher Majdoub
- Niveau : 1ère Année Ingénieur IDL 
- Institut : **Institut Supérieur d'Informatique (ISI)** — Université de Tunis El Manar  
- Année Universitaire :**2025/2026**  
- Date limite de rendu : **30 Avril 2026**
