import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

export default function SignUp({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (!email || !password || !name) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields!',
        position: 'Top',
      });
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Update the user's display name (optional)
        userCredential.user.updateProfile({displayName: name}).then(() => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Account created successfully!',
            position: 'Top',
          });

          setName('');
          setEmail('');
          setPassword('');
          navigation.navigate('Login'); // Redirect to Login screen
        });
      })
      .catch(error => {
        let errorMessage = error.message;
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email address is already in use!';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'This email address is invalid!';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'The password is too weak!';
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
      <Text style={styles.title}>Sign-Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="black"
        value={name}
        onChangeText={setName}
      />
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
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.goToButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  input: {
    color: 'black',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  signUpButton: {
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
