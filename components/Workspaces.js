import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Card} from 'react-native-elements';
import * as apiCalls from '../apiCalls';
import { useFocusEffect } from '@react-navigation/native';

export default function Workscapes({ navigation }) {

    const [workspaces, setWorkspaces] = useState([]);

    const getWorkspaces = async () => {
      try {
        const workspacesData = await apiCalls.getWorkspaces();
        const workspacesWithBoards = await Promise.all(workspacesData.map(async (workspace) => {
          const boards = await apiCalls.getBoardsInWorkspace(workspace.id);
          const boardsWithLists = await Promise.all(boards.map(async (board) => {
            const lists = await apiCalls.getLists(board.id);
            return { ...board, lists };
          }));
          return { ...workspace, boards: boardsWithLists };
        }));
        setWorkspaces(workspacesWithBoards);
      } catch (error) {
        console.error(error);
      }
    };

    useFocusEffect(
      React.useCallback(() => {
          getWorkspaces();
      }, [])
    );

    const openBoardDetails = (board, boardId) => {
        navigation.navigate('BoardDetails', { board, boardId });
      };

      const renderItem = ({ item: workspace }) => (
        workspace.boards.length > 0 && (
        <View key={workspace.id}>
          <TouchableOpacity key={workspace.id} 
            onPress={() => navigation.navigate('WorkspaceDetails', { 
              workspace: workspace, 
              workspaceId: workspace.id 
            })}
          >
            <Text style={styles.workspaceTitle}>{workspace.displayName}</Text>
          </TouchableOpacity>
          {workspace.boards.map((board) => (
            <TouchableOpacity key={board.id} onPress={() => openBoardDetails(board, board.id)}>
              <Card
                containerStyle={styles.cardContainer}
                wrapperStyle={styles.cardWrapper}
              >
                <Card.Title style={styles.boardTitle}>{board.name}</Card.Title>
                {board.lists.map((list) => (
                  <View key={list.id} style={styles.listItem}>
                    <Text style={styles.listTitle}>{list.name}</Text>
                  </View>
                ))}
              </Card>
            </TouchableOpacity>
          ))}
        </View>
        )
      );
  
      return (
        <View style={styles.container}>
            <FlatList
                data={workspaces}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={renderItem}
            />
            <StatusBar style="auto" />
        </View>
    );
  }
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    workspaceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center',
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardContainer: {
        borderRadius: 15,
        backgroundColor: '#007bff',
        marginBottom: 3,
    },
    cardWrapper: {
        padding: 1, 
    },
    listItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 0.3,
        borderColor: '#ccc',
    },
    listTitle: {
        fontSize: 14,
        color: '#333',
        
    },
});