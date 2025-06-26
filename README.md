# 📊 Projet BDD Multi-Plateforme

Ce projet met en œuvre une architecture microservices conteneurisée pour la gestion, l’analyse et la visualisation de données, avec une interface web (Angular) et une application de bureau (Electron). Il a été réalisé dans le cadre d’un cours d’architecture N-Tiers et de bases de données.

---

## 🏗️ Architecture et fonctionnement

### Vue d’ensemble

L’architecture repose sur une séparation claire des responsabilités :

- **Frontend** (Angular) : Interface web moderne, accessible via navigateur ou packagée en application desktop via Electron.
- **API Gateway** (Nginx) : Point d’entrée unique, redirige les requêtes vers les microservices.
- **Microservices Backend** :
  - **Authentification** (Node.js/TypeScript) → sa propre base MongoDB
  - **Utilisateurs** (Node.js/TypeScript) → sa propre base MongoDB
  - **Rôles** (Node.js/TypeScript) → sa propre base MongoDB
  - **OLTP API** (Node.js/TypeScript) → PostgreSQL
  - **OLAP API** (Python/Flask) → Clickhouse

### Schéma de l’architecture

```
+---------------------+                                                                         +---------------------+
|       Frontend      |                                                                         |       Frontend      |
|        Léger        |                                                                         |        Lourd        |
|      (Angular)      |                                                                         |      (Electron)     |
+---------------------+                                                                         +---------------------+
           |                                                                                               |
           |                                                                                               |
      +---------------+-------------------------------+---------------+-----------------------------------------------+
                                                             |
                                                             v
                                                  +---------------------+
                                                  |     API Gateway     |
                                                  |       (Nginx)       |
                                                  +---------------------+
                                                             |
      +---------------+-------------------------------+---------------+-----------------------------------------------+
      |                     |                  |                      |                               |
      v                     v                  v                      v                               v
+----------------+ +----------------+ +----------------+    +---------------------+        +---------------------+
| Auth Service   | | User Service   | | Role Service   |    |     OLTP API        |        |     OLAP API        |
| (Node/TS)      | | (Node/TS)      | | (Node/TS)      |    |    (Node/TS)        |        |   (Python/Flask)    |
+----------------+ +----------------+ +----------------+    +---------------------+        +---------------------+
        |                  |                  |                       |                               |
        v                  v                  v                       v                               v
  +-----------+       +-----------+      +-----------+         +-------------+                +-----------------+
  | MongoDB   |       | MongoDB   |      | MongoDB   |         | PostgreSQL  |                |   Clickhouse    |
  | (auth DB) |       | (user DB) |      | (role DB) |         |   (OLTP)    |                |     (OLAP)      |
  +-----------+       +-----------+      +-----------+         +-------------+                +-----------------+
```

---

## 🎯 Choix des technologies

- **Angular** : Frontend web moderne et réactif.
- **Electron** : Emballe le frontend Angular en application desktop multiplateforme.
- **Node.js + TypeScript** : Microservices Auth, Users, Roles, OLTP.
- **Python (Flask)** : Microservice OLAP pour l’analytique.
- **MongoDB** : Base NoSQL, chaque microservice Auth, Users, Roles a sa propre base MongoDB.
- **PostgreSQL** : Base relationnelle pour l’OLTP.
- **Clickhouse** : Base analytique pour l’OLAP.
- **Nginx** : API Gateway, centralise et sécurise les accès.
- **Docker & Docker Compose** : Orchestration et portabilité.

---

## 🗂️ Organisation du code

```
Projet-BDD-Multi-Plateforme/
│
├── backend/
│   ├── api_oltp/           # Microservice OLTP (Node.js/TypeScript, PostgreSQL)
│   ├── api_olap/           # Microservice OLAP (Python/Flask, ClickHouse)
│   ├── authentification/   # Microservice Authentification (Node.js/TypeScript, MongoDB)
│   ├── roles/              # Microservice Rôles (Node.js/TypeScript, MongoDB)
│   └── users/              # Microservice Utilisateurs (Node.js/TypeScript, MongoDB)
│
├── frontend/               # Application Angular (interface web)
│
├── electron_app/           # Application Electron (packaging desktop)
│   ├── main.js
│   ├── package.json
│   ├── Projet_BDD.bat
│   ├── start.vbs
│   └── images/
│
└── environnement/
    ├── docker-compose.yml  # Orchestration Docker
    └── conf.d/             # Config Nginx
```

---

## 🚀 Démarrage rapide

### Prérequis

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- (Optionnel pour Electron) [Node.js](https://nodejs.org/) installé localement

### Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/NoahBELLO/Projet-BDD.git
   cd Projet-BDD
   ```

2. **Configurer les variables d’environnement :**

   - Copier les fichiers `.env.exemple` en `.env` dans le dossier `environnement/` et adapter les valeurs.

3. **Lancer l’infrastructure Docker :**

   ```bash
   make up
   ```

   ou

   ```bash
   docker-compose -f environnement/docker-compose.yml up --build
   ```

4. **Accéder à l’application :**
   - **Frontend Angular** : [http://localhost:4200](http://localhost:4200)
   - **API Gateway (Nginx)** : [http://localhost:3001](http://localhost:3001)
   - **Electron** : Voir ci-dessous

### Lancer l’application Electron

1. Aller dans le dossier `electron_app` :
   ```bash
   cd electron_app
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer l’application :
   ```bash
   npm start
   ```
   > ⚠️ Le serveur Angular (port 4200) doit être démarré via Docker pour que l’application Electron fonctionne.

---

## 🧪 Tests

- **Frontend :**
  - Tests unitaires :
    ```bash
    cd frontend
    ng test
    ```
  - Tests end-to-end :
    ```bash
    ng e2e
    ```
- **Backend :**
  - Les tests sont propres à chaque microservice (voir dossiers respectifs).

---

## 🔧 Commandes utiles (Makefile)

- `make up` : Démarrer tous les services Docker
- `make down` : Arrêter tous les services
- `make logs` : Afficher les logs
- `make ps` : Voir les conteneurs actifs
- `make restart` : Redémarrer les services
- `make clean` : Nettoyer les volumes et images inutiles

---

## 👥 Auteurs

- Noah BELLO (Auteur principal)
- Florian Potier-Clemente (Collaborateur)

---

Pour plus de détails, consulte les README spécifiques dans chaque
