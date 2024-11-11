const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Remplace 'mongodb://localhost:27017/ton_database' avec ton URI MongoDB Compass
mongoose.connect('mongodb://localhost:27017/SportUniv', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

// Définir le modèle de données pour ton formulaire
const FormSchema = new mongoose.Schema({
  prenom: String,
  age: Number,
  sexe: String,
  poid: Number,
  universite: String,
});

const users = mongoose.model('users', FormSchema);

app.post('/saveFormData', async (req, res) => {
    const { prenom, age, sexe, poid, universite } = req.body;
  
    try {
      // Utilise directement Mongoose pour insérer les données dans la collection
      const result = await users.create({ prenom, age, sexe, poid, universite });
      res.status(200).send({ message: 'Données enregistrées avec succès', data: result });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Erreur lors de l\'enregistrement des données' });
    }
});

const seanceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    temps: { type: Number, required: true }, // Entier pour le temps
    cible: { type: String, required: true },
    niveau: { type: String, required: true },
  });
  
  // Enregistrement du modèle
  const seances = mongoose.model('seances', seanceSchema);
// Route pour récupérer toutes les séances
app.get('/getSessions', async (req, res) => {
    try {
      const sessions = await seances.find(); // Remplace 'Seance' par le nom de ton modèle
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des séances' });
    }
  });
  


app.listen(PORT, () => {
console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});