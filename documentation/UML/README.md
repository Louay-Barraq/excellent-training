# UML — Excellent Training

Diagrammes de conception du système de gestion de formation du centre Excellent Training (Green Building).

## Année Universitaire 2025/2026 — ISI

---

## Table des matières

| # | Fichier | Type | Description |
|---|---|---|---|
| 0 | [00-cas-utilisation.md](./00-cas-utilisation.md) | Cas d'utilisation | Vue générale — tous les acteurs et cas d'utilisation |
| 1 | [01-classe.md](./01-classe.md) | Diagramme de classes | Toutes les entités et leurs relations |
| 2 | [02-auth.md](./02-auth.md) | Séquence | Authentification & Autorisation (JWT) |
| 3 | [03-creation-formation.md](./03-creation-formation.md) | Séquence | Création d'une Formation |
| 4 | [04-affectation-formateur.md](./04-affectation-formateur.md) | Séquence | Affectation d'un Formateur à une Formation |
| 5 | [05-inscription-participant.md](./05-inscription-participant.md) | Séquence | Inscription d'un Participant (Many-to-Many) |
| 6 | [06-dashboard-stats.md](./06-dashboard-stats.md) | Séquence | Tableau de Bord Statistique (Responsable) |
| 7 | [07-creation-compte.md](./07-creation-compte.md) | Séquence | Création d'un Compte Utilisateur (Admin) |
| 8 | [08-referentiels.md](./08-referentiels.md) | Séquence | Mise à jour des Référentiels (Admin) |

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Spring Boot 4.0.5 + Java 25 |
| Sécurité | Spring Security + JWT (Stateless) |
| ORM | Hibernate via Spring Data JPA |
| Base de données | MySQL 9.6 |
| Architecture | RESTful API |

---

## Acteurs du système

| Rôle | Permissions |
|---|---|
| `UTILISATEUR` | CRUD formations, formateurs, participants |
| `RESPONSABLE` | Lecture seule — tableau de bord statistique |
| `ADMINISTRATEUR` | Tout + gestion comptes + référentiels |
