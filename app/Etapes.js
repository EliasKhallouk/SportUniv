import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

export default function EtapesPage() {
  const route = useRoute();
  const { etapes, niveau } = route.params.session;
  const [steps, setSteps] = useState(etapes);

  // Function to toggle the state of the step and update in the backend
  const toggleStepState = async (index) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      const step = { ...updatedSteps[index] }; // Create a new object
      step.etat = !step.etat; // Toggle the state
      updatedSteps[index] = step; // Update the step in the array

      // Update the state in the database
      fetch(`http://192.168.2.54:3000/updateStep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: route.params.session._id,
          stepName: step.nom,
          etat: step.etat,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            Alert.alert('Erreur', 'La mise à jour a échoué.');
          } else {
            // Update the statistics
            updateStatistics(step.etat);
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour:', error);
          Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
        });

      return updatedSteps;
    });
  };

  const updateStatistics = async (etat) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    try {
      const response = await fetch('http://192.168.2.54:3000/updateStatistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          level: niveau,
          increment: etat ? 1 : -1,
        }),
      });

      if (!response.ok) {
        Alert.alert('Erreur', 'La mise à jour des statistiques a échoué.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Étapes de la Séance</Text>
      <FlatList
        data={steps}
        keyExtractor={(item) => item.nom}
        renderItem={({ item, index }) => (
          <View style={styles.stepContainer}>
            <Text style={styles.stepName}>{item.nom}</Text>
            <Image source={{ uri: item.photo }} style={styles.stepImage} />
            <View style={styles.stepDetailsContainer}>
              <Text style={styles.stepDetail}>Séries: {item.series}</Text>
              <Text style={styles.stepDetail}>Répétitions: {item.repetitions}</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, item.etat ? styles.completed : styles.notCompleted]}
              onPress={() => toggleStepState(index)}
            >
              <Text style={styles.buttonText}>
                {item.etat ? 'Marquer comme non fait' : 'Marquer comme fait'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  stepName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stepImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  stepDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  stepDetail: {
    fontSize: 15,
    color: '#333',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  completed: {
    backgroundColor: '#5b7411',
  },
  notCompleted: {
    backgroundColor: '#8C1818',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
