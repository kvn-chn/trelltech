import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import * as apiCalls from '../apiCalls';
import { useFocusEffect } from '@react-navigation/native';

export default function WorkscapeDetails({ route, navigation }) {
    const { workspace, workspaceId } = route.params;
    const [newBoardName, setNewBoardName] = useState('');

    useEffect(() => {
        navigation.setOptions({ title: workspace.displayName });
    }, [workspace]);

    const [boards, setBoards] = useState([]);

    const getBoards = async () => {
        try {
            const boardsData = await apiCalls.getBoardsInWorkspace(workspaceId);
            setBoards(boardsData);
        } catch (error) {
            console.error(error);
        }
    }
    const updateBoard = async (boardId) => {
        try {
          const updatedBoard = await apiCalls.updateBoard(boardId, newBoardName);
          setBoards(boards.map((board) => board.id === boardId ? updatedBoard : board));
        //   setEditingBoardId(null);
          setNewBoardName('');
        } catch (error) {
          console.error(error);
        }
      };
    
    useFocusEffect(
        React.useCallback(() => {
            const fetchBoards = async () => {
                await getBoards();
            };

            fetchBoards();
        }, [])
    );


    const openBoardDetails = (board, boardId) => {
        navigation.navigate('BoardDetails', { board, boardId });
    };

    return (
        <ScrollView>
            {boards && boards.map(board => (
                <Card key={board.id}>
                    <TextInput
                    onChangeText={setNewBoardName}
                    onSubmitEditing={() => updateBoard(board.id,newBoardName)}
                    >
                        <Card.Title>{board.name}</Card.Title>
                    </TextInput>
                    <Card.Divider />
                    <Button
                        title="View Board"
                        onPress={() => openBoardDetails(board, board.id)}
                    />
                </Card>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    },
    cardContainer: {
        margin: 10,
    },
    cardTitle: {
        fontSize: 16,
    },
});