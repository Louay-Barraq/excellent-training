-- ============================================================
-- Excellent Training — Base de données étendue pour les tests
-- Université de Tunis El Manar — ISI 2025/2026
-- ============================================================
-- Ce script n'écrase pas database/data.sql.
-- Il peut être exécuté seul ou après database/data.sql.
--
-- Objectifs de données :
-- - 3 rôles
-- - 10 domaines
-- - 7 formateurs
-- - 7 formations
-- - 10 participants
-- - 10 profils
-- - 12 structures
-- - 6 utilisateurs : 2 par rôle
-- ============================================================

CREATE DATABASE IF NOT EXISTS excellent_training
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE excellent_training;

-- ============================================================
-- DONNÉES INITIALES — Référentiels
-- ============================================================

-- Rôles : les mêmes que database/data.sql
INSERT IGNORE INTO role (nom) VALUES ('ADMINISTRATEUR');
INSERT IGNORE INTO role (nom) VALUES ('RESPONSABLE');
INSERT IGNORE INTO role (nom) VALUES ('UTILISATEUR');

-- Domaines : 10
INSERT IGNORE INTO domaine (libelle) VALUES ('Informatique');
INSERT IGNORE INTO domaine (libelle) VALUES ('Gestion');
INSERT IGNORE INTO domaine (libelle) VALUES ('Langues');
INSERT IGNORE INTO domaine (libelle) VALUES ('Finance');
INSERT IGNORE INTO domaine (libelle) VALUES ('Mécanique');
INSERT IGNORE INTO domaine (libelle) VALUES ('Ressources Humaines');
INSERT IGNORE INTO domaine (libelle) VALUES ('Marketing');
INSERT IGNORE INTO domaine (libelle) VALUES ('Qualité');
INSERT IGNORE INTO domaine (libelle) VALUES ('Sécurité');
INSERT IGNORE INTO domaine (libelle) VALUES ('Communication');

-- Structures : 12
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Centrale');
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Régionale Nord');
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Régionale Sud');
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Régionale Est');
INSERT IGNORE INTO structure (libelle) VALUES ('Direction Régionale Ouest');
INSERT IGNORE INTO structure (libelle) VALUES ('Département Informatique');
INSERT IGNORE INTO structure (libelle) VALUES ('Département Finance');
INSERT IGNORE INTO structure (libelle) VALUES ('Département RH');
INSERT IGNORE INTO structure (libelle) VALUES ('Département Marketing');
INSERT IGNORE INTO structure (libelle) VALUES ('Service Qualité');
INSERT IGNORE INTO structure (libelle) VALUES ('Service Sécurité');
INSERT IGNORE INTO structure (libelle) VALUES ('Service Communication');

-- Profils : 10
INSERT IGNORE INTO profil (libelle) VALUES ('Cadre Supérieur');
INSERT IGNORE INTO profil (libelle) VALUES ('Cadre');
INSERT IGNORE INTO profil (libelle) VALUES ('Technicien Supérieur');
INSERT IGNORE INTO profil (libelle) VALUES ('Technicien');
INSERT IGNORE INTO profil (libelle) VALUES ('Ouvrier Qualifié');
INSERT IGNORE INTO profil (libelle) VALUES ('Ouvrier');
INSERT IGNORE INTO profil (libelle) VALUES ('Agent Administratif');
INSERT IGNORE INTO profil (libelle) VALUES ('Chef de Service');
INSERT IGNORE INTO profil (libelle) VALUES ('Ingénieur');
INSERT IGNORE INTO profil (libelle) VALUES ('Assistant');

-- ============================================================
-- COMPTES UTILISATEURS
-- Mots de passe = 'admin123'
-- Hash BCrypt généré via Spring Security BCryptPasswordEncoder
-- ============================================================

-- Administrateurs : 2
INSERT IGNORE INTO utilisateur (login, password, id_role)
SELECT 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHBW', id
FROM role WHERE nom = 'ADMINISTRATEUR';

INSERT IGNORE INTO utilisateur (login, password, id_role)
SELECT 'admin2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHBW', id
FROM role WHERE nom = 'ADMINISTRATEUR';

-- Responsables : 2
INSERT IGNORE INTO utilisateur (login, password, id_role)
SELECT 'responsable', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHBW', id
FROM role WHERE nom = 'RESPONSABLE';

INSERT IGNORE INTO utilisateur (login, password, id_role)
SELECT 'responsable2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHBW', id
FROM role WHERE nom = 'RESPONSABLE';

