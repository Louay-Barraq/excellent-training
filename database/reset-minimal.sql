-- ============================================================
-- Excellent Training — Réinitialisation minimale de la base
-- Université de Tunis El Manar — ISI 2025/2026
-- ============================================================
-- ATTENTION : ce script supprime toute la base excellent_training.
-- Il recrée ensuite les tables et insère uniquement :
-- - les 3 rôles
-- - 3 utilisateurs : admin, responsable, utilisateur
-- ============================================================

DROP DATABASE IF EXISTS excellent_training;

CREATE DATABASE excellent_training
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE excellent_training;

-- ============================================================
-- SCHÉMA
-- ============================================================

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_role_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE utilisateur (
  id INT NOT NULL AUTO_INCREMENT,
  login VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  id_role INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_utilisateur_login (login),
  KEY idx_utilisateur_role (id_role),
  CONSTRAINT fk_utilisateur_role
    FOREIGN KEY (id_role) REFERENCES role (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE domaine (
  id INT NOT NULL AUTO_INCREMENT,
  libelle VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_domaine_libelle (libelle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE structure (
  id INT NOT NULL AUTO_INCREMENT,
  libelle VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_structure_libelle (libelle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE profil (
  id INT NOT NULL AUTO_INCREMENT,
  libelle VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_profil_libelle (libelle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employeur (
  id INT NOT NULL AUTO_INCREMENT,
  nom_employeur VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE formateur (
  id INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  tel INT,
  type VARCHAR(255) NOT NULL,
  id_employeur INT,
  PRIMARY KEY (id),
  UNIQUE KEY uk_formateur_email (email),
  KEY idx_formateur_employeur (id_employeur),
  CONSTRAINT fk_formateur_employeur
    FOREIGN KEY (id_employeur) REFERENCES employeur (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE participant (
  id INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  tel INT,
  id_structure INT,
  id_profil INT,
  PRIMARY KEY (id),
  UNIQUE KEY uk_participant_email (email),
  KEY idx_participant_structure (id_structure),
  KEY idx_participant_profil (id_profil),
  CONSTRAINT fk_participant_structure
    FOREIGN KEY (id_structure) REFERENCES structure (id),
  CONSTRAINT fk_participant_profil
    FOREIGN KEY (id_profil) REFERENCES profil (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE formation (
  id BIGINT NOT NULL AUTO_INCREMENT,
  titre VARCHAR(255) NOT NULL,
  annee INT NOT NULL,
  duree INT NOT NULL,
  budget DOUBLE NOT NULL,
  id_domaine INT,
  id_formateur INT,
  PRIMARY KEY (id),
  KEY idx_formation_domaine (id_domaine),
  KEY idx_formation_formateur (id_formateur),
  CONSTRAINT fk_formation_domaine
    FOREIGN KEY (id_domaine) REFERENCES domaine (id),
  CONSTRAINT fk_formation_formateur
    FOREIGN KEY (id_formateur) REFERENCES formateur (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE formation_participant (
  formation_id BIGINT NOT NULL,
  participant_id INT NOT NULL,
  PRIMARY KEY (formation_id, participant_id),
  KEY idx_formation_participant_participant (participant_id),
  CONSTRAINT fk_formation_participant_formation
    FOREIGN KEY (formation_id) REFERENCES formation (id),
  CONSTRAINT fk_formation_participant_participant
    FOREIGN KEY (participant_id) REFERENCES participant (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DONNÉES MINIMALES
-- ============================================================

INSERT INTO role (nom) VALUES ('ADMINISTRATEUR');
INSERT INTO role (nom) VALUES ('RESPONSABLE');
INSERT INTO role (nom) VALUES ('UTILISATEUR');

-- Mot de passe des 3 comptes = 'admin123'
-- Hash BCrypt généré via Spring Security BCryptPasswordEncoder
INSERT INTO utilisateur (login, password, id_role)
SELECT 'admin', '$2a$10$$2a$10$fKwf/djiFp0htKUipOzPpeyLHgjdpH8bjTAkIwFweZePa1qvrkxbu', id
FROM role
WHERE nom = 'ADMINISTRATEUR';

INSERT INTO utilisateur (login, password, id_role)
SELECT 'resp', '$2a$10$$2a$10$L1UMBZsX4tQKiAuSQb/zvOh7Qzf0RX5CHpEICuciejJN9DuPuG59S', id
FROM role
WHERE nom = 'RESPONSABLE';

INSERT INTO utilisateur (login, password, id_role)
SELECT 'user', '$2a$10$$2a$10$dlJuCcRafH9QVD66IfC8A.7UhOPxRJc1Uq0GUH/g7iAdrbkbiikzO', id
FROM role
WHERE nom = 'UTILISATEUR';

-- ============================================================
-- VÉRIFICATION
-- ============================================================
SELECT 'Rôles' AS table_name, COUNT(*) AS count FROM role
UNION ALL
SELECT 'Utilisateurs', COUNT(*) FROM utilisateur
UNION ALL
SELECT 'Domaines', COUNT(*) FROM domaine
UNION ALL
SELECT 'Structures', COUNT(*) FROM structure
UNION ALL
SELECT 'Profils', COUNT(*) FROM profil
UNION ALL
SELECT 'Employeurs', COUNT(*) FROM employeur
UNION ALL
SELECT 'Formateurs', COUNT(*) FROM formateur
UNION ALL
SELECT 'Participants', COUNT(*) FROM participant
UNION ALL
SELECT 'Formations', COUNT(*) FROM formation
UNION ALL
SELECT 'Inscriptions', COUNT(*) FROM formation_participant;

SELECT r.nom AS role, u.login
FROM role r
JOIN utilisateur u ON u.id_role = r.id
ORDER BY r.id;
