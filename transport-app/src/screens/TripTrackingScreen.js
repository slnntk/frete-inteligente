import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Title, Paragraph, Card } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { tripsAPI } from '../services/api';
import io from 'socket.io-client';

const TripTrackingScreen = ({ route }) => {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    loadTrip();
    setupSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const loadTrip = async () => {
    try {
      const response = await tripsAPI.getTripById(tripId);
      setTrip(response.data.trip);
      
      if (response.data.trip.currentLocation) {
        setCurrentLocation(response.data.trip.currentLocation);
      }
    } catch (error) {
      console.error('Error loading trip:', error);
      Alert.alert('Erro', 'Falha ao carregar detalhes da viagem');
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    // Replace with your backend URL
    const socketConnection = io('http://localhost:3000');
    
    socketConnection.on('connect', () => {
      console.log('Socket connected');
      socketConnection.emit('joinTrip', tripId);
    });

    socketConnection.on('locationUpdate', (data) => {
      if (data.tripId === tripId) {
        setCurrentLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: data.timestamp,
        });
      }
    });

    socketConnection.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(socketConnection);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.centerContainer}>
        <Paragraph style={styles.errorText}>Viagem não encontrada</Paragraph>
      </View>
    );
  }

  const origin = { latitude: -3.7327, longitude: -38.5267 }; // Default Fortaleza
  const destination = { latitude: -3.7500, longitude: -38.5400 };

  return (
    <View style={styles.container}>
      <Card style={styles.infoCard} mode="elevated">
        <Card.Content>
          <Title style={styles.title}>{trip.title}</Title>
          <Paragraph style={styles.info}>
            📍 {trip.origin} → {trip.destination}
          </Paragraph>
          <Paragraph style={styles.info}>
            👤 {trip.driver.name}
          </Paragraph>
          {currentLocation && (
            <Paragraph style={styles.status}>
              🟢 Viagem em andamento
            </Paragraph>
          )}
          {!currentLocation && (
            <Paragraph style={styles.status}>
              ⏳ Aguardando início da viagem
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude || origin.latitude,
          longitude: currentLocation?.longitude || origin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
            : undefined
        }
      >
        {/* Origin marker */}
        <Marker coordinate={origin} title="Origem" pinColor="green" />

        {/* Destination marker */}
        <Marker coordinate={destination} title="Destino" pinColor="red" />

        {/* Current location marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Veículo"
            pinColor="blue"
          />
        )}

        {/* Route line */}
        {currentLocation && (
          <Polyline
            coordinates={[
              origin,
              {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              },
              destination,
            ]}
            strokeColor="#4CAF50"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  infoCard: {
    margin: 16,
    backgroundColor: '#2a2a2a',
  },
  title: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  status: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TripTrackingScreen;
