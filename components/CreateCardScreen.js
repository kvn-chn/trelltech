import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as apiCalls from '../apiCalls';
import { useNavigation } from '@react-navigation/native';

export default function CreateCardScreen() {
    
    const [cardName, setCardName] = useState('');
    const [cardDescription, setCardDescription] = useState('');
    const [selectedBoard, setSelectedBoard] = useState('');
    const [selectedList, setSelectedList] = useState(null);
    const [boards, setBoards] = useState([]);
    const [lists, setLists] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
            apiCalls.getBoards().then(setBoards);
            setSelectedBoard(null);
    }, []);

    useEffect(() => {
        const fetchLists = async () => {
            if (selectedBoard && selectedBoard !== '' && selectedBoard !== null) {
                const lists = await apiCalls.getLists(selectedBoard);
                setLists(lists);
                setSelectedList(null);
            } else {
                setLists([]);
            }
        };

        fetchLists();
    }, [selectedBoard]);

    const createNewCard = async () => {
        if (!cardName.trim()) {
            alert('Card name is required');
            return;
        }

        if (selectedBoard === null || selectedList === null) {
            alert('Board and list are required');
            return;
        }

        try {
            const response = await apiCalls.createCardInList(cardName, cardDescription, selectedList);
            if (response !== null) {
                navigation.goBack();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
                <Text>Card name</Text>
                <TextInput
                        style={styles.input}
                        value={cardName}
                        onChangeText={setCardName}
                        placeholder="Enter card name"
                />
                <Text>Description (optional)</Text>
                <TextInput
                        style={styles.input}
                        value={cardDescription}
                        onChangeText={setCardDescription}
                        placeholder="Enter description"
                />
                <Text>Board</Text>
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                            style={pickerSelectStyles}
                            onValueChange={(value) => setSelectedBoard(value)}
                            placeholder={{ label: 'Select a board', value: null }}
                            items={boards.map(board => ({ label: board.name, value: board.id, key: board.id }))}
                    />
                </View>
                <Text>List</Text>
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        style={pickerSelectStyles}
                        onValueChange={(value) => setSelectedList(value)}
                        placeholder={{ label: 'Select a list', value: null }}
                        value={selectedList}
                        items={lists ? lists.map(list => ({ label: list.name, value: list.id, key: list.id })) : []}
                    />
                </View>
                <Button 
                        title='Create Card'
                        onPress={createNewCard}
                />
        </View>
    );
}

// Styles
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
    },
    pickerContainer: {
        borderColor: 'gray',
        //borderWidth: 1,
        marginBottom: 20,
        //paddingLeft: 10,
    },
});

// Picker styles
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});