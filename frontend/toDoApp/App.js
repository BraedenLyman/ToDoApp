import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [toDos, setToDos] = useState([]);
  const [input, setInput] = useState('');
  const [editToDos, setEditToDos] = useState(null);

  // load todos on launch
  useEffect(() => {
    axios.get('http://192.168.40.247:3001/load').then((res) => setToDos(res.data));
  }, []);

  // add or edit item
  const handleAddAndEdit = () => {
    if (editToDos !== null){
      const updateToDos = [...toDos];
      updateToDos[editToDos] = input;
      setToDos(updateToDos);
      setEditToDos(null);
    } else {
      setToDos([...toDos, input]);
    }

    setInput('');
  }

  // delete an item
  const handleDelete = (index) => {
    setToDos(toDos.filter((_, i) => i !== index));
  };

  // save to backend
  const handleSave = () => {
    axios.post('http://192.168.40.247:3001/save', { todos: toDos })
    .then(() => alert('Saved!'))
    .catch(err => console.error('Save error:', err));
  };

  // restore from backend
  const handleRestore = () => {
    axios.get('http://192.168.40.247:3001/load').then((res) => setToDos(res.data));
  };

  // clear all
  const handleClear = () => {
    axios.get('http://192.168.40.247:3001/clear').then(() => setToDos([]));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContain}>
        <Button title='Save' onPress={handleSave} />
        <Button title='Restore' onPress={handleRestore} />
        <Button title='clear' onPress={handleClear} />
      </View>
      <FlatList 
        data={toDos} 
        keyExtractor={(item, index) => index.toString()} 
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => handleDelete(index)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setInput(item); setEditToDos(index); }}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
          </View>
      )}
      />
      <TextInput style={styles.inputText} value={input} onChangeText={setInput} placeholder='Add/Edit TODO'/>
      <Button title={editToDos !== null ? 'Edit' : 'Add'} onPress={handleAddAndEdit}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContain: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    marginBottom: 10
  },
  delete: {
    color: 'red',
  },
  edit: {
    color: 'blue',
  },
  inputText: {
    borderWidth: 1,
    padding: 10, 
    marginBottom: 10,
  }
});

export default App;