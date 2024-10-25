const express = require('express');
const mysql = require('mysql2');
const app = express();

// Middleware pour parser les JSON
app.use(express.json());

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connexion à la base de données
db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Route d'exemple
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API todo list');
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


// Route pour obtenir toutes les tâches
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
    });
  });
  
  // Route pour ajouter une nouvelle tâche
  app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }
  
    db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.status(201).json({ id: result.insertId, title, completed: false });
    });
  });
  
  // Route pour marquer une tâche comme complétée
  app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
  
    db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Tâche mise à jour' });
    });
  });
  
  // Route pour supprimer une tâche
  app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
  
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Tâche supprimée' });
    });
  });
  