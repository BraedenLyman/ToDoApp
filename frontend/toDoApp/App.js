import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const [toDos, setToDos] = useState([]);
  const [input, setInput] = useState('');
  const [editToDos, setEditToDos] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // load todos on launch
  useEffect(() => {
    axios.get('http://localhost:3001/load').then((res) => setToDos(res.data));
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
    axios.post('http://localhost:3001/save', { todos: toDos })
    .then(() => alert('Saved!'))
    .catch(err => console.error('Save error:', err));
  };

  // clear all
  const handleClear = () => {
    axios.get('http://localhost:3001/clear').then(() => setToDos([]));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My ToDo App </Text>
      <View style={styles.header}>
        <Text style={styles.headerText}>Item</Text>
        <View style={styles.headerEditDelete}>
          <Text style={styles.headerText}>Edit</Text>
          <Text style={styles.headerText}>Delete</Text>
        </View>
      </View>
      <FlatList 
        style={styles.flatList}
        data={toDos} 
        keyExtractor={(item, index) => index.toString()} 
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text>{item}</Text>
            <View style={styles.deleteEdit}>
              <TouchableOpacity onPress={() => { setInput(item); setEditToDos(index); }}>
                <Icon name="edit" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Icon name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
      )}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputText} value={input} onChangeText={setInput} placeholder='Add/Edit TODO'/>
          <TouchableOpacity style={styles.addEditButton} onPress={handleAddAndEdit}>
            <Text style={styles.buttonText}>{editToDos !== null ? 'Edit' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContain}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 80,
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    borderBottomWidth: 1,
  },
  headerEditDelete: {
    flexDirection: 'row',
    gap: 10,
  },
  headerText: {
    fontSize: 18,
  },
  flatList: {
    marginTop: 20,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
    fontSize: 20,
  },
  deleteEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 35,
  },
  delete: {
    color: 'red',
  },
  edit: {
    color: 'blue',
  },
  bottomContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
  },
  inputText: {
    flex: 1,
    borderWidth: 1,
    padding: 10, 
    marginBottom: 10,
    marginHorizontal: 20,
  },
  buttonContain: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    marginBottom: 30,
  },
  addEditButton: {
    borderWidth: 1,
    width: 70,
    height: 37,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    borderWidth: 1,
    width: 70,
    height: 37,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  clearButton: {
    borderWidth: 1,
    width: 70,
    height: 37,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default App;