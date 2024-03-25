import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView, ImageBackground } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import * as apiCalls from '../apiCalls';

export default function ListDetails({ route, navigation }) {
    const { list, listId } = route.params;
    const [cards, setCards] = useState([]);
    const [newCardName, setNewCardName] = useState('');

    useEffect(() => {
        navigation.setOptions({ title: list.name });
    }, [list]);

    const getCards = async () => {
        try {
            const cardsData = await apiCalls.getCards(listId);
            setCards(cardsData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCards();
    }, []);

    const handleDeleteCard = async (cardId) => {
        try {
            await apiCalls.deleteCard(cardId);
            getCards();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ScrollView>
            <Card>
                <TextInput
                    onChangeText={setNewCardName}
                    onSubmitEditing={() => handleCreateCard(listId)}
                />
                <Card.Title>{list.name}</Card.Title>
                <Card.Divider />
                {cards && cards.map(card => (
                    <View key={card.id} style={styles.cardContainer}>
                        <Text>{card.name}</Text>
                        <Button
                            title="Delete Card"
                            onPress={() => handleDeleteCard(card.id)}
                        />
                    </View>
                ))}
            </Card>
        </ScrollView>
    );
}