# Séquence 3 — Affectation d'un Formateur à une Formation

## Description

Ce diagramme décrit le processus d'affectation d'un formateur (interne ou externe) à une formation existante.

### Acteurs
- **Utilisateur** : employé du centre avec le rôle `UTILISATEUR`
- **React UI** : interface de sélection du formateur
- **FormationController** : point d'entrée REST
- **FormationService** : logique métier
- **FormateurRepository** : accès base de données formateurs
- **FormationRepository** : accès base de données formations
- **MySQL** : base de données relationnelle

### Points clés
- L'utilisateur sélectionne d'abord une **formation existante**
- La liste des formateurs affiche les **internes et externes** ensemble
- L'opération utilise `PUT` car c'est une **mise à jour** d'une ressource existante
- Deux vérifications `404` : formation introuvable ET formateur introuvable
- La relation `Formation → Formateur` est **Many-to-One** — un seul formateur par formation

```mermaid
---
title: Affectation d'un Formateur à une Formation
---
sequenceDiagram
  participant U as Utilisateur
  participant F as React UI
  participant C as FormationController
  participant S as FormationService
  participant RF as FormateurRepository
  participant R as FormationRepository
  participant DB as MySQL

  U->>F: Ouvre la liste des formations
  F->>C: GET /api/formations (Bearer token)
  C-->>F: 200 OK + liste formations
  F-->>U: Affiche la liste

  U->>F: Sélectionne une formation
  F->>C: GET /api/formateurs (Bearer token)
  C->>RF: findAll()
  RF->>DB: SELECT * FROM formateur
  DB-->>RF: liste formateurs
  RF-->>C: liste formateurs (internes + externes)
  C-->>F: 200 OK + liste formateurs
  F-->>U: Affiche dropdown formateurs

  U->>F: Choisit un formateur dans la liste
  U->>F: Clique sur "Affecter"

  F->>C: PUT /api/formations/{id}/formateur/{formateurId} (Bearer token)
  C->>C: Vérifie JWT + rôle UTILISATEUR

  alt Token invalide ou rôle insuffisant
    C-->>F: 403 Forbidden
    F-->>U: Redirection vers login
  else Autorisé
    C->>S: affecterFormateur(formationId, formateurId)
    S->>R: findById(formationId)
    R->>DB: SELECT * FROM formation WHERE id=?
    DB-->>R: formationEntity ou null

    alt Formation introuvable
      R-->>S: null
      S-->>C: EntityNotFoundException
      C-->>F: 404 Not Found
      F-->>U: Message erreur formation introuvable
    else Formation trouvée
      R-->>S: formationEntity
      S->>RF: findById(formateurId)
      RF->>DB: SELECT * FROM formateur WHERE id=?
      DB-->>RF: formateurEntity ou null

      alt Formateur introuvable
        RF-->>S: null
        S-->>C: EntityNotFoundException
        C-->>F: 404 Not Found
        F-->>U: Message erreur formateur introuvable
      else Formateur trouvé
        RF-->>S: formateurEntity
        S->>S: formation.setFormateur(formateur)
        S->>R: save(formationEntity)
        R->>DB: UPDATE formation SET formateur_id=?
        DB-->>R: OK
        R-->>S: formationEntity mise à jour
        S-->>C: formationResponseDTO
        C-->>F: 200 OK (JSON)
        F-->>U: Message succès affectation
      end
    end
  end
```
