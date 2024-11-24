import { useFocusEffect } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

export default function SeancesStat() {
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const fetchStatistiques = async () => {
    try {
      const response = await fetch('http://192.168.2.54:3000/getStatistiques');
      const result = await response.json();

      // Aggregate data by specific date
      const aggregatedData = result.reduce((acc, item) => {
        const date = format(parseISO(item.date), 'yyyy-MM-dd');
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += item.tasksCompleted;
        return acc;
      }, {});

      // Transform the aggregated data for the LineChart
      const lineChartData = Object.keys(aggregatedData).map(date => ({
        date: format(parseISO(date), 'EEE', { locale: fr }), // Transform date to day of the week and date
        value: aggregatedData[date],
      }));

      // Sort the data by date
      lineChartData.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Limit to the last 7 days
      const limitedData = lineChartData.slice(-7);

      setData(limitedData);

      // Transform the data for the PieChart
      const pieChartData = [
        { name: 'Intermédiaire', population: result.filter(item => item.level === 'Intermédiaire' && item.tasksCompleted > 0).length, color: '#5b7411', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Débutant', population: result.filter(item => item.level === 'Débutant' && item.tasksCompleted > 0).length, color: '#000000', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Avancé', population: result.filter(item => item.level === 'Avancé' && item.tasksCompleted > 0).length, color: '#8C1818', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      ];
      setPieData(pieChartData);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStatistiques();
    }, [])
  );

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        data: data.map(item => item.value),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      <Text style={styles.chartTextTitle}>Nombre de taches éffectueés cette semaine</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#5b7411',
          backgroundGradientFrom: '#5b7411',
          backgroundGradientTo: '#5b7412',
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
        data={pieData}
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
