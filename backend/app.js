const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 3000;

app.use(express.json());

const uri = 'mongodb://localhost:27017';  // Adresse MongoDB locale
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

connectToDatabase();