-- Utilisateurs simples : 2
INSERT IGNORE INTO utilisateur (login, password, id_role)
SELECT 'utilisateur', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHBW', id
FROM role WHERE nom = 'UTILISATEUR';

INSERT IGNORE INTO utilisateur (login, password, id_role)
SELECT 'utilisateur2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHBW', id
FROM role WHERE nom = 'UTILISATEUR';

-- ============================================================
-- DONNÉES DE DÉMONSTRATION
-- ============================================================

-- Employeurs
INSERT INTO employeur (nom_employeur)
SELECT 'Société Alpha Consulting'
WHERE NOT EXISTS (SELECT 1 FROM employeur WHERE nom_employeur = 'Société Alpha Consulting');

INSERT INTO employeur (nom_employeur)
SELECT 'Cabinet Beta Formation'
WHERE NOT EXISTS (SELECT 1 FROM employeur WHERE nom_employeur = 'Cabinet Beta Formation');

INSERT INTO employeur (nom_employeur)
SELECT 'Institut Gamma Tech'
WHERE NOT EXISTS (SELECT 1 FROM employeur WHERE nom_employeur = 'Institut Gamma Tech');

INSERT INTO employeur (nom_employeur)
SELECT 'Academy Delta Skills'
WHERE NOT EXISTS (SELECT 1 FROM employeur WHERE nom_employeur = 'Academy Delta Skills');

INSERT INTO employeur (nom_employeur)
SELECT 'Epsilon Conseil'
WHERE NOT EXISTS (SELECT 1 FROM employeur WHERE nom_employeur = 'Epsilon Conseil');

-- Formateurs : 7
INSERT INTO formateur (nom, prenom, email, tel, type, id_employeur)
SELECT 'Ben Ali', 'Sami', 'sami.benali@greenbuilding.tn', 71234567, 'INTERNE', NULL
WHERE NOT EXISTS (SELECT 1 FROM formateur WHERE email = 'sami.benali@greenbuilding.tn');

INSERT INTO formateur (nom, prenom, email, tel, type, id_employeur)
SELECT 'Trabelsi', 'Rania', 'rania.trabelsi@greenbuilding.tn', 71234568, 'INTERNE', NULL
WHERE NOT EXISTS (SELECT 1 FROM formateur WHERE email = 'rania.trabelsi@greenbuilding.tn');

INSERT INTO formateur (nom, prenom, email, tel, type, id_employeur)
SELECT 'Mansouri', 'Karim', 'k.mansouri@alpha.tn', 98765432, 'EXTERNE', e.id
FROM employeur e
WHERE e.nom_employeur = 'Société Alpha Consulting'
  AND NOT EXISTS (SELECT 1 FROM formateur WHERE email = 'k.mansouri@alpha.tn');

INSERT INTO formateur (nom, prenom, email, tel, type, id_employeur)
SELECT 'Gharbi', 'Leila', 'l.gharbi@beta.tn', 98765433, 'EXTERNE', e.id
FROM employeur e
WHERE e.nom_employeur = 'Cabinet Beta Formation'
  AND NOT EXISTS (SELECT 1 FROM formateur WHERE email = 'l.gharbi@beta.tn');

INSERT INTO formateur (nom, prenom, email, tel, type, id_employeur)
SELECT 'Ayari', 'Noura', 'noura.ayari@greenbuilding.tn', 71234569, 'INTERNE', NULL
WHERE NOT EXISTS (SELECT 1 FROM formateur WHERE email = 'noura.ayari@greenbuilding.tn');

INSERT INTO formateur (nom, prenom, email, tel, type, id_employeur)
SELECT 'Jelassi', 'Omar', 'o.jelassi@gamma.tn', 98765434, 'EXTERNE', e.id
FROM employeur e
WHERE e.nom_employeur = 'Institut Gamma Tech'
  AND NOT EXISTS (SELECT 1 FROM formateur WHERE email = 'o.jelassi@gamma.tn');

INSERT INTO formateur (nom, prenom, email, tel, type, id_employeur)
SELECT 'Mejri', 'Salma', 's.mejri@delta.tn', 98765435, 'EXTERNE', e.id
FROM employeur e
WHERE e.nom_employeur = 'Academy Delta Skills'
  AND NOT EXISTS (SELECT 1 FROM formateur WHERE email = 's.mejri@delta.tn');

