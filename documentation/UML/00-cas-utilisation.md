# Diagramme de Cas d'Utilisation Général — Excellent Training

## Description

Ce diagramme représente l'ensemble des fonctionnalités offertes par le système de gestion de
formation du centre **Excellent Training** (Green Building) et les acteurs qui peuvent les
déclencher.

### Acteurs

| Acteur | Rôle technique | Description |
|---|---|---|
| **Utilisateur** | `ROLE_UTILISATEUR` | Opérations métier : formations, formateurs, participants |
| **Responsable** | `ROLE_RESPONSABLE` | Consultation en lecture seule du tableau de bord |
| **Administrateur** | `ROLE_ADMIN` | Accès cumulatif : toutes les actions + gestion des comptes et référentiels |

### Points clés

- Le cas **S'authentifier** est un prérequis de toutes les autres actions (`<<include>>`).
- L'**Administrateur** hérite de tous les droits de l'**Utilisateur** ; ses cas spécifiques
  sont la **Gestion des comptes** et la **Gestion des référentiels**.
- Le **Responsable** accède uniquement au tableau de bord en **lecture seule** ; les boutons
  de modification sont désactivés côté React selon le rôle porté dans le JWT.
- **Imprimer la liste de présence** est une extension du cas *Consulter une formation*
  (`<<extend>>`).
- **Inscrire un participant** est une extension du cas *Gérer les formations*
  (`<<extend>>`).

```mermaid
flowchart LR
  %% ── Acteurs ──────────────────────────────────────────────────────────────
  U(["👤 Utilisateur"])
  R(["👤 Responsable"])
  A(["👤 Administrateur"])

  %% ── Frontière du système ─────────────────────────────────────────────────
  subgraph SYS ["🖥️  Système — Excellent Training"]
    direction TB

    %% Cas commun
    AUTH(["S'authentifier"])

    %% Cas Utilisateur
    subgraph UC_USER ["Gestion métier"]
      direction TB
      UF(["Gérer les formations"])
      UFA(["Affecter un formateur"])
      UI(["Inscrire un participant"])
      UPrint(["Imprimer liste de présence"])
      UFO(["Gérer les formateurs"])
      UP(["Gérer les participants"])
    end

    %% Cas Responsable
    subgraph UC_RESP ["Pilotage"]
      direction TB
      DASH(["Consulter le tableau de bord"])
      FILT(["Filtrer les statistiques"])
    end

    %% Cas Administrateur
    subgraph UC_ADMIN ["Administration"]
      direction TB
      ACCT(["Gérer les comptes utilisateurs"])
      REF(["Gérer les référentiels"])
    end
  end

  %% ── Relations acteurs → cas d'utilisation ────────────────────────────────
  U --> AUTH
  U --> UF
  U --> UFO
  U --> UP

  R --> AUTH
  R --> DASH

  A --> AUTH
  A --> UF
  A --> UFO
  A --> UP
  A --> ACCT
  A --> REF

  %% ── Relations entre cas d'utilisation ────────────────────────────────────
  UF -- "«extend»" --> UFA
  UF -- "«extend»" --> UI
  UF -- "«extend»" --> UPrint
  DASH -- "«extend»" --> FILT

  AUTH -. "«include»" .-> UF
  AUTH -. "«include»" .-> UFO
  AUTH -. "«include»" .-> UP
  AUTH -. "«include»" .-> DASH
  AUTH -. "«include»" .-> ACCT
  AUTH -. "«include»" .-> REF

  %% ── Styles ───────────────────────────────────────────────────────────────
  classDef actor    fill:#E8F4FD,stroke:#2980B9,stroke-width:2px,color:#1A252F,rx:50
  classDef usecase  fill:#FDFEFE,stroke:#5D6D7E,stroke-width:1.5px,color:#1A252F,rx:20
  classDef auth     fill:#EBF5FB,stroke:#1A5276,stroke-width:2px,color:#1A252F,rx:20
  classDef subgrpU  fill:#EAF4EC,stroke:#27AE60,stroke-width:1.5px
  classDef subgrpR  fill:#FEF9E7,stroke:#F39C12,stroke-width:1.5px
  classDef subgrpA  fill:#FDEDEC,stroke:#E74C3C,stroke-width:1.5px

  class U,R,A actor
  class UF,UFA,UI,UPrint,UFO,UP,DASH,FILT,ACCT,REF usecase
  class AUTH auth
```

## Cas d'utilisation détaillés

| ID | Cas d'utilisation | Acteurs | Type |
|---|---|---|---|
| UC-00 | **S'authentifier** | Tous | Primaire |
| UC-01 | **Gérer les formations** (CRUD, consultation) | Utilisateur, Admin | Primaire |
| UC-02 | **Affecter un formateur** à une formation | Utilisateur, Admin | Extension de UC-01 |
| UC-03 | **Inscrire un participant** à une formation | Utilisateur, Admin | Extension de UC-01 |
| UC-04 | **Imprimer la liste de présence** | Utilisateur, Admin | Extension de UC-01 |
| UC-05 | **Gérer les formateurs** (CRUD) | Utilisateur, Admin | Primaire |
| UC-06 | **Gérer les participants** (CRUD) | Utilisateur, Admin | Primaire |
| UC-07 | **Consulter le tableau de bord** statistique | Responsable, Admin | Primaire |
| UC-08 | **Filtrer les statistiques** (par année / domaine) | Responsable, Admin | Extension de UC-07 |
| UC-09 | **Gérer les comptes utilisateurs** (CRUD) | Admin | Primaire |
| UC-10 | **Gérer les référentiels** (domaines, structures, profils, employeurs) | Admin | Primaire |
