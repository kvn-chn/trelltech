import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as apiCalls from '../apiCalls';
import { useNavigation } from '@react-navigation/native';

export default function CreateBoardScreen() {
  
  const [boardName, setBoardName] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const navigation = useNavigation();
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedModelImage, setSelectedModelImage] = useState(null);

  useEffect(() => {
      apiCalls.getWorkspaces().then(setWorkspaces);
      apiCalls.getTemplateBoards().then(setModels);
  }, []);

  const createNewBoard = async () => {
    if (!boardName.trim()) {
      alert('Board name is required');
      return;
    }

    if (selectedWorkspace === null) {
      alert('Workspace is required');
      return;
    }

    try {

      if (selectedModel == null) {
        const response = await apiCalls.createBoardInWorkspace(boardName, selectedWorkspace);
        if (response !== null) {
          setWorkspaces([...workspaces, response]);
        }
      navigation.navigate("Workspaces");
      }
      else {
        const response = await apiCalls.createBoardWithTemplate(boardName, selectedWorkspace, selectedModel);
        if (response !== null) {
          setWorkspaces([...workspaces, response]);
        }
      navigation.navigate("Workspaces");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
        <Text>Board name</Text>
        <TextInput
            style={styles.input}
            value={boardName}
            onChangeText={setBoardName}
            placeholder="Enter board name"
        />
        <Text>Workspace</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
              style={pickerSelectStyles}
              onValueChange={(value) => setSelectedWorkspace(value)}
              placeholder={{ label: 'Select a workspace', value: null }}
              items={workspaces.map(workspace => ({ 
                label: workspace.displayName || 'Unnamed workspace', 
                value: workspace.id, 
                key: workspace.id 
              }))}
          />
        </View>
        <Text>Template (optimal)</Text>
        <View>
          <RNPickerSelect
            style={pickerSelectStyles}
            onValueChange={(value) => {
              const selectedModel = models.find(model => model["200"].id === value);
              setSelectedModel(value);
              setSelectedModelImage(selectedModel ? selectedModel["200"].prefs.backgroundImage : null);
            }}
            placeholder={{ label: 'Select a template', value: null }}
            items={models.map(model => ({ 
              label: model["200"].name || 'Unnamed model', 
              value: model["200"].id, 
              key: model["200"].id 
            }))}
          />
          {selectedModelImage && <Image source={{ uri: selectedModelImage }} style={styles.modelImage} />}
        </View>
        <Button 
            title='Create Board'
            onPress={createNewBoard}
        />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
    },
    pickerContainer: {
        borderColor: 'gray',
        marginBottom: 20,
    },
    modelImage: {
      width: '100%',
      height: 200,
      borderRadius: 20,
      marginTop: 20,
      marginBottom: 20,
    },  
  });

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,

    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
      },
    });