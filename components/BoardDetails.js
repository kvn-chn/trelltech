import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView, ImageBackground, Modal, Image } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import * as apiCalls from '../apiCalls';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default function BoardDetails({ route, navigation }) {
    const { board, boardId } = route.params;
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editName, setEditName] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        navigation.setOptions({ title: board.name });
    }, [board]);

    useEffect(() => {
        setBackgroundImage(board.prefs.backgroundImage);
    }, [board]);
    
    const [lists, setLists] = useState([]);
    const [addingCardToList, setAddingCardToList] = useState(null);
    const [newCardName, setNewCardName] = useState('');

    const memberCache = {};

    const getMember = async (memberId) => {
        if (memberCache[memberId]) {
            return memberCache[memberId];
        } else {
            const member = await apiCalls.getMember(memberId);
            memberCache[memberId] = member;
            return member;
        }
    };

    const getListsAndCards = async () => {
        try {
            const listsData = await apiCalls.getLists(boardId);
            const listsWithCards = await Promise.all(listsData.map(async list => {
                const cards = await apiCalls.getCards(list.id);
                const cardsWithMembersDetails = await Promise.all(cards.map(async card => {
                    const membersDetails = await Promise.all(card.idMembers.map(getMember));
                    return { ...card, members: membersDetails };
                }));
                return { ...list, cards: cardsWithMembersDetails };
            }));
            setLists(listsWithCards);
        } catch (error) {
            console.error(error);
        }
    }

    const handleAddCard = (listId) => {
        setAddingCardToList(listId);
    }

    const handleCreateCard = async (listId) => {
        try {
            const newCard = await apiCalls.createCard(listId, newCardName);
            setLists(prevLists => {
                return prevLists.map(list => {
                    if (list.id === listId) {
                        return { ...list, cards: [...list.cards, newCard] };
                    } else {
                        return list;
                    }
                });
            });
            setNewCardName('');
            setAddingCardToList(null);
        } catch (error) {
            console.error(error);
        }
    }

    const handleCreateList = async (boardId, listName) => {
        try {
            await apiCalls.createList(boardId, listName);
            getListsAndCards();
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdateCard = async (cardId, newName) => {
        try {
            const updatedCard = await apiCalls.updateCard(cardId, newName);
            setLists(prevLists => {
                return prevLists.map(list => {
                    return {
                        ...list,
                        cards: list.cards.map(card => {
                            if (card.id === cardId) {
                                return updatedCard;
                            } else {
                                return card;
                            }
                        })
                    };
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    const promptUpdateCard = (cardId) => {
        Alert.prompt(
            "Update Card",
            "Enter the new name for this card:",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: newName => handleUpdateCard(cardId, newName) }
            ],
            'plain-text'
        );
    }
    
    const [newListName,setNewListName] = useState('')

    const updateList = async (listId, listName) => {
        try {
            const response = await apiCalls.updateList(listId, listName);
            getListsAndCards();
            console.log(response);
            setNewListName('')
        } catch (error) {
            console.error(error);
        }
    };

    const archiveList = async (listId) => {
        try {
            await apiCalls.archiveList(listId);
            setLists(prevLists => {
                return prevLists.filter(list => list.id !== listId);
            });
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getListsAndCards();
        }, [])
      );

      const handleMenuSelect = (value, listId, listName) => {
        if (value === 'renameList') {
            setEditName(true);
            setNewName(listName);
        }
        if (value === 'deleteList') {
            Alert.alert(
                "Archive Card",
                "Are you sure you want to archive this card?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    { text: "Confirm", onPress: () => archiveList(listId), style: "destructive"}
                ],
                { cancelable: false }
            );
        }
      };

    return (
        <ImageBackground source={{ uri: backgroundImage }} style={styles.backgroundImage}>
            <View style={{ flex: 1 }}>
                <Swiper loop={false} key={lists.length}>
                    {lists.map((list) => (
                        <ScrollView key={list.id}>
                        <Card key={list.id} containerStyle={styles.card}>
                            <View style={styles.titleContainer}>
                                {editName ? (
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            value={newName}
                                            onChangeText={text => setNewName(text)}
                                            onEndEditing={() => {updateList(list.id, newName), setEditName(false);}}
                                            style={styles.input}
                                        />
                                        <Ionicons name="checkmark-circle" size={20} onPress={() => {updateList(list.id ,newName), setEditName(false);}} />
                                    </View>
                                ) : (
                                    <>
                                        <Card.Title>{list.name}</Card.Title>
                                        <Menu onSelect={(value) => handleMenuSelect(value, list.id, list.name)}>
                                        <MenuTrigger>
                                            <Ionicons name="ellipsis-horizontal" size={20} color="black" />
                                        </MenuTrigger>
                                        <MenuOptions customStyles={{ optionsContainer: { borderRadius: 10, marginTop: 30, width: 200 } }}>
                                        <MenuOption value="renameList">
                                            <Text style={{ fontSize: 14, padding: 10 }}>Rename the list</Text>
                                        </MenuOption>
                                        <MenuOption value="deleteList">
                                            <Text style={{ fontSize: 14, padding: 10 }}>Delete the list</Text>
                                        </MenuOption>
                                        </MenuOptions>
                                        </Menu>
                                    </>
                                )}
                            </View>
                            
                            {list.cards.map((card) => (
                                <TouchableOpacity 
                                    key={card.id} 
                                    onPress={() => navigation.navigate('CardDetails', { card, cardId: card.id })}
                                    onLongPress={() => promptUpdateCard(card.id)}>
                                    <Card containerStyle={styles.innerCard}>
                                        <Card.Title style={styles.cardName}>{card.name}</Card.Title>
                                        <View style={styles.iconContainer}>
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
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                            {addingCardToList === list.id && (
                                <TextInput 
                                    value={newCardName}
                                    onChangeText={setNewCardName}
                                    placeholder="Enter card name"
                                    onSubmitEditing={() => handleCreateCard(list.id)}
                                    style={styles.input}
                                />
                            )}
                            <TouchableOpacity style={styles.addButton} onPress={() => handleAddCard(list.id)}>
                                <Text style={styles.addButtonText}>Add a new card</Text>
                            </TouchableOpacity>                   
                        </Card>
                        </ScrollView>
                    ))}
                </Swiper>
                <Button
                    title="Add a new list"
                    onPress={() => setModalVisible(true)}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add a new list</Text>
                            <TextInput
                                value={newListName}
                                onChangeText={setNewListName}
                                placeholder="Enter list name"
                                onSubmitEditing={() => {
                                    handleCreateList(boardId, newListName);
                                    setModalVisible(false);
                                }}
                                style={styles.input}
                            />
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {setModalVisible(!modalVisible), setNewListName('')}}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
    },
    innerCard: {
        backgroundColor: '#e6e6e6',
        borderRadius: 5,
        margin: 0,
        padding: 15,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    addButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%', 
        resizeMode: 'cover',
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '70%',
        height: '30%', 
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardName: {
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    memberAvatarsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    memberAvatar: {
        width: 30,
        height: 30,
        borderRadius: 50,
        marginLeft: 5,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});