-- Participants : 10
INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Chaabane', 'Ahmed', 'a.chaabane@greenbuilding.tn', 20111111, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Cadre'
WHERE s.libelle = 'Direction Centrale'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 'a.chaabane@greenbuilding.tn');

INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Bouaziz', 'Fatma', 'f.bouaziz@greenbuilding.tn', 20222222, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Technicien Supérieur'
WHERE s.libelle = 'Direction Régionale Nord'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 'f.bouaziz@greenbuilding.tn');

INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Khelil', 'Mohamed', 'm.khelil@greenbuilding.tn', 20333333, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Ouvrier Qualifié'
WHERE s.libelle = 'Direction Régionale Sud'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 'm.khelil@greenbuilding.tn');

INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Saidi', 'Amira', 'a.saidi@greenbuilding.tn', 20444444, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Agent Administratif'
WHERE s.libelle = 'Direction Centrale'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 'a.saidi@greenbuilding.tn');

INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Hamdi', 'Youssef', 'y.hamdi@greenbuilding.tn', 20555555, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Cadre Supérieur'
WHERE s.libelle = 'Direction Régionale Est'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 'y.hamdi@greenbuilding.tn');

INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Nasri', 'Ines', 'i.nasri@greenbuilding.tn', 20666666, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Ingénieur'
WHERE s.libelle = 'Département Informatique'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 'i.nasri@greenbuilding.tn');

INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Baccouche', 'Tarek', 't.baccouche@greenbuilding.tn', 20777777, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Chef de Service'
WHERE s.libelle = 'Département Finance'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 't.baccouche@greenbuilding.tn');

INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Mrad', 'Sarra', 's.mrad@greenbuilding.tn', 20888888, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Assistant'
WHERE s.libelle = 'Département RH'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 's.mrad@greenbuilding.tn');

INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Dahmani', 'Walid', 'w.dahmani@greenbuilding.tn', 20999999, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Technicien'
WHERE s.libelle = 'Service Qualité'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 'w.dahmani@greenbuilding.tn');

INSERT INTO participant (nom, prenom, email, tel, id_structure, id_profil)
SELECT 'Zouari', 'Meriem', 'm.zouari@greenbuilding.tn', 20000001, s.id, p.id
FROM structure s
JOIN profil p ON p.libelle = 'Cadre'
WHERE s.libelle = 'Service Communication'
  AND NOT EXISTS (SELECT 1 FROM participant WHERE email = 'm.zouari@greenbuilding.tn');

-- Formations : 7
INSERT INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
SELECT 'Spring Boot & Microservices', 2025, 5, 3500.00, d.id, f.id
FROM domaine d
JOIN formateur f ON f.email = 'sami.benali@greenbuilding.tn'
WHERE d.libelle = 'Informatique'
  AND NOT EXISTS (SELECT 1 FROM formation WHERE titre = 'Spring Boot & Microservices');

INSERT INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
SELECT 'Gestion de Projet Agile', 2025, 3, 2200.00, d.id, f.id
FROM domaine d
JOIN formateur f ON f.email = 'k.mansouri@alpha.tn'
WHERE d.libelle = 'Gestion'
  AND NOT EXISTS (SELECT 1 FROM formation WHERE titre = 'Gestion de Projet Agile');

INSERT INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
SELECT 'Anglais Professionnel', 2025, 10, 1800.00, d.id, f.id
FROM domaine d
JOIN formateur f ON f.email = 'l.gharbi@beta.tn'
WHERE d.libelle = 'Langues'
  AND NOT EXISTS (SELECT 1 FROM formation WHERE titre = 'Anglais Professionnel');

INSERT INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
SELECT 'Comptabilité Analytique', 2026, 4, 2800.00, d.id, f.id
FROM domaine d
JOIN formateur f ON f.email = 'rania.trabelsi@greenbuilding.tn'
WHERE d.libelle = 'Finance'
  AND NOT EXISTS (SELECT 1 FROM formation WHERE titre = 'Comptabilité Analytique');

INSERT INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
SELECT 'Management de la Qualité ISO 9001', 2026, 4, 3100.00, d.id, f.id
FROM domaine d
JOIN formateur f ON f.email = 'noura.ayari@greenbuilding.tn'
WHERE d.libelle = 'Qualité'
  AND NOT EXISTS (SELECT 1 FROM formation WHERE titre = 'Management de la Qualité ISO 9001');

