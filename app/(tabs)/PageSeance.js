import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function SeancesList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Add navigation hook

  useEffect(() => {
    // Fonction pour récupérer les séances depuis l'API
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://192.168.2.54:3000/getSessions'); // Adresse de ton serveur
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Erreur de récupération des séances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Si les données sont en cours de chargement
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#0000ff" />
      </View>
    );
  }

  // Si aucune séance n'est disponible
  if (sessions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune séance disponible.</Text>
      </View>
    );
  }

  // Affichage des séances
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Séances</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Etapes', { session: item })}
            style={styles.sessionContainer}
          >
            <Text style={styles.sessionTextTitle}>
              {item.nom} par {item.creePar.prenom}
            </Text>
            <Text style={styles.sessionText}>
              <TabBarIcon name="time-outline" size={16} color="#000" /> Temps: {item.temps} minutes
            </Text>
            <Text style={styles.sessionText}>
              <TabBarIcon name="disc-outline" size={16} color="#000" /> Cible: {item.cible}
            </Text>
            <Text style={styles.sessionText}>
              <TabBarIcon name="trending-up-outline" size={16} color="#000" /> Niveau: {item.niveau}
            </Text>
          </TouchableOpacity>

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
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 150,
    marginBottom: 50,
    textAlign: 'center',
  },
  sessionContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sessionText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  sessionTextTitle: {
    fontSize: 25,
    marginBottom: 5,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});
