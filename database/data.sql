-- ============================================================
-- Excellent Training — Base de données
-- Université de Tunis El Manar — ISI 2025/2026
-- ============================================================

-- Création de la base si elle n'existe pas
CREATE DATABASE IF NOT EXISTS excellent_training
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE excellent_training;

-- ============================================================
-- DONNÉES INITIALES — Référentiels
-- ============================================================

-- Rôles
INSERT IGNORE INTO role (nom) VALUES ('ADMINISTRATEUR');
INSERT IGNORE INTO role (nom) VALUES ('RESPONSABLE');
INSERT IGNORE INTO role (nom) VALUES ('UTILISATEUR');

-- Domaines
INSERT IGNORE INTO domaine (libelle) VALUES ('Informatique');
INSERT IGNORE INTO domaine (libelle) VALUES ('Gestion');
INSERT IGNORE INTO domaine (libelle) VALUES ('Langues');
INSERT IGNORE INTO domaine (libelle) VALUES ('Finance');
INSERT IGNORE INTO domaine (libelle) VALUES ('Mécanique');
INSERT IGNORE INTO domaine (libelle) VALUES ('Ressources Humaines');
INSERT IGNORE INTO domaine (libelle) VALUES ('Marketing');

-- Structures
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Centrale');
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Régionale Nord');
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Régionale Sud');
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Régionale Est');
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Régionale Ouest');

-- Profils
INSERT IGNORE INTO profil (libelle) VALUES ('Cadre Supérieur');
INSERT IGNORE INTO profil (libelle) VALUES ('Cadre');
INSERT IGNORE INTO profil (libelle) VALUES ('Technicien Supérieur');
INSERT IGNORE INTO profil (libelle) VALUES ('Technicien');
INSERT IGNORE INTO profil (libelle) VALUES ('Ouvrier Qualifié');
INSERT IGNORE INTO profil (libelle) VALUES ('Ouvrier');
INSERT IGNORE INTO profil (libelle) VALUES ('Agent Administratif');

-- ============================================================
-- COMPTES UTILISATEURS (mots de passe = 'admin123')
-- Hash BCrypt généré via Spring Security BCryptPasswordEncoder
-- ============================================================

-- Compte administrateur
INSERT IGNORE INTO utilisateur (login, password, id_role)
SELECT 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHBW', id
FROM role WHERE nom = 'ADMINISTRATEUR';

-- Compte responsable
INSERT IGNORE INTO utilisateur (login, password, id_role)
SELECT 'responsable', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHBW', id
FROM role WHERE nom = 'RESPONSABLE';

-- Compte utilisateur simple
INSERT IGNORE INTO utilisateur (login, password, id_role)
SELECT 'utilisateur', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHBW', id
FROM role WHERE nom = 'UTILISATEUR';

-- ============================================================
-- DONNÉES DE DÉMONSTRATION
-- ============================================================

-- Employeurs
INSERT IGNORE INTO employeur (nom_employeur) VALUES ('Société Alpha Consulting');
INSERT IGNORE INTO employeur (nom_employeur) VALUES ('Cabinet Beta Formation');
INSERT IGNORE INTO employeur (nom_employeur) VALUES ('Institut Gamma Tech');

-- Formateurs internes
INSERT IGNORE INTO formateur (nom, prenom, email, tel, type, id_employeur)
VALUES ('Ben Ali', 'Sami', 'sami.benali@greenbuilding.tn', 71234567, 'INTERNE', NULL);

INSERT IGNORE INTO formateur (nom, prenom, email, tel, type, id_employeur)
VALUES ('Trabelsi', 'Rania', 'rania.trabelsi@greenbuilding.tn', 71234568, 'INTERNE', NULL);

-- Formateurs externes
INSERT IGNORE INTO formateur (nom, prenom, email, tel, type, id_employeur)
VALUES ('Mansouri', 'Karim', 'k.mansouri@alpha.tn', 98765432, 'EXTERNE',
  (SELECT id FROM employeur WHERE nom_employeur = 'Société Alpha Consulting'));

INSERT IGNORE INTO formateur (nom, prenom, email, tel, type, id_employeur)
VALUES ('Gharbi', 'Leila', 'l.gharbi@beta.tn', 98765433, 'EXTERNE',
  (SELECT id FROM employeur WHERE nom_employeur = 'Cabinet Beta Formation'));

