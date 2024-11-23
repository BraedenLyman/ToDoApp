import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';

const App = () => {
  const [toDos, setToDos] = useState([]);
  const [input, setInput] = useState('');
  const [editToDos, setEditToDos] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // load todos on launch
  useEffect(() => {
    axios.get('http://192.168.40.108:3001/load').then((res) => setToDos(res.data));
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
    axios.post('http://192.168.40.108:3001/save', { todos: toDos })
    .then(() => alert('Saved!'))
    .catch(err => console.error('Save error:', err));
  };

  // clear all
  const handleClear = () => {
    axios.get('http://192.168.40.108:3001/clear').then(() => setToDos([]));
  };

  // checkbox selection
  const toggleCheckbox = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };
  
  // delete items in bulk
  const handleBulkDelete = () => {
    setToDos(toDos.filter((_, index) => !selectedItems.includes(index)));
    setSelectedItems([]);
  };

  // select or deselect all checkboxes
  const handleSelectAll = () => {
    if (selectedItems.length === toDos.length) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(toDos.map((_, index) => index)); // Select all
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My ToDo App </Text>
      <FlatList 
        data={toDos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <CheckBox
              checked={selectedItems.includes(index)}
              onPress={() => toggleCheckbox(index)}
            />
            <Text style={styles.text}>{item}</Text>
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
        <View style={styles.checkActions}>
          {toDos.length > 0 && (
          <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
            <Text style={styles.buttonText}>{selectedItems.length === toDos.length ? 'Deselect All' : 'Select All'}</Text>
          </TouchableOpacity>
          )}
          {selectedItems.length > 0 && (
            <TouchableOpacity style={styles.bulkDeleteButton} onPress={handleBulkDelete}>
              <Text style={styles.buttonText}>Delete Selected</Text>
          </TouchableOpacity>
          )}
        </View>
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
    fontSize: 25,
    textAlign: 'center',
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
  },
  deleteEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
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
  checkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  selectAllButton: {
    borderWidth: 1,
    padding: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulkDeleteButton: {
    borderWidth: 1,
    backgroundColor: 'red',
    padding: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
  },
});

export default App;