// Importation des modules nécessaires
const express = require('express');
const { Client } = require('pg');
require('dotenv').config(); // Charger les variables d'environnement

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 10000;

// Configuration de la connexion PostgreSQL
const dbClient = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432, // Le port par défaut pour PostgreSQL
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connexion à la base de données
dbClient.connect()
  .then(() => console.log("Connecté à PostgreSQL"))
  .catch((err) => console.error("Erreur de connexion à la base de données:", err));

// Route de test
app.get('/', (req, res) => {
  res.send('API Todo List est en cours d\'exécution');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Exemple de route pour récupérer des données de la base de données
app.get('/todos', async (req, res) => {
  try {
    const result = await dbClient.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des todos:", err);
    res.status(500).send("Erreur serveur");
  }
});

// Fermer la connexion à la base de données lors de l'arrêt du serveur
process.on('SIGINT', () => {
  dbClient.end()
    .then(() => console.log("Déconnexion de PostgreSQL"))
    .catch(err => console.error("Erreur lors de la déconnexion:", err))
    .finally(() => process.exit());
});
