import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Import Toast

export default function Account({navigation, setIsAuthenticated}) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userCredentials');
        const credentials = JSON.parse(data);
        if (credentials) {
          setUserData({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load user data.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      setIsAuthenticated(false);

      // Show a success toast message
      Toast.show({
        type: 'success',
        text1: 'Signed Out',
        text2: 'You have been signed out successfully.',
      });

      // Navigate to login or another screen (if needed)
      // navigation.navigate('Login');
    } catch (error) {
      console.error('Error during sign-out:', error);

      // Show an error toast message
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to sign out.',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      {userData ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Name: </Text>
            {userData.name}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Email: </Text>
            {userData.email}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Password: </Text>
            {userData.password}
          </Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No user data found.</Text>
      )}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#495057',
  },
  label: {
    fontWeight: 'bold',
    color: '#212529',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 3,
  },
  signOutText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
