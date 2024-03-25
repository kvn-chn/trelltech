import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView, ImageBackground, Button, Image, Touchable, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, Badge, ListItem, Avatar } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import * as apiCalls from '../apiCalls';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CardDetails({ route, navigation }) {
    const { card, cardId } = route.params;
    const [cardName, setCardName] = useState('');
    const [cardDescription, setCardDescription] = useState('');
    const [cardDueDate, setCardDueDate] = useState('');
    const [cardLabels, setCardLabels] = useState([]);
    const [cardComments, setCardComments] = useState([]);
    const [cardAttachments, setCardAttachments] = useState([]);
    const [cardChecklists, setCardChecklists] = useState([]);
    const [cardMembers, setCardMembers] = useState([]);
    const [membersInBoard, setMembersInBoard] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editName, setEditName] = useState(false);

    useEffect(() => {
        navigation.setOptions({ title: "Card Details" });
    }, []);

    const getCardDetails = async () => {
        try {
            const cardData = await apiCalls.getCard(cardId);
            //console.log(JSON.stringify(cardData, null, 2));
            const detailedMembersData = await Promise.all(cardData.idMembers.map(memberId => apiCalls.getMember(memberId)));

            setCardName(cardData.name);
            setCardDescription(cardData.desc);
            setCardDueDate(cardData.due);
            setCardLabels(cardData.labels);
            setCardComments(cardData.comments);
            setCardAttachments(cardData.attachments);
            setCardChecklists(cardData.checklists);
            setCardMembers(detailedMembersData);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchMembersInBoard = async () => {
        try {
            const boardData = await apiCalls.getBoard(card.idBoard);
            //console.log(JSON.stringify(boardData, null, 2));
            const boardMembers = await apiCalls.getMembersInBoard(boardData.id);
            //console.log(JSON.stringify(boardMembers, null, 2));
            const detailedMembersData = await Promise.all(boardMembers.map(member => apiCalls.getMember(member.id)));
            setMembersInBoard(detailedMembersData);
            //console.log(JSON.stringify(membersInBoard, null, 2));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCardDetails();
        fetchMembersInBoard();
    }, []);

    const handleDeleteCard = async (cardId) => {
        try {
            await apiCalls.deleteCard(cardId);
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdateCard = async ( newName) => {
        try {
            await apiCalls.updateCard(cardId, newName);
            getCardDetails();
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdateCardDescription = async (cardId, newDescription) => {
        try {
            await apiCalls.updateCardDescription(cardId, newDescription);
            getCardDetails();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssign = async (member) => {
        Alert.alert(
            "Invite User",
            `Are you sure you want to assign ${member.fullName} to ${card.name}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Confirm", 
                    onPress: async () => {
                        const response = await apiCalls.addMemberToCard(cardId, member.id);
                        //console.log(response.status);
                        if (response.status === 200) {
                            getCardDetails();
                            setModalVisible(false);
                        }
                        else {
                            Alert.alert('Error inviting user', response.message);
                        }
                    } 
                }
            ]
        );
    }

    const handleUnassign = async (member) => {
        Alert.alert(
            "Unassign User",
            `Are you sure you want to unassign ${member.fullName} from ${card.name}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: async () => {
                        const response = await apiCalls.removeMemberFromCard(cardId, member.id);
                        //console.log(response.status);
                        getCardDetails();
                        if (response.status === 200) {
                            getCardDetails();
                        }
                        else {
                            Alert.alert('Error unassigning user', response.message);
                        }
                    }
                }
            ]
        );
    }

    const confirmDeleteCard = (cardId) => {
        Alert.alert(
            "Delete Card",
            "Are you sure you want to delete this card?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "Confirm", onPress: () => handleDeleteCard(cardId), style: "destructive"}
            ],
            { cancelable: false }
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card containerStyle={styles.card}>
                <View style={styles.cardTitleContainer}>
                    {editName ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={cardName}
                                onChangeText={text => setCardName(text)}
                                onEndEditing={() => {handleUpdateCard(cardName); setEditName(false);}}
                                style={styles.input}
                            />
                            <Ionicons name="checkmark-circle" size={20} onPress={() => {handleUpdateCard(cardName), setEditName(false);}} />
                        </View>
                    ) : (
                        <>
                            <Text style={styles.subtitle}>{cardName}</Text>
                            <Ionicons name="pencil" size={20} onPress={() => setEditName(true)} />
                        </>
                    )}
                </View>
                <Text style={styles.cardTitle}>Description</Text>
                <TextInput
                    style={styles.cardText}
                    placeholder='Tap to add a description'
                    multiline={true}
                    returnKeyType='default'
                    onChangeText={text => setCardDescription(text)}
                    onEndEditing={() => handleUpdateCardDescription(card.id, cardDescription)}
                    value={cardDescription}
                />
                <Card.Divider />
                {/* <TextInput style={styles.cardText}>{cardDueDate}</TextInput>
                {cardLabels && cardLabels.map(label => (
                    <Badge key={label.id} value={label.name} badgeStyle={styles.badge} />
                ))} */}
                {cardMembers && (
                    <>
                        <Text style={styles.cardTitle}>Members</Text>
                        {cardMembers.map(member => (
                            <TouchableOpacity key={member.id} onPress={() => handleUnassign(member)}>
                                <View style={styles.memberDetails} key={member.id}>
                                    <Image source={{uri: member.avatarUrl + '/50.png' }} style={styles.profilePicture} />
                                    <View>
                                        <Text style={styles.memberName}>{member.fullName}</Text>
                                        <Text style={styles.memberUsername}>@{member.username}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <Button title="Assign a member" onPress={() => setModalVisible(true)} />
                        <Modal 
                            visible={modalVisible} 
                            animationType="slide"
                            transparent={true}
                        >
                            <View style={styles.modal}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Assign a member</Text>
                                    {membersInBoard.map(member => {
                                        const isAssigned = cardMembers.some(cardMember => cardMember.id === member.id);
                                        return (
                                            <TouchableOpacity key={member.id} onPress={() => handleAssign(member)}>
                                                <View style={styles.memberInfo} key={member.id}>
                                                    <View style={styles.memberDetails}>
                                                        <Image source={{uri: member.avatarUrl + '/50.png' }} style={styles.profilePicture} />
                                                        <View>
                                                            <Text style={styles.memberName}>{member.fullName}</Text>
                                                            <Text style={styles.memberUsername}>@{member.username}</Text>
                                                        </View>
                                                    </View>
                                                    {isAssigned ? <Ionicons name="checkmark-circle" size={20} color="green" /> : <Ionicons name="add-circle" size={20} color="blue" />}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                    <Button title="Close" onPress={() => setModalVisible(false)} />
                                </View>
                            </View>
                        </Modal>
                    </>
                )}
                {/* {cardComments && cardComments.map(comment => (
                    <ListItem key={comment.id} bottomDivider containerStyle={styles.listItem}>
                        <ListItem.Content>
                            <ListItem.Title style={styles.listItemTitle}>{comment.text}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
                {cardAttachments && cardAttachments.map(attachment => (
                    <ListItem key={attachment.id} bottomDivider containerStyle={styles.listItem}>
                        <ListItem.Content>
                            <ListItem.Title style={styles.listItemTitle}>{attachment.name}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
                {cardChecklists && cardChecklists.map(checklist => (
                    <ListItem key={checklist.id} bottomDivider containerStyle={styles.listItem}>
                        <ListItem.Content>
                            <ListItem.Title style={styles.listItemTitle}>{checklist.name}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))} */}
            </Card>
            <Button
                title="Delete"
                onPress={() => confirmDeleteCard(cardId)}
                color="red"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    card: {
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 16,
    },
    badge: {
        margin: 5,
    },
    listItem: {
        backgroundColor: '#fff',
    },
    listItemTitle: {
        fontSize: 16,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 5,
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        height: '70%', 
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 3,
    },
    memberDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberName: {
        fontSize: 16,
    },
    memberUsername: {
        fontSize: 14,
        color: '#888',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});