# Diagramme de Classes — Excellent Training

## Description

Ce diagramme représente l'ensemble des entités du système de gestion de formation du centre Excellent Training (Green Building) et leurs relations.

### Entités principales
- **Formation** : session de formation avec titre, année, durée et budget
- **Participant** : employé inscrit à une ou plusieurs formations
- **Formateur** : animateur de formation (interne ou externe)

### Référentiels
- **Domaine** : catégorie de la formation (Informatique, Finance, etc.)
- **Structure** : direction du participant (Centrale ou Régionale)
- **Profil** : poste du participant (Cadre, Technicien, etc.)
- **Role** : droit d'accès de l'utilisateur (Admin, Responsable, Utilisateur)
- **Employeur** : société du formateur externe

### Relations clés
- `Formation ↔ Participant` : Many-to-Many via table de jointure `inscription`
- `Formation → Formateur` : Many-to-One
- `Formation → Domaine` : Many-to-One
- `Formateur → Employeur` : Many-to-One (optionnel, uniquement pour les formateurs externes)

```mermaid
classDiagram
  direction TB

  class Role {
    +int id
    +String nom
  }

  class Utilisateur {
    +int id
    +String login
    +String password
    +Role role
  }

  class Domaine {
    +int id
    +String libelle
  }

  class Structure {
    +int id
    +String libelle
  }

  class Profil {
    +int id
    +String libelle
  }

  class Employeur {
    +int id
    +String nomEmployeur
  }

  class Formateur {
    +int id
    +String nom
    +String prenom
    +String email
    +int tel
    +String type
    +Employeur employeur
  }

  class Formation {
    +long id
    +String titre
    +int annee
    +int duree
    +double budget
    +Domaine domaine
    +Formateur formateur
  }

  class Participant {
    +int id
    +String nom
    +String prenom
    +String email
    +int tel
    +Structure structure
    +Profil profil
  }

  Utilisateur "0..*" --> "1" Role : possède
  Formateur "0..*" --> "0..1" Employeur : appartient à
  Formation "0..*" --> "1" Domaine : appartient à
  Formation "0..*" --> "1" Formateur : animée par
  Participant "0..*" --> "1" Structure : rattaché à
  Participant "0..*" --> "1" Profil : possède
  Formation "0..*" <--> "0..*" Participant : inscription
```
