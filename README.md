README — Front (Next.js)
Prérequis

# Docker & Docker Compose

### Configuration

Créez un fichier .env.docker.local (non commité) à la racine du dépôt front :

```js
NEXT_PUBLIC_API_URL=http://localhost:3333
NODE_ENV=production
```

C’est l’URL publique du backend vue par le navigateur.

Lancer avec Docker:
`docker compose build`

Puis:
`docker-compose up`


Front accessible sur http://localhost:3000


Assurez-vous que le backend tourne sur http://localhost:3333


# Lancer en local (hors Docker)

### Configuration

Créez un fichier .env (non commité) à la racine du dépôt front :

```js
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Commandes 

Lancez tout d'abord : `npm install` pour installer les dépendances

Puis : `npm run dev` pour démarrer le front

Avant un commit et un push sur git, il est fortement conseillé d'utiliser les commandes : `npm run lint:fix` puis `npm run format` qui executera le check du linter et le reformatage avec prettier selon les règles respectives de prettier et eslint.

Vous pouvez executer les tests en utilisant les commandes : `npm run test` pour les tests unitaires