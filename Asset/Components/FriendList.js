import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

function FriendList({friends, onSelectFriend, selectedFriend, onRemoveFriend}) {
  return (
    <View>
      {friends.map(friend => (
        <View
          key={friend.id}
          style={[
            styles.friendItem,
            selectedFriend?.id === friend.id && styles.selectedFriend,
          ]}>
          <Image source={{uri: friend.image}} style={styles.image} />
          <View style={styles.friendDetails}>
            <Text style={styles.name}>{friend.name}</Text>
            <Text>
              {friend.balance < 0
                ? `You owe ${friend.name} ${Math.abs(friend.balance)} PKR`
                : friend.balance > 0
                ? `${friend.name} owes you ${friend.balance} PKR`
                : `You and ${friend.name} are even`}
            </Text>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => onSelectFriend(friend)}>
              <Text>
                {selectedFriend?.id === friend.id ? 'Close' : 'Select'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selectButton, {backgroundColor: 'red'}]}
              onPress={() => onRemoveFriend(friend.id)}>
              <Text style={{color: 'white'}}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedFriend: {
    backgroundColor: '#f0f8ff',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  friendDetails: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  selectButton: {
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
});

export default FriendList;
