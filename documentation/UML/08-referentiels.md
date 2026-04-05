# Séquence 7 — Mise à jour des Référentiels

## Description

Ce diagramme décrit la gestion des référentiels (Domaine, Structure, Profil) par l'Administrateur. Il couvre les 3 opérations CRUD : ajout, modification et suppression.

### Acteurs
- **Administrateur** : utilisateur avec le rôle `ADMIN`
- **React UI** : interface de gestion des référentiels
- **ReferentielController** : point d'entrée REST
- **ReferentielService** : logique métier
- **ReferentielRepository** : accès base de données
- **MySQL** : base de données relationnelle

### Points clés
- Les 3 référentiels (Domaine, Structure, Profil) sont chargés en **parallèle** au démarrage
- L'ajout vérifie les **doublons de libellé** — `409 Conflict` si déjà existant
- La suppression vérifie si le référentiel est **utilisé par une formation** avant de supprimer — protège l'intégrité des données
- La suppression réussie retourne `204 No Content` — pas de body dans la réponse
- Toute modification est **instantanément visible** pour les autres utilisateurs du système

```mermaid
---
title: Mise à jour des Référentiels par l'Administrateur
---
sequenceDiagram
  participant A as Administrateur
  participant F as React UI
  participant C as ReferentielController
  participant S as ReferentielService
  participant R as ReferentielRepository
  participant DB as MySQL

  A->>F: Accède à la gestion des référentiels
  F->>C: GET /api/referentiels (Bearer token)
  C->>C: Vérifie JWT + rôle ADMIN

  alt Token invalide ou rôle insuffisant
    C-->>F: 403 Forbidden
    F-->>A: Redirection vers login
  else Autorisé
    par Chargement des référentiels
      C->>R: findAllDomaines()
      R->>DB: SELECT * FROM domaine
      DB-->>R: liste domaines
    and
      C->>R: findAllStructures()
      R->>DB: SELECT * FROM structure
      DB-->>R: liste structures
    and
      C->>R: findAllProfils()
      R->>DB: SELECT * FROM profil
      DB-->>R: liste profils
    end
    C-->>F: 200 OK + tous les référentiels
    F-->>A: Affiche listes Domaines, Structures, Profils

    alt Ajout d'un référentiel
      A->>F: Saisit libellé du nouveau référentiel
      A->>F: Clique sur "Ajouter"
      F->>C: POST /api/referentiels/{type} (JSON + Bearer token)
      C->>C: @Valid sur ReferentielDTO
      alt Libellé vide ou doublon
        C->>R: findByLibelle(libelle)
        R->>DB: SELECT * FROM domaine WHERE libelle=?
        DB-->>R: entité ou null
        R-->>C: doublon détecté
        C-->>F: 409 Conflict
        F-->>A: Message erreur libellé déjà existant
      else Libellé valide et unique
        C->>S: ajouterReferentiel(type, referentielDTO)
        S->>S: DTO vers Entity
        S->>R: save(referentielEntity)
        R->>DB: INSERT INTO domaine ou structure ou profil
        DB-->>R: ID généré
        R-->>S: entité sauvegardée
        S-->>C: referentielResponseDTO
        C-->>F: 201 Created (JSON)
        F-->>A: Liste mise à jour instantanément
      end

    else Modification d'un référentiel
      A->>F: Modifie le libellé d'un référentiel existant
      A->>F: Clique sur "Modifier"
      F->>C: PUT /api/referentiels/{type}/{id} (JSON + Bearer token)
      C->>S: modifierReferentiel(type, id, referentielDTO)
      S->>R: findById(id)
      R->>DB: SELECT * FROM domaine WHERE id=?
      DB-->>R: entité ou null
      alt Référentiel introuvable
        R-->>S: null
        S-->>C: EntityNotFoundException
        C-->>F: 404 Not Found
        F-->>A: Message erreur référentiel introuvable
      else Trouvé
        R-->>S: referentielEntity
        S->>S: entity.setLibelle(nouveauLibelle)
        S->>R: save(referentielEntity)
        R->>DB: UPDATE domaine SET libelle=? WHERE id=?
        DB-->>R: OK
        R-->>S: entité mise à jour
        S-->>C: referentielResponseDTO
        C-->>F: 200 OK (JSON)
        F-->>A: Liste mise à jour instantanément
      end

    else Suppression d'un référentiel
      A->>F: Clique sur "Supprimer" sur un référentiel
      F->>C: DELETE /api/referentiels/{type}/{id} (Bearer token)
      C->>S: supprimerReferentiel(type, id)
      S->>R: findById(id)
      R->>DB: SELECT * FROM domaine WHERE id=?
      DB-->>R: entité ou null
      alt Référentiel introuvable
        R-->>S: null
        S-->>C: EntityNotFoundException
        C-->>F: 404 Not Found
        F-->>A: Message erreur référentiel introuvable
      else Référentiel utilisé par une formation
        S->>R: isUsedByFormation(id)
        R->>DB: SELECT COUNT(*) FROM formation WHERE domaine_id=?
        DB-->>R: count > 0
        R-->>S: référentiel en cours d'utilisation
        S-->>C: ReferentielInUseException
        C-->>F: 409 Conflict
        F-->>A: Message erreur suppression impossible
      else Suppression possible
        R-->>S: entité libre
        S->>R: deleteById(id)
        R->>DB: DELETE FROM domaine WHERE id=?
        DB-->>R: OK
        R-->>S: suppression confirmée
        S-->>C: succès
        C-->>F: 204 No Content
        F-->>A: Référentiel retiré de la liste
      end
    end
  end
```
