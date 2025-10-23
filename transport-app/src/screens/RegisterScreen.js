import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Title, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('passenger');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !cpf || !phone || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (cpf.length !== 11) {
      Alert.alert('Erro', 'CPF deve ter 11 dígitos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      cpf,
      phone,
      password,
      userType,
    });
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erro', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Title style={styles.title}>Criar Conta</Title>

          <SegmentedButtons
            value={userType}
            onValueChange={setUserType}
            buttons={[
              { value: 'passenger', label: 'Passageiro' },
              { value: 'driver', label: 'Motorista' },
              { value: 'company', label: 'Empresa' },
            ]}
            style={styles.segmentedButtons}
            theme={{ colors: { secondaryContainer: '#4CAF50' } }}
          />

          <TextInput
            label="Nome Completo"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#4CAF50' } }}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            theme={{ colors: { primary: '#4CAF50' } }}
          />

          <TextInput
            label="CPF (apenas números)"
            value={cpf}
            onChangeText={setCpf}
            mode="outlined"
            keyboardType="numeric"
            maxLength={11}
            style={styles.input}
            theme={{ colors: { primary: '#4CAF50' } }}
          />

          <TextInput
            label="Telefone"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            theme={{ colors: { primary: '#4CAF50' } }}
          />

          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            theme={{ colors: { primary: '#4CAF50' } }}
          />

          <TextInput
            label="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            theme={{ colors: { primary: '#4CAF50' } }}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor="#4CAF50"
          >
            Cadastrar
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
            textColor="#4CAF50"
          >
            Já tem uma conta? Faça login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#2a2a2a',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 6,
  },
  linkButton: {
    marginTop: 10,
  },
});

export default RegisterScreen;
