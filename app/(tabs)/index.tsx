import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={require('../logo2.png')} style={styles.imageLogo} />
      <Text style={styles.title}>
        Bienvenue sur <Text style={styles.highlight}>SportUniv</Text> !
      </Text>
      <Text style={styles.subtitle}>Ton application de sport universitaire</Text>
      <Image source={require('../Fitness.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    
    marginBottom: 50,
    textAlign: 'center',
  },
  highlight: {
    color: '#5b7411',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  image: {
    width: '100%',
    height: '50%',
    marginTop: 20,
  },
  imageLogo: {
    marginTop: 100,
    width: 200,
    height: 100
  },
});
