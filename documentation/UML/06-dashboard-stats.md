# Séquence 5 — Consultation du Tableau de Bord Statistique

## Description

Ce diagramme décrit la consultation des statistiques par le Responsable du centre. C'est un accès en **lecture seule**.

### Acteurs
- **Responsable** : responsable du centre avec le rôle `RESPONSABLE`
- **React UI** : tableau de bord avec graphiques
- **StatController** : point d'entrée REST des statistiques
- **StatService** : logique de calcul des agrégations
- **FormationRepository** : requêtes JPQL agrégées
- **MySQL** : base de données relationnelle

### Points clés
- Accès **lecture seule** — le Responsable ne peut pas modifier les données
- Les 3 requêtes statistiques sont exécutées en **parallèle** (`par/and`) pour de meilleures performances
- Les agrégations sont calculées côté **backend** via des requêtes JPQL (`GROUP BY`, `SUM`, `COUNT`)
- Le frontend génère les graphiques à partir du JSON reçu
- Les boutons de modification sont **désactivés** côté React selon le rôle dans le JWT

```mermaid
---
title: Consultation du Tableau de Bord Statistique
---
sequenceDiagram
  participant R as Responsable
  participant F as React UI
  participant C as StatController
  participant S as StatService
  participant Rep as FormationRepository
  participant DB as MySQL

  R->>F: Accède au tableau de bord
  F->>C: GET /api/stats/dashboard (Bearer token)
  C->>C: Vérifie JWT + rôle RESPONSABLE ou ADMIN

  alt Token invalide ou rôle insuffisant
    C-->>F: 403 Forbidden
    F-->>R: Redirection vers login
  else Autorisé en lecture seule
    par Requête 1 - Formations par année
      C->>S: getFormationsParAnnee()
      S->>Rep: countByAnnee()
      Rep->>DB: SELECT annee COUNT(*) FROM formation GROUP BY annee
      DB-->>Rep: liste (annee, count)
      Rep-->>S: résultat agrégé
      S-->>C: statsAnnee
    and Requête 2 - Budget par domaine
      C->>S: getBudgetParDomaine()
      S->>Rep: sumBudgetByDomaine()
      Rep->>DB: SELECT domaine SUM(budget) FROM formation GROUP BY domaine_id
      DB-->>Rep: liste (domaine, totalBudget)
      Rep-->>S: résultat agrégé
      S-->>C: statsBudget
    and Requête 3 - Participants par structure
      C->>S: getParticipantsParStructure()
      S->>Rep: countParticipantsByStructure()
      Rep->>DB: SELECT structure COUNT(*) FROM participant GROUP BY structure_id
      DB-->>Rep: liste (structure, count)
      Rep-->>S: résultat agrégé
      S-->>C: statsStructure
    end
    C->>C: Assemble StatsDashboardDTO
    C-->>F: 200 OK + StatsDashboardDTO (JSON)
    F->>F: Génère graphiques (barres, camembert)
    F-->>R: Affiche tableau de bord complet

    R->>F: Tente une action de modification
    F-->>R: Boutons désactivés - accès lecture seule
  end
```
