
# REPONSES – Partie 1

## 1. Commande httpie correspondant à la commande curl pour la route POST
http POST http://localhost:8080/api-v1/ url="https://perdu.com"


## 2. Démarrage de l’application et différences entre les modes
- **npm run dev** : mode développement avec nodemon, redémarrage automatique à chaque modification, plus de logs.
- **npm run prod** : mode production avec node, stable, sans redémarrage automatique, moins de logs.

## 3. Script npm pour formater tous les fichiers .mjs

"format": "prettier --write \"**/*.mjs\""

## 4. Supprimer l’en-tête X-Powered-By dans Express
app.disable("x-powered-by");

## 5. Middleware pour ajouter X-API-Version
app.use((req, res, next) => {
  res.setHeader("X-API-Version", "1.0.0");
  next();
});

## 6. Middleware pour favicon.ico

import favicon from "serve-favicon";
import path from "path";

app.use(favicon(path.join(__dirname, "static", "logo_univ_16.png")));

## 7. Liens vers la documentation du driver SQLite
https://www.npmjs.com/package/sqlite3

https://github.com/TryGhost/node-sqlite3/wiki

## 8. Moment d’ouverture et de fermeture de la connexion à la base de données
Ouverture : au lancement du serveur (sqlite3.Database() lors de l’initialisation).

Fermeture : lors de l’arrêt du serveur (db.close()).

## 9. Gestion du cache par Express
Première visite : chargement depuis le serveur.

Deuxième visite : certaines ressources mises en cache par le navigateur.

Ctrl+Shift+R : force le rechargement complet depuis le serveur.


## 10. Deux instances sur ports 8080 et 8081
Les deux instances partagent la même base SQLite définie dans .env.

Les liens créés sur l’une sont visibles sur l’autre.
