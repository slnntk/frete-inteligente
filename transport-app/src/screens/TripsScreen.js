import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  ActivityIndicator,
  FAB,
} from 'react-native-paper';
import { tripsAPI, checkInsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TripsScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await tripsAPI.getTrips({ status: 'scheduled' });
      setTrips(response.data.trips);
    } catch (error) {
      console.error('Error loading trips:', error);
      Alert.alert('Erro', 'Falha ao carregar viagens');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCheckIn = async (tripId) => {
    try {
      await checkInsAPI.createCheckIn({ tripId });
      Alert.alert('Sucesso', 'Check-in realizado com sucesso!');
      loadTrips();
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Falha ao realizar check-in');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTrip = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Title style={styles.cardTitle}>{item.title}</Title>
        <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
        
        <View style={styles.routeContainer}>
          <Paragraph style={styles.route}>
            📍 {item.origin} → {item.destination}
          </Paragraph>
          <Paragraph style={styles.time}>
            🕐 {formatDate(item.departureTime)}
          </Paragraph>
        </View>

        <View style={styles.chipContainer}>
          <Chip icon="currency-brl" style={styles.chip}>
            R$ {parseFloat(item.price).toFixed(2)}
          </Chip>
          <Chip icon="seat-passenger" style={styles.chip}>
            {item.availableSeats} vagas
          </Chip>
        </View>

        <Paragraph style={styles.driver}>
          Motorista: {item.driver.name}
        </Paragraph>
      </Card.Content>

      <Card.Actions>
        <Button
          mode="contained"
          buttonColor="#4CAF50"
          onPress={() => handleCheckIn(item.id)}
          disabled={item.availableSeats === 0}
        >
          {item.availableSeats === 0 ? 'Lotado' : 'Fazer Check-in'}
        </Button>
        <Button
          mode="outlined"
          textColor="#4CAF50"
          onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
        >
          Ver Detalhes
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Paragraph style={styles.emptyText}>
              Nenhuma viagem disponível no momento
            </Paragraph>
          </View>
        }
      />

      {(user?.userType === 'driver' || user?.userType === 'company') && (
        <FAB
          icon="plus"
          style={styles.fab}
          color="#fff"
          onPress={() => navigation.navigate('CreateTrip')}
        />
      )}
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
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#2a2a2a',
  },
  cardTitle: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#fff',
    marginTop: 8,
  },
  routeContainer: {
    marginTop: 12,
  },
  route: {
    color: '#fff',
    fontSize: 14,
  },
  time: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: '#3a3a3a',
  },
  driver: {
    color: '#999',
    marginTop: 12,
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
});

export default TripsScreen;
