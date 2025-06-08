# 📊 Projet BDD

Ce projet a été réalisé dans le cadre d’un cours de bases de données (BDD).  
Il illustre l’intégration de plusieurs technologies modernes dans une architecture microservices conteneurisée via Docker.

## 🧩 Technologies utilisées

- **Frontend** : Angular
- **Backend** : Python & TypeScript
- **Bases de données** : PostgreSQL (OLTP) & Clickhouse (OLAP)
- **Infrastructure** : Docker & Docker Compose
- **API Gateway** : Nginx

## 🚀 Fonctionnalités

- ✅ Connexion à une BDD OLTP via PostgreSQL
- ✅ Connexion à une BDD OLAP via Clickhouse
- ⏳ Amélioration des requêtes pour voir la possibilité de mettre une liste d'item_id

## ⚙️ Installation

### Prérequis

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Configuration des .env

### Étapes

1. Cloner le dépôt :

```bash
git clone https://github.com/NoahBELLO/Projet-BDD.git
cd Projet-BDD/environnement
docker-compose up --build

🐳 Aperçu des services Docker
Service    | Description                | Port(s)
-------------------------------------------------------
postgresql | BDD relationnelle OLTP       | 5432
clickhouse | BDD analytique OLAP          | 8123, 9000
api_oltp   | API Flask pour PostgreSQL    | 3002
api_olap   | API Flask pour Clickhouse    | 3000 → 5000
nginx      | API Gateway                  | 3001
frontend   | Application Angular          | 4200

🔧 Architecture du projet
Frontend (Angular)
        |
      NGINX
     /     \
API_OLTP  API_OLAP
   |         |
PostgreSQL  Clickhouse

📁 Structure du projet (extrait)
Projet-BDD/
│
├── backend/
│   ├── apiPostgreSql/
│   ├── api_olap/
│
├── frontend/
├── environnement/
│   ├── docker-compose.yml 
│   ├── conf.d/ (config NGINX)

🙋‍♂️ Auteur et Collaborateur
    - Noah BELLO (Auteur)
    - Florian Potier-Clemente ou Lifdas(Collaborateur)
