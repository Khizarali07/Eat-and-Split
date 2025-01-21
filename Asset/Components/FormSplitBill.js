import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import ModalSelector from 'react-native-modal-selector';

function FormSplitBill({selectedFriend, onSplitBill}) {
  const [bill, setBill] = useState('');
  const [yourExpense, setYourExpense] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('you');
  const friendExpense =
    bill && yourExpense >= 0 && yourExpense <= bill ? bill - yourExpense : 0;

  const handleSubmit = () => {
    const amount = whoIsPaying === 'you' ? -friendExpense : yourExpense;
    onSplitBill(amount);
  };

  const options = [
    {key: 'you', label: 'You'},
    {key: 'friend', label: selectedFriend.name},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Split Bill with {selectedFriend.name}</Text>
      <TextInput
        style={styles.input}
        value={bill}
        onChangeText={value => setBill(Number(value))}
        placeholder="Enter Bill Amount"
        placeholderTextColor="black"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={yourExpense}
        onChangeText={value => setYourExpense(Number(value))}
        placeholder="Enter Your Expense"
        placeholderTextColor="black"
        keyboardType="numeric"
      />
      <Text style={styles.expense}>
        {selectedFriend.name}'s Expense: {friendExpense}
      </Text>
      <Text style={styles.label}>Who is paying?</Text>
      <ModalSelector
        data={options}
        initValue={whoIsPaying === 'you' ? 'You' : selectedFriend.name}
        onChange={option => setWhoIsPaying(option.key)}
        style={styles.modalSelector}
        initValueTextStyle={styles.initValueText}
        optionTextStyle={styles.optionText}
        selectStyle={styles.selectStyle}
        selectTextStyle={styles.selectText}
      />
      <Button title="Split Bill" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    color: 'black',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  expense: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalSelector: {
    marginBottom: 12,
  },
  initValueText: {
    color: 'black',
    fontSize: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectStyle: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  selectText: {
    fontSize: 16,
    color: 'black',
  },
});

export default FormSplitBill;
