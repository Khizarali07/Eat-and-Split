import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack'; // For Login and Sign-Up
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, StyleSheet, ActivityIndicator, View} from 'react-native';
import Toast from 'react-native-toast-message';

import './Asset/Components/FirebaseConfig'; // Ensure Firebase is initialized

// Import your components
import Friends from './Asset/Components/Friends';
import Dashboard from './Asset/Components/Dashboard';
import Login from './Asset/Components/Login';
import SignUp from './Asset/Components/SignUp';
import Account from './Asset/Components/Account';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define tabBarIcon as a separate component
const getTabBarIcon =
  route =>
  ({color, size}) => {
    let iconSource;
    if (route.name === 'Friends') {
      iconSource = require('./Asset/Icons/users.png'); // Replace with your image path
    } else if (route.name === 'Dashboard') {
      iconSource = require('./Asset/Icons/home.png'); // Replace with your image path
    } else if (route.name === 'Account') {
      iconSource = require('./Asset/Icons/account.png'); // Replace with your image path
    }
    return (
      <Image source={iconSource} style={[styles.icon, {tintColor: color}]} />
    );
  };

// Bottom Tab Navigator for authenticated users
function BottomTabs({setIsAuthenticated}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: getTabBarIcon(route),
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {height: 60, paddingBottom: 10},
      })}>
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Account">
        {props => (
          <Account {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Stack Navigator for unauthenticated users
function AuthStack({onLogin}) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login">
        {props => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication state

  // Check if user credentials exist in AsyncStorage
  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const userCredentials = await AsyncStorage.getItem('userCredentials');
        setIsAuthenticated(!!userCredentials); // If credentials exist, set as authenticated
      } catch (error) {
        console.error('Error checking user credentials:', error);
        setIsAuthenticated(false); // Default to unauthenticated on error
      }
    };

    checkCredentials();
  }, []);

  const handleLogin = async credentials => {
    try {
      // Save credentials to AsyncStorage
      await AsyncStorage.setItem(
        'userCredentials',
        JSON.stringify(credentials),
      );
      setIsAuthenticated(true); // Update the authentication state
    } catch (error) {
      console.error('Error saving user credentials:', error);
    }
  };

  // Show a loading indicator while checking authentication
  if (isAuthenticated === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <BottomTabs setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <AuthStack onLogin={handleLogin} />
      )}
      <Toast /> {/* Add Toast component here */}
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
