import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import axios from 'axios';
import { API_KEY, TOKEN } from '@env';

export const getBoards = async () => {
    const [boards, setBoards] = useState([]);

    try {
        const response = await axios.get('https://api.trello.com/1/members/me/boards', {
            params: {
                key: API_KEY,
                token: TOKEN,
            },
        });
        setBoards(response.data[0].name);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

export default function App() {
    useEffect(() => {
        getBoards();
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {boards.map((board) => (
        <Text key={board.id}>{board.name}</Text>
      ))}
      <StatusBar style="auto" />
    </View>
    );
}