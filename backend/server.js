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
}, { versionKey: false});

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

const seanceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  temps: { type: Number, required: true },
  cible: { type: String, required: true },
  niveau: { type: String, required: true },
  creePar: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  etapes: [
    {
      nom: String,
      series: Number,
      repetitions: Number,
      photo: String,
      etat: { type: Boolean, default: false }, // Etat par défaut à false
    }
  ]
});

// Enregistrement du modèle
const seances = mongoose.model('seances', seanceSchema);

// Route pour récupérer toutes les séances
app.get('/getSessions', async (req, res) => {
  try {
    const sessions = await seances.find().populate('creePar', 'prenom');
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des séances' });
  }
});

// Route pour mettre à jour l'état d'une étape spécifique
app.post('/updateStep', async (req, res) => {
  const { sessionId, stepName, etat } = req.body;
  
  try {
    // Met à jour l'état de l'étape dans la séance spécifique
    const session = await seances.findOne({ _id: sessionId });
    
    if (!session) {
      return res.status(404).json({ message: 'Séance introuvable' });
    }

    const step = session.etapes.find(e => e.nom === stepName);
    if (!step) {
      return res.status(404).json({ message: 'Étape introuvable' });
    }

    // Modifier l'état de l'étape
    step.etat = etat;
    await session.save();

    res.status(200).json({ message: 'État de l\'étape mis à jour avec succès', session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état de l\'étape' });
  }
});

// Route pour récupérer les statistiques
app.get('/getStatistiques', async (req, res) => {
  try {
    const statistique = await statistiques.find();
    res.status(200).json(statistique);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
