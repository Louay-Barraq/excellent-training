# Séquence 2 — Création d'une Formation

## Description

Ce diagramme décrit le processus de création d'une nouvelle session de formation par un Simple Utilisateur.

### Acteurs
- **Utilisateur** : employé du centre avec le rôle `UTILISATEUR`
- **React UI** : formulaire de création de formation
- **FormationController** : point d'entrée REST
- **FormationService** : logique métier et conversion DTO ↔ Entity
- **FormationRepository** : accès base de données
- **MySQL** : base de données relationnelle

### Points clés
- Le formulaire charge d'abord la liste des **domaines** disponibles depuis l'API
- La validation se fait en **deux étapes** : côté client (React) puis côté serveur (`@Valid`)
- Le **Bearer token JWT** est obligatoire — seul le rôle `UTILISATEUR` ou `ADMIN` est autorisé
- Le service effectue la conversion **DTO → Entity** avant la sauvegarde
- La réponse retourne un **DTO** (jamais l'entité directement)

```mermaid
---
title: Création d'une Formation
---
sequenceDiagram
  participant U as Utilisateur
  participant F as React UI
  participant C as FormationController
  participant S as FormationService
  participant R as FormationRepository
  participant DB as MySQL

  U->>F: Ouvre le formulaire de création
  F->>C: GET /api/domaines (Bearer token)
  C-->>F: 200 OK + liste des domaines
  F-->>U: Affiche le formulaire avec domaines

  U->>F: Remplit titre, année, durée, budget, domaine
  U->>F: Clique sur "Enregistrer"

  alt Validation client échoue
    F-->>U: Erreurs inline (champs requis)
  else Validation client OK
    F->>C: POST /api/formations (JSON + Bearer token)
    C->>C: Vérifie JWT + rôle UTILISATEUR
    alt Token invalide ou rôle insuffisant
      C-->>F: 403 Forbidden
      F-->>U: Redirection vers login
    else Autorisé
      C->>C: @Valid sur FormationDTO
      alt Données invalides
        C-->>F: 400 Bad Request + détails erreurs
        F-->>U: Messages d'erreur par champ
      else Données valides
        C->>S: createFormation(formationDTO)
        S->>S: DTO vers FormationEntity
        S->>R: save(formationEntity)
        R->>DB: INSERT INTO formation
        DB-->>R: ID généré (long)
        R-->>S: formationEntity sauvegardée
        S->>S: Entity vers FormationResponseDTO
        S-->>C: formationResponseDTO
        C-->>F: 201 Created (JSON)
        F-->>U: Message succès + redirection liste
      end
    end
  end
```
