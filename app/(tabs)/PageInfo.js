import { Picker } from '@react-native-picker/picker';
import React, { useRef, useState } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function PageInfo({ navigation }) {
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [sexe, setSexe] = useState('');
  const [poid, setPoid] = useState('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollView}>
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
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setIsPickerVisible(true)}
            >
              <Text style={styles.pickerText}>
                {sexe ? sexe : 'Sélectionner votre sexe'}
              </Text>
            </TouchableOpacity>

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
                        setIsPickerVisible(false);
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 150,
    marginBottom: 50,
    textAlign: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginVertical: 20,
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
});