INSERT INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
SELECT 'Cybersécurité pour Utilisateurs', 2026, 2, 1900.00, d.id, f.id
FROM domaine d
JOIN formateur f ON f.email = 'o.jelassi@gamma.tn'
WHERE d.libelle = 'Sécurité'
  AND NOT EXISTS (SELECT 1 FROM formation WHERE titre = 'Cybersécurité pour Utilisateurs');

INSERT INTO formation (titre, annee, duree, budget, id_domaine, id_formateur)
SELECT 'Communication Interne Efficace', 2026, 3, 2100.00, d.id, f.id
FROM domaine d
JOIN formateur f ON f.email = 's.mejri@delta.tn'
WHERE d.libelle = 'Communication'
  AND NOT EXISTS (SELECT 1 FROM formation WHERE titre = 'Communication Interne Efficace');

-- Inscriptions (formation_participant)
INSERT INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id
FROM formation f
JOIN participant p ON p.email IN (
  'a.chaabane@greenbuilding.tn',
  'f.bouaziz@greenbuilding.tn',
  'y.hamdi@greenbuilding.tn',
  'i.nasri@greenbuilding.tn'
)
WHERE f.titre = 'Spring Boot & Microservices'
  AND NOT EXISTS (
    SELECT 1 FROM formation_participant fp
    WHERE fp.formation_id = f.id AND fp.participant_id = p.id
  );

INSERT INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id
FROM formation f
JOIN participant p ON p.email IN (
  'a.saidi@greenbuilding.tn',
  'a.chaabane@greenbuilding.tn',
  't.baccouche@greenbuilding.tn'
)
WHERE f.titre = 'Gestion de Projet Agile'
  AND NOT EXISTS (
    SELECT 1 FROM formation_participant fp
    WHERE fp.formation_id = f.id AND fp.participant_id = p.id
  );

INSERT INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id
FROM formation f
JOIN participant p ON p.email IN (
  'f.bouaziz@greenbuilding.tn',
  'm.khelil@greenbuilding.tn',
  'a.saidi@greenbuilding.tn',
  's.mrad@greenbuilding.tn'
)
WHERE f.titre = 'Anglais Professionnel'
  AND NOT EXISTS (
    SELECT 1 FROM formation_participant fp
    WHERE fp.formation_id = f.id AND fp.participant_id = p.id
  );

INSERT INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id
FROM formation f
JOIN participant p ON p.email IN (
  't.baccouche@greenbuilding.tn',
  'm.zouari@greenbuilding.tn',
  'a.chaabane@greenbuilding.tn'
)
WHERE f.titre = 'Comptabilité Analytique'
  AND NOT EXISTS (
    SELECT 1 FROM formation_participant fp
    WHERE fp.formation_id = f.id AND fp.participant_id = p.id
  );

INSERT INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id
FROM formation f
JOIN participant p ON p.email IN (
  'w.dahmani@greenbuilding.tn',
  't.baccouche@greenbuilding.tn',
  's.mrad@greenbuilding.tn'
)
WHERE f.titre = 'Management de la Qualité ISO 9001'
  AND NOT EXISTS (
    SELECT 1 FROM formation_participant fp
    WHERE fp.formation_id = f.id AND fp.participant_id = p.id
  );

INSERT INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id
FROM formation f
JOIN participant p ON p.email IN (
  'i.nasri@greenbuilding.tn',
  'w.dahmani@greenbuilding.tn',
  'm.zouari@greenbuilding.tn',
  'y.hamdi@greenbuilding.tn'
)
WHERE f.titre = 'Cybersécurité pour Utilisateurs'
  AND NOT EXISTS (
    SELECT 1 FROM formation_participant fp
    WHERE fp.formation_id = f.id AND fp.participant_id = p.id
  );

INSERT INTO formation_participant (formation_id, participant_id)
SELECT f.id, p.id
FROM formation f
JOIN participant p ON p.email IN (
  'm.zouari@greenbuilding.tn',
  's.mrad@greenbuilding.tn',
  'a.saidi@greenbuilding.tn'
)
WHERE f.titre = 'Communication Interne Efficace'
  AND NOT EXISTS (
    SELECT 1 FROM formation_participant fp
    WHERE fp.formation_id = f.id AND fp.participant_id = p.id
  );

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

SELECT r.nom AS role, COUNT(u.id) AS utilisateurs
FROM role r
LEFT JOIN utilisateur u ON u.id_role = r.id
GROUP BY r.nom
ORDER BY r.nom;
