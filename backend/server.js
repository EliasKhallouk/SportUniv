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

  

  app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
  });