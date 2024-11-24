import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';

export default function SeancesStat() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData([
        { date: '2023-01-01', value: 30 },
        { date: '2023-02-01', value: 45 },
        { date: '2023-03-01', value: 28 },
        { date: '2023-04-01', value: 80 },
        { date: '2023-05-01', value: 99 },
        { date: '2023-06-01', value: 43 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const lineChartData = data.map(item => ({ x: item.date, y: item.value }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques des Séances</Text>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine data={lineChartData} />
      </VictoryChart>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
