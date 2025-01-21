import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore'; // Firebase Firestore
import AddFriend from './AddFriend';
import FormSplitBill from './FormSplitBill';
import FriendList from './FriendList';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [userId, setUserId] = useState(''); // Replace with your actual user ID or authentication logic

  // Load friends from Firestore on component mount
  useEffect(() => {
    async function loadFriends() {
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
    }

    loadFriends();
  }, []);

  const handleAddFriendToggle = () => {
    setShowAddFriend(!showAddFriend);
    setShowSplitBill(false);
    setSelectedFriend('none');
  };

  const handleSplitToggle = friend => {
    if (selectedFriend?.id === friend.id) {
      setShowSplitBill(!showSplitBill);
      setSelectedFriend(null);
    } else {
      setShowSplitBill(true);
      setSelectedFriend(friend);
    }
    setShowAddFriend(false);
  };

  const addFriend = async newFriend => {
    const friendId = newFriend.id;
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('friends')
        .doc(friendId) // Use the generated random ID
        .set(newFriend); // Use set to create the document with the custom ID
      setShowAddFriend(false);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleSplit = async amount => {
    if (!selectedFriend) {
      console.error('No friend selected for splitting the bill');
      return;
    }

    try {
      const friendRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('friends')
        .doc(selectedFriend.id);

      const newBalance = (selectedFriend.balance || 0) + amount; // Handle balance properly

      await friendRef.update({
        balance: newBalance,
      });

      setShowSplitBill(false);
      setSelectedFriend(null); // Reset the selected friend after splitting
    } catch (error) {
      console.error('Error splitting bill:', error);
    }
  };

  const removeFriend = async friendId => {
    try {
      if (!friendId) {
        console.error('Friend ID is required to remove');
        return;
      }

      await firestore()
        .collection('users')
        .doc(userId)
        .collection('friends')
        .doc(friendId)
        .delete();

      setShowSplitBill(false);
      setSelectedFriend(null); // Reset selected friend after removal
      setShowAddFriend(false);
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.sidebar}>
        <FriendList
          friends={friends}
          onSelectFriend={handleSplitToggle}
          selectedFriend={selectedFriend}
          onRemoveFriend={removeFriend}
        />

        {showAddFriend && <AddFriend onAddFriend={addFriend} />}
        {showSplitBill && (
          <FormSplitBill
            style={styles.splitbill}
            selectedFriend={selectedFriend}
            onSplitBill={handleSplit}
          />
        )}
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={handleAddFriendToggle}>
          <Text style={styles.buttonText}>
            {showAddFriend ? 'Close' : 'Add Friend'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
  },
  sidebar: {
    flex: 1,
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