-- Participants
INSERT IGNORE INTO participant (nom, prenom, email, tel, id_structure, id_profil)
VALUES ('Chaabane', 'Ahmed',
  'a.chaabane@greenbuilding.tn', 20111111,
  (SELECT id FROM structure WHERE libelle = 'Direction Centrale'),
  (SELECT id FROM profil WHERE libelle = 'Cadre'));

INSERT IGNORE INTO participant (nom, prenom, email, tel, id_structure, id_profil)
VALUES ('Bouaziz', 'Fatma',
  'f.bouaziz@greenbuilding.tn', 20222222,
  (SELECT id FROM structure WHERE libelle = 'Direction Régionale Nord'),
  (SELECT id FROM profil WHERE libelle = 'Technicien Supérieur'));

INSERT IGNORE INTO participant (nom, prenom, email, tel, id_structure, id_profil)
VALUES ('Khelil', 'Mohamed',
  'm.khelil@greenbuilding.tn', 20333333,
  (SELECT id FROM structure WHERE libelle = 'Direction Régionale Sud'),
  (SELECT id FROM profil WHERE libelle = 'Ouvrier Qualifié'));

INSERT IGNORE INTO participant (nom, prenom, email, tel, id_structure, id_profil)
VALUES ('Saidi', 'Amira',
  'a.saidi@greenbuilding.tn', 20444444,
  (SELECT id FROM structure WHERE libelle = 'Direction Centrale'),
  (SELECT id FROM profil WHERE libelle = 'Agent Administratif'));

INSERT IGNORE INTO participant (nom, prenom, email, tel, id_structure, id_profil)
VALUES ('Hamdi', 'Youssef',
  'y.hamdi@greenbuilding.tn', 20555555,
  (SELECT id FROM structure WHERE libelle = 'Direction Régionale Est'),
  (SELECT id FROM profil WHERE libelle = 'Cadre Supérieur'));

-- Formations
INSERT IGNORE INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
VALUES ('Spring Boot & Microservices', 2025, 5, 3500.00,
  (SELECT id FROM domaine WHERE libelle = 'Informatique'),
  (SELECT id FROM formateur WHERE email = 'sami.benali@greenbuilding.tn'));

INSERT IGNORE INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
VALUES ('Gestion de Projet Agile', 2025, 3, 2200.00,
  (SELECT id FROM domaine WHERE libelle = 'Gestion'),
  (SELECT id FROM formateur WHERE email = 'k.mansouri@alpha.tn'));

INSERT IGNORE INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
VALUES ('Anglais Professionnel', 2025, 10, 1800.00,
  (SELECT id FROM domaine WHERE libelle = 'Langues'),
  (SELECT id FROM formateur WHERE email = 'l.gharbi@beta.tn'));

INSERT IGNORE INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
VALUES ('Comptabilité Analytique', 2026, 4, 2800.00,
  (SELECT id FROM domaine WHERE libelle = 'Finance'),
  (SELECT id FROM formateur WHERE email = 'rania.trabelsi@greenbuilding.tn'));

-- Inscriptions (formation_participant)
INSERT IGNORE INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id FROM formation f, participant p
WHERE f.titre = 'Spring Boot & Microservices'
  AND p.email IN ('a.chaabane@greenbuilding.tn', 'f.bouaziz@greenbuilding.tn', 'y.hamdi@greenbuilding.tn');

INSERT IGNORE INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id FROM formation f, participant p
WHERE f.titre = 'Gestion de Projet Agile'
  AND p.email IN ('a.saidi@greenbuilding.tn', 'a.chaabane@greenbuilding.tn');

INSERT IGNORE INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id FROM formation f, participant p
WHERE f.titre = 'Anglais Professionnel'
  AND p.email IN ('f.bouaziz@greenbuilding.tn', 'm.khelil@greenbuilding.tn', 'a.saidi@greenbuilding.tn');

-- ============================================================
-- VÉRIFICATION
-- ============================================================
SELECT 'Rôles'       AS table_name, COUNT(*) AS count FROM role
UNION ALL
SELECT 'Domaines',      COUNT(*) FROM domaine
UNION ALL
SELECT 'Structures',    COUNT(*) FROM structure
UNION ALL
SELECT 'Profils',       COUNT(*) FROM profil
UNION ALL
SELECT 'Utilisateurs',  COUNT(*) FROM utilisateur
UNION ALL
SELECT 'Formateurs',    COUNT(*) FROM formateur
UNION ALL
SELECT 'Participants',  COUNT(*) FROM participant
UNION ALL
SELECT 'Formations',    COUNT(*) FROM formation
UNION ALL
SELECT 'Inscriptions',  COUNT(*) FROM formation_participant;
