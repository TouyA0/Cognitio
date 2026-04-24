# Cognitio

Gestionnaire de découvertes théologiques avec graphe interactif.

## Setup

### Prérequis
- Docker & Docker Compose
- Node.js 18+
- Git

### Lancer le projet

```bash
# Crée un fichier .env depuis .env.example
cp .env.example .env

# Ajoute ta clé API Anthropic dans .env
# ANTHROPIC_API_KEY=sk-...

# Lance les containers
docker-compose up -d

# Accède à:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# DB: localhost:5432
```

### Stop

```bash
docker-compose down
```

## Structure

- `frontend/` - React app
- `backend/` - Express API
- `database/` - PostgreSQL setup