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
} from 'react-native-paper';
import { checkInsAPI } from '../services/api';

const MyCheckInsScreen = ({ navigation }) => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = async () => {
    try {
      const response = await checkInsAPI.getMyCheckIns();
      setCheckIns(response.data.checkIns);
    } catch (error) {
      console.error('Error loading check-ins:', error);
      Alert.alert('Erro', 'Falha ao carregar check-ins');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancelCheckIn = async (checkInId) => {
    Alert.alert(
      'Cancelar Check-in',
      'Tem certeza que deseja cancelar este check-in?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await checkInsAPI.cancelCheckIn(checkInId);
              Alert.alert('Sucesso', 'Check-in cancelado com sucesso!');
              loadCheckIns();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao cancelar check-in');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCheckIns();
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'refunded':
        return '#2196F3';
      default:
        return '#999';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const renderCheckIn = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.statusContainer}>
          <Chip
            style={{ backgroundColor: getStatusColor(item.status) }}
            textStyle={{ color: '#fff' }}
          >
            {item.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
          </Chip>
          <Chip
            style={{ backgroundColor: getPaymentStatusColor(item.paymentStatus) }}
            textStyle={{ color: '#fff' }}
          >
            {getPaymentStatusText(item.paymentStatus)}
          </Chip>
        </View>

        <Title style={styles.cardTitle}>{item.trip.title}</Title>
        
        <View style={styles.infoContainer}>
          <Paragraph style={styles.info}>
            📍 {item.trip.origin} → {item.trip.destination}
          </Paragraph>
          <Paragraph style={styles.info}>
            🕐 {formatDate(item.trip.departureTime)}
          </Paragraph>
          <Paragraph style={styles.info}>
            💰 R$ {parseFloat(item.trip.price).toFixed(2)}
          </Paragraph>
          <Paragraph style={styles.info}>
            👤 Motorista: {item.trip.driver.name}
          </Paragraph>
        </View>
      </Card.Content>

      <Card.Actions>
        {item.status === 'confirmed' && (
          <>
            <Button
              mode="outlined"
              textColor="#4CAF50"
              onPress={() => navigation.navigate('TripTracking', { tripId: item.trip.id })}
            >
              Rastrear
            </Button>
            <Button
              mode="text"
              textColor="#F44336"
              onPress={() => handleCancelCheckIn(item.id)}
            >
              Cancelar
            </Button>
          </>
        )}
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
        data={checkIns}
        renderItem={renderCheckIn}
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
              Você ainda não fez nenhum check-in
            </Paragraph>
          </View>
        }
      />
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
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  info: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
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
});

export default MyCheckInsScreen;
