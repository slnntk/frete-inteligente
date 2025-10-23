import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TripsScreen from '../screens/TripsScreen';
import MyCheckInsScreen from '../screens/MyCheckInsScreen';
import TripTrackingScreen from '../screens/TripTrackingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#2a2a2a',
          borderTopColor: '#3a3a3a',
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        headerStyle: {
          backgroundColor: '#2a2a2a',
        },
        headerTintColor: '#4CAF50',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Trips"
        component={TripsScreen}
        options={{
          title: 'Viagens',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyCheckIns"
        component={MyCheckInsScreen}
        options={{
          title: 'Meus Check-ins',
          tabBarIcon: ({ color, size }) => (
            <Icon name="check-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2a2a2a',
          },
          headerTintColor: '#4CAF50',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Cadastro' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TripTracking"
              component={TripTrackingScreen}
              options={{ title: 'Rastreamento' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
