# Séquence 1 — Authentification & Autorisation

## Description

Ce diagramme décrit le processus de connexion d'un utilisateur au système.

### Acteurs
- **Utilisateur** : tout employé du centre disposant d'un compte
- **React UI** : interface web frontend
- **AuthController** : point d'entrée REST de l'authentification
- **Spring Security** : couche de sécurité gérant l'authentification
- **UserService** : service métier chargeant les détails utilisateur
- **UserRepository** : accès base de données pour les utilisateurs
- **MySQL** : base de données relationnelle

### Points clés
- Le mot de passe est vérifié via **BCrypt** — jamais comparé en clair
- En cas de succès, un **token JWT** est généré et renvoyé au frontend
- Le frontend stocke le JWT et redirige selon le **rôle** de l'utilisateur
- Trois dashboards distincts : `/admin`, `/responsable`, `/utilisateur`

```mermaid
---
title: Authentification & Autorisation
---
sequenceDiagram
  participant U as Utilisateur
  participant F as React UI
  participant SC as AuthController
  participant SS as Spring Security
  participant US as UserService
  participant R as UserRepository
  participant DB as MySQL

  U->>F: Saisit login + password
  U->>F: Clique sur "Se connecter"

  F->>SC: POST /api/auth/login (login, password)

  SC->>SS: authenticate(login, password)
  SS->>US: loadUserByUsername(login)
  US->>R: findByLogin(login)
  R->>DB: SELECT * FROM utilisateur WHERE login=?
  DB-->>R: utilisateur trouvé ou null

  alt Utilisateur introuvable
    R-->>US: null
    US-->>SS: UsernameNotFoundException
    SS-->>SC: BadCredentialsException
    SC-->>F: 401 Unauthorized
    F-->>U: Message erreur login incorrect
  else Utilisateur trouvé
    R-->>US: utilisateurEntity
    US-->>SS: UserDetails (login, password hashé, role)
    SS->>SS: BCrypt.verify(password, hash)

    alt Mot de passe incorrect
      SS-->>SC: BadCredentialsException
      SC-->>F: 401 Unauthorized
      F-->>U: Message erreur mot de passe incorrect
    else Authentification réussie
      SS-->>SC: Authentication OK
      SC->>SC: JWT.generate(login, role, expiry)
      SC-->>F: 200 OK + JWT token + role

      F->>F: Stocke JWT (localStorage)

      alt Role = ADMIN
        F-->>U: Redirige vers /admin/dashboard
      else Role = RESPONSABLE
        F-->>U: Redirige vers /responsable/dashboard
      else Role = UTILISATEUR
        F-->>U: Redirige vers /utilisateur/dashboard
      end
    end
  end
```
