# Séquence 4 — Inscription d'un Participant à une Formation

## Description

Ce diagramme décrit le processus d'inscription d'un ou plusieurs participants à une formation existante.

### Acteurs
- **Utilisateur** : employé du centre avec le rôle `UTILISATEUR`
- **React UI** : interface de sélection des participants
- **InscriptionController** : point d'entrée REST
- **InscriptionService** : logique métier avec gestion des doublons
- **FormationRepository** : accès base de données formations
- **ParticipantRepository** : accès base de données participants
- **MySQL** : base de données relationnelle

### Points clés
- Relation **Many-to-Many** entre `Formation` et `Participant` via la table `formation_participant`
- L'utilisateur peut inscrire **plusieurs participants** en une seule opération
- Le service vérifie les **doublons** — un participant déjà inscrit est ignoré silencieusement
- Le `loop` montre le traitement itératif de chaque participant sélectionné
- Un seul `save()` final déclenche tous les `INSERT` dans la table de jointure

```mermaid
---
title: Inscription d'un Participant à une Formation
---
sequenceDiagram
  participant U as Utilisateur
  participant F as React UI
  participant C as InscriptionController
  participant S as InscriptionService
  participant RF as FormationRepository
  participant RP as ParticipantRepository
  participant DB as MySQL

  U->>F: Ouvre la liste des formations
  F->>C: GET /api/formations (Bearer token)
  C-->>F: 200 OK + liste formations
  F-->>U: Affiche la liste

  U->>F: Sélectionne une formation
  F->>C: GET /api/participants (Bearer token)
  C->>RP: findAll()
  RP->>DB: SELECT * FROM participant
  DB-->>RP: liste participants
  RP-->>C: liste participants (nom, prénom, structure, profil)
  C-->>F: 200 OK + liste participants
  F-->>U: Affiche liste participants à cocher

  U->>F: Coche un ou plusieurs participants
  U->>F: Clique sur "Inscrire"

  F->>C: POST /api/formations/{id}/participants (Bearer token + liste ids)
  C->>C: Vérifie JWT + rôle UTILISATEUR

  alt Token invalide ou rôle insuffisant
    C-->>F: 403 Forbidden
    F-->>U: Redirection vers login
  else Autorisé
    C->>S: inscrireParticipants(formationId, participantIds)
    S->>RF: findById(formationId)
    RF->>DB: SELECT * FROM formation WHERE id=?
    DB-->>RF: formationEntity ou null

    alt Formation introuvable
      RF-->>S: null
      S-->>C: EntityNotFoundException
      C-->>F: 404 Not Found
      F-->>U: Message erreur formation introuvable
    else Formation trouvée
      RF-->>S: formationEntity
      loop Pour chaque participantId
        S->>RP: findById(participantId)
        RP->>DB: SELECT * FROM participant WHERE id=?
        DB-->>RP: participantEntity
        RP-->>S: participantEntity
        S->>S: Vérifie si déjà inscrit
        alt Déjà inscrit
          S->>S: Ignore le doublon
        else Pas encore inscrit
          S->>S: formation.addParticipant(participant)
        end
      end
      S->>RF: save(formationEntity)
      RF->>DB: INSERT INTO formation_participant (formation_id, participant_id)
      DB-->>RF: OK
      RF-->>S: formationEntity mise à jour
      S-->>C: nombre de participants inscrits
      C-->>F: 200 OK + résumé inscription
      F-->>U: Message succès + liste participants inscrits
    end
  end
```
