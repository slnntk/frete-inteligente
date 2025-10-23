import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4CAF50',
    background: '#1a1a1a',
    surface: '#2a2a2a',
    text: '#ffffff',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
