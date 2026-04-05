# Séquence 6 — Création d'un Compte Utilisateur

## Description

Ce diagramme décrit la création d'un compte utilisateur pour un employé du centre par l'Administrateur. Il n'existe pas d'inscription publique dans ce système.

### Acteurs
- **Administrateur** : utilisateur avec le rôle `ADMIN`
- **React UI** : formulaire de création de compte
- **UtilisateurController** : point d'entrée REST
- **UtilisateurService** : logique métier avec hashage du mot de passe
- **RoleRepository** : accès base de données des rôles
- **UtilisateurRepository** : accès base de données des utilisateurs
- **MySQL** : base de données relationnelle

### Points clés
- Seul l'**Administrateur** peut créer des comptes — pas d'inscription publique
- Le login est vérifié pour éviter les **doublons** — `409 Conflict` si déjà existant
- Le mot de passe est **hashé via BCrypt** avant la sauvegarde — jamais stocké en clair
- Le rôle est chargé depuis la base et attaché à l'entité avant le `save()`
- La réponse ne contient jamais le mot de passe — uniquement un `UtilisateurResponseDTO`

```mermaid
---
title: Création d'un Compte Utilisateur par l'Administrateur
---
sequenceDiagram
  participant A as Administrateur
  participant F as React UI
  participant C as UtilisateurController
  participant S as UtilisateurService
  participant RR as RoleRepository
  participant RU as UtilisateurRepository
  participant DB as MySQL

  A->>F: Accède à la gestion des utilisateurs
  F->>C: GET /api/roles (Bearer token)
  C->>C: Vérifie JWT + rôle ADMIN

  alt Token invalide ou rôle insuffisant
    C-->>F: 403 Forbidden
    F-->>A: Redirection vers login
  else Autorisé
    C->>RR: findAll()
    RR->>DB: SELECT * FROM role
    DB-->>RR: liste des rôles
    RR-->>C: liste rôles
    C-->>F: 200 OK + liste rôles
    F-->>A: Affiche formulaire création compte

    A->>F: Saisit login, password, rôle
    A->>F: Clique sur "Créer le compte"

    alt Validation client échoue
      F-->>A: Erreurs inline (champs requis)
    else Validation client OK
      F->>C: POST /api/utilisateurs (JSON + Bearer token)
      C->>C: @Valid sur UtilisateurDTO
      alt Données invalides
        C-->>F: 400 Bad Request + détails erreurs
        F-->>A: Messages d'erreur par champ
      else Données valides
        C->>S: creerUtilisateur(utilisateurDTO)
        S->>RU: findByLogin(login)
        RU->>DB: SELECT * FROM utilisateur WHERE login=?
        DB-->>RU: utilisateur ou null
        alt Login déjà existant
          RU-->>S: utilisateurEntity existant
          S-->>C: LoginAlreadyExistsException
          C-->>F: 409 Conflict
          F-->>A: Message erreur login déjà utilisé
        else Login disponible
          RU-->>S: null
          S->>RR: findById(roleId)
          RR->>DB: SELECT * FROM role WHERE id=?
          DB-->>RR: roleEntity
          RR-->>S: roleEntity
          S->>S: BCrypt.hash(password)
          S->>S: DTO vers UtilisateurEntity
          S->>S: entity.setRole(roleEntity)
          S->>RU: save(utilisateurEntity)
          RU->>DB: INSERT INTO utilisateur
          DB-->>RU: ID généré (int)
          RU-->>S: utilisateurEntity sauvegardé
          S->>S: Entity vers UtilisateurResponseDTO
          S-->>C: utilisateurResponseDTO
          C-->>F: 201 Created (JSON)
          F-->>A: Message succès + compte créé affiché
        end
      end
    end
  end
```
