const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/SportUniv', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
db.once('open', () => {
  console.log('Connexion à la base de données réussie');
});

const FormSchema = new mongoose.Schema({
  prenom: String,
  age: Number,
  sexe: String,
  poid: Number,
  universite: String,
});

const StatistiqueSchema = new mongoose.Schema({
  date: { type: String, required: true },
  tasksCompleted: { type: Number, required: true },
  level: { type: String, required: true },
});

const users = mongoose.model('users', FormSchema);
const statistiques = mongoose.model('statistiques', StatistiqueSchema);

app.post('/saveFormData', async (req, res) => {
  const { prenom, age, sexe, poid, universite } = req.body;

  const newUser = new users({
    prenom,
    age,
    sexe,
    poid,
    universite,
  });

  try {
    await newUser.save();
    res.status(200).json({ message: 'Données sauvegardées avec succès' });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données:', error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde des données' });
  }
});

app.post('/updateStatistics', async (req, res) => {
  const { date, level, increment } = req.body;

  try {
    let stat = await statistiques.findOne({ date, level });

    if (stat) {
      stat.tasksCompleted += increment;
    } else {
      stat = new statistiques({ date, tasksCompleted: increment, level });
    }

    await stat.save();
    res.status(200).json({ message: 'Statistiques mises à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour des statistiques' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
