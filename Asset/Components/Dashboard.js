import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore'; // Firebase Firestore

export default function Dashboard() {
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState(''); // Replace with your actual user ID or authentication logic

  // Load friends from AsyncStorage when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadFriends = async () => {
        const data = await AsyncStorage.getItem('userCredentials');
        const credentials = JSON.parse(data);
        setUserId(credentials.email);

        try {
          const unsubscribe = firestore()
            .collection('users')
            .doc(credentials.email)
            .collection('friends')
            .onSnapshot(
              snapshot => {
                if (!snapshot) {
                  console.error('Error: No snapshot received');
                  return;
                }

                const friendsData = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setFriends(friendsData);
              },
              error => {
                console.error('Error loading friends:', error);
              },
            );

          return () => unsubscribe(); // Unsubscribe on unmount
        } catch (error) {
          console.error('Error loading friends:', error);
        }
      };

      loadFriends();
    }, []),
  );

  const getTotalBalance = () => {
    return friends.reduce((total, friend) => total + friend.balance, 0);
  };

  const renderFriend = ({item}) => (
    <View style={styles.friendCard}>
      <Image source={{uri: item.image}} style={styles.friendImage} />
      <View style={styles.friendDetails}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text
          style={[
            styles.friendBalance,
            item.balance < 0 ? styles.negativeBalance : styles.positiveBalance,
          ]}>
          {item.balance < 0
            ? `You owe ${item.name} ${Math.abs(item.balance)} PKR`
            : item.balance > 0
            ? `${item.name} owes you ${item.balance} PKR`
            : `Settled up`}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <View style={styles.overviewContainer}>
        <Text style={styles.overviewTitle}>Total Balance:</Text>
        <Text
          style={[
            styles.totalBalance,
            getTotalBalance() < 0
              ? styles.negativeBalance
              : styles.positiveBalance,
          ]}>
          {getTotalBalance() < 0
            ? `You owe ${Math.abs(getTotalBalance())} PKR`
            : `You're owed ${getTotalBalance()} PKR`}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Friends Overview</Text>
      <FlatList
        data={friends}
        keyExtractor={item => item.id.toString()}
        renderItem={renderFriend}
        contentContainerStyle={styles.friendList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007bff',
  },
  overviewContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 3,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalBalance: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  friendList: {
    paddingBottom: 20,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 3,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendBalance: {
    fontSize: 14,
  },
  positiveBalance: {
    color: 'green',
  },
  negativeBalance: {
    color: 'red',
  },
});
