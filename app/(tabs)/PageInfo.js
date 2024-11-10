import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PageInfo({ navigation }) {
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [sexe, setSexe] = useState('');
  const [poid, setPoid] = useState('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);  // State pour gérer la visibilité du Picker

  // Références animées pour chaque sous-titre
  const prenomLabelAnim = useRef(new Animated.Value(0)).current;
  const ageLabelAnim = useRef(new Animated.Value(0)).current;
  const sexeLabelAnim = useRef(new Animated.Value(0)).current;
  const poidLabelAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (labelAnim) => {
    Animated.timing(labelAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (labelAnim, fieldValue) => {
    if (fieldValue === '') {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const animatedLabelStyle = (anim) => ({
    position: 'absolute',
    left: 15,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [18, -20],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.5],
        }),
      },
    ],
    fontWeight: 'bold',
    fontSize: 14,
    color: anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#000'],
    }),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tes Infos Perso !</Text>

      <View style={styles.inputContainer}>
        <Animated.Text style={animatedLabelStyle(prenomLabelAnim)}>Prénom</Animated.Text>
        <TextInput
          style={styles.input}
          value={prenom}
          onChangeText={setPrenom}
          onFocus={() => handleFocus(prenomLabelAnim)}
          onBlur={() => handleBlur(prenomLabelAnim, prenom)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Animated.Text style={animatedLabelStyle(ageLabelAnim)}>Âge</Animated.Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          onFocus={() => handleFocus(ageLabelAnim)}
          onBlur={() => handleBlur(ageLabelAnim, age)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Animated.Text style={animatedLabelStyle(sexeLabelAnim)}>Sexe</Animated.Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setIsPickerVisible(true)}  // Afficher le Picker lorsqu'on clique
        >
          <Text style={styles.pickerText}>
            {sexe ? sexe : 'Sélectionner votre sexe'}
          </Text>
        </TouchableOpacity>

        {/* Modal pour afficher le Picker */}
        {isPickerVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isPickerVisible}
            onRequestClose={() => setIsPickerVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Picker
                  selectedValue={sexe}
                  onValueChange={(itemValue) => {
                    setSexe(itemValue);
                    setIsPickerVisible(false);  // Fermer le modal après la sélection
                  }}
                >
                  <Picker.Item label="Sélectionner votre sexe" value="" />
                  <Picker.Item label="Homme" value="Homme" />
                  <Picker.Item label="Femme" value="Femme" />
                </Picker>
              </View>
            </View>
          </Modal>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Animated.Text style={animatedLabelStyle(poidLabelAnim)}>Poids</Animated.Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={poid}
          onChangeText={setPoid}
          onFocus={() => handleFocus(poidLabelAnim)}
          onBlur={() => handleBlur(poidLabelAnim, poid)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginVertical: 20, // Espace entre les champs
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pickerContainer: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  pickerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    padding: 20,
  },
  picker: {
    height: 200,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
});
