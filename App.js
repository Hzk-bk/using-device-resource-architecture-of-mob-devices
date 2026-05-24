import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';

import * as Location from 'expo-location';

export default function App() {

  const [location, setLocation] = useState(null);

  const [weather, setWeather] = useState(null);

  const [places, setPlaces] = useState([]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const getCurrentLocation = async () => {

    setLoading(true);

    setErrorMessage('');

    setLocation(null);

    setWeather(null);

    setPlaces([]);

    try {

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {

        setErrorMessage(
          'Location permission was denied.'
        );

        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      setLocation(currentLocation);

      const latitude =
        currentLocation.coords.latitude;

      const longitude =
        currentLocation.coords.longitude;

      await fetchWeather(latitude, longitude);

      await fetchNearbyPlaces(latitude, longitude);

    } catch (error) {

      setErrorMessage(
        'Could not read device location.'
      );

    } finally {

      setLoading(false);
    }
  };

  const fetchWeather = async (
    latitude,
    longitude
  ) => {

    try {

      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&timezone=auto`;

      const response = await fetch(url);

      if (!response.ok) {

        throw new Error(
          'Failed to fetch weather.'
        );
      }

      const data = await response.json();

      setWeather(data.current);

    } catch (error) {

      setErrorMessage(
        'Could not load weather data.'
      );
    }
  };

  const fetchNearbyPlaces = async (
    latitude,
    longitude
  ) => {

    try {

      const url =
        `https://en.wikipedia.org/w/api.php` +
        `?action=query` +
        `&list=geosearch` +
        `&gscoord=${latitude}|${longitude}` +
        `&gsradius=10000` +
        `&gslimit=20` +
        `&format=json` +
        `&origin=*`;

      const response = await fetch(url);

      if (!response.ok) {

        throw new Error(
          'Failed to fetch nearby places.'
        );
      }

      const data = await response.json();

      const results =
        data.query?.geosearch || [];

      setPlaces(results);

    } catch (error) {

      setErrorMessage(
        'Could not load nearby places.'
      );
    }
  };

  const renderPlace = ({ item }) => (

    <View style={styles.placeCard}>

      <Text style={styles.placeTitle}>
        {item.title}
      </Text>

      <Text>
        Distance: {item.dist} meters
      </Text>

      <Text>
        Latitude: {item.lat}
      </Text>

      <Text>
        Longitude: {item.lon}
      </Text>

      <Text>
        Page ID: {item.pageid}
      </Text>

    </View>
  );

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.heading}>
        Location Weather App
      </Text>

      <Text style={styles.description}>
        Read device location, weather,
        and nearby Wikipedia places.
      </Text>

      <Button
        title="Get Current Location"
        onPress={getCurrentLocation}
      />

      {loading && (

        <View style={styles.section}>

          <ActivityIndicator size="large" />

          <Text style={styles.info}>
            Loading data...
          </Text>

        </View>
      )}

      {errorMessage !== '' && (

        <Text style={styles.error}>
          {errorMessage}
        </Text>
      )}

      {location && (

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Device Location
          </Text>

          <Text>
            Latitude:
            {location.coords.latitude}
          </Text>

          <Text>
            Longitude:
            {location.coords.longitude}
          </Text>

        </View>
      )}

      {weather && (

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Current Weather
          </Text>

          <Text>
            Temperature:
            {weather.temperature_2m} °C
          </Text>

          <Text>
            Humidity:
            {weather.relative_humidity_2m}%
          </Text>

          <Text>
            Wind Speed:
            {weather.wind_speed_10m} km/h
          </Text>

          <Text>
            Weather Code:
            {weather.weather_code}
          </Text>

        </View>
      )}

      <Text style={styles.sectionTitle}>
        Nearby Wikipedia Places
      </Text>

      {places.length === 0 && !loading ? (

        <Text style={styles.info}>
          No nearby articles found.
        </Text>

      ) : (

        <FlatList
          data={places}
          renderItem={renderPlace}
          keyExtractor={(item) =>
            item.pageid.toString()
          }
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    marginBottom: 16,
  },

  section: {
    marginTop: 20,
    alignItems: 'center',
  },

  info: {
    marginTop: 8,
    fontSize: 14,
  },

  error: {
    marginTop: 20,
    fontSize: 15,
    color: 'red',
  },

  card: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  placeCard: {
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
  },

  placeTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

});