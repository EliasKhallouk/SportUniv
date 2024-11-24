import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

export default function SeancesStat() {
  const [data, setData] = useState([
    { date: 'Lun', value: 3 },
    { date: 'Mar', value: 5 },
    { date: 'Mer', value: 8 },
    { date: 'Jeu', value: 0 },
    { date: 'Ven', value: 9 },
    { date: 'Sam', value: 3 },
    { date: 'Dim', value: 3 },
  ]);

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        data: data.map(item => item.value),
      },
    ],
  };

  const pieChartData = [
    { name: 'Intermédiaire', population: 3, color: '#5b7411', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Débutant', population: 4, color: '#000000', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Avancé', population: 1, color: '#8C1818', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      <Text style={styles.chartTextTitle}>Nombre de taches éffectueés cette semaine</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" "
        chartConfig={{
          backgroundColor: '#5b7411',
          backgroundGradientFrom: '#5b7411',
          backgroundGradientTo: '',
          decimalPlaces: 0, // Set decimal places to 0 to ensure integer values
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#000000',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <Text style={styles.chartTextTitle}>Niveau des séances éffectueés cette semaine</Text>
      <PieChart
        data={pieChartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  chartTextTitle: {
    fontSize: 20,
    marginBottom: 0,
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
  },
});
