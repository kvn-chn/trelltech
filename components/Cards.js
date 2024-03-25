import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Card } from 'react-native-elements';
import { TextInput } from 'react-native';
import * as apiCalls from '../apiCalls';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Cards() {

    const [cards, setCards] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(false);

    const [boards, setBoards] = useState([]);

    const memberCache = {};

    const navigation = useNavigation();

    const getMember = async (memberId) => {
        if (memberCache[memberId]) {
            return memberCache[memberId];
        } else {
            const member = await apiCalls.getMember(memberId);
            memberCache[memberId] = member;
            return member;
        }
    };

    const getBoardsAndCards = async () => {
        setLoading(true);
        try {
            const boardsData = await apiCalls.getBoards();
            setBoards(boardsData);
    
            const allCardsPromises = boardsData.map(async (board) => {
                const listsData = await apiCalls.getLists(board.id);
                const cardsPromises = listsData.map(async (list) => {
                    const cardsData = await apiCalls.getCardsInList(list.id);
                    const cardsWithMembersDetails = await Promise.all(cardsData.map(async card => {
                        const membersDetails = await Promise.all(card.idMembers.map(getMember));
                        return { ...card, members: membersDetails, boardName: board.name, listName: list.name };
                    }));
                    return cardsWithMembersDetails;
                });
                return Promise.all(cardsPromises);
            });
    
            const allCardsNested = await Promise.all(allCardsPromises);
            const allCards = allCardsNested.flat(2);
            setCards(allCards);
            setFilteredCards(allCards);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
      
      useEffect(() => {
        getBoardsAndCards();
    }, []);
    
    useEffect(() => {
        handleSearch(searchInput);
    }, [cards, searchInput]);

    const handleSearch = (searchInput) => {
        if (searchInput.trim() !== ''){
            const filteredCards = cards.filter(card => card.name.toLowerCase().includes(searchInput.toLowerCase()));
            setFilteredCards(filteredCards);
        } else {
            setFilteredCards(cards);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search for a card..."
                        value={searchInput}
                        onChangeText={text => setSearchInput(text)}
                    />
                    <ScrollView>
                        <View style={styles.cardWrapper}>
                        {filteredCards.map((card) => (
                            <TouchableOpacity key={card.id} onPress={() => navigation.navigate('CardDetails', { card, cardId : card.id})}>
                                <Card key={card.id} containerStyle={styles.cardContainer}>
                                    <Card.Title>{card.name}</Card.Title>
                                    {card.desc && (
                                        <Ionicons name="reorder-four-outline" size={24} color="black" />
                                    )}
                                    {card.members && card.members.length > 0 && (
                                        <View style={styles.memberAvatarsContainer}>
                                            {card.members.map((member) => (
                                                <Image
                                                    key={member.id}
                                                    source={{ uri: member.avatarUrl + '/30.png' }}
                                                    style={styles.memberAvatar}
                                                />
                                            ))}
                                        </View>
                                    )}
                                    <Text style={styles.cardDetails}>{card.boardName} in list {card.listName}</Text>
                                </Card>
                            </TouchableOpacity>
                        ))}
                        </View>
                    </ScrollView>
                </>
            )}
        </View>
    );
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cardContainer: {
        borderRadius: 10,
        backgroundColor: '#f8f8f8',
    },
    cardWrapper: {
        padding: 10, 
    },
    cardTitle: {
        fontSize: 20,
        color: '#333',
    },
    cardDetails: {
        fontSize: 16,
        color: '#666',
    },
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 15,
        borderRadius: 10,
        margin: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    memberAvatarsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    memberAvatar: {
        width: 24,
        height: 24,
        borderRadius: 50,
        marginLeft: 5,
    },
});

