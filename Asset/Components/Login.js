import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth'; // Import Firebase auth
import Toast from 'react-native-toast-message';

export default function Login({navigation, onLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields!',
        position: 'Top',
      });
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async userCredential => {
        const {user} = userCredential;
        const credentials = {
          email: user.email,
          password: password,
          name: user.displayName,
        };
        onLogin(credentials); // Notify the parent App component
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Logged in successfully!',
          position: 'Top',
        });
      })
      .catch(error => {
        let errorMessage = error.message;
        console.log(error.code);

        if (error.code === 'auth/invalid-credential') {
          errorMessage = 'This email address / Password  is invalid!';
        }
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
          position: 'Top',
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="black"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="black"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.goToButton}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Go to Sign-Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: 'black',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // For Android shadow
  },
  retrieveButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  goToButton: {
    backgroundColor: '#6C757D',
    padding: 12,
    borderRadius: 8,
    marginVertical: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white', // Text color for the button
    fontSize: 16,
  },
});
