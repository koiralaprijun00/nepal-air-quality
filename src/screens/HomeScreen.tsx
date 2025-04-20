import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Searchbar, Card, Title, Paragraph } from 'react-native-paper';
import { calculateOverallAqi } from '../services/AqiCalculator';
import { CityData, RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Implement API call to fetch air quality data
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const getMarkerColor = (aqi: number) => {
    if (aqi <= 50) return '#00ff00';      // Good
    if (aqi <= 100) return '#ffff00';     // Moderate
    if (aqi <= 150) return '#ff9900';     // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#ff0000';     // Unhealthy
    if (aqi <= 300) return '#990099';     // Very Unhealthy
    return '#660066';                      // Hazardous
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search cities..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 27.7172,
          longitude: 85.3240,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {citiesData.map((city, index) => {
          const aqiData = calculateOverallAqi(city.sampleData[0]?.components || {});
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: city.coordinates.lat,
                longitude: city.coordinates.lon,
              }}
              onPress={() => navigation.navigate('CityDetail', { city })}
            >
              <View style={[styles.marker, { backgroundColor: getMarkerColor(aqiData.aqi) }]}>
                <Title style={styles.markerText}>{aqiData.aqi.toFixed(0)}</Title>
              </View>
            </Marker>
          );
        })}
      </MapView>
      {cityData && (
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title>{cityData.name}</Title>
            <Paragraph>Air Quality Index: {calculateOverallAqi(cityData.sampleData[0]?.components || {}).aqi.toFixed(0)}</Paragraph>
            <Paragraph>Status: {getAQIStatus(calculateOverallAqi(cityData.sampleData[0]?.components || {}).aqi)}</Paragraph>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
  },
});

export default HomeScreen; 