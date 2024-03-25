import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView, Modal,FlatList, Image, Button } from 'react-native';
import * as apiCalls from '../apiCalls';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BoardOptions({ route, navigation}) {
    const { board, boardId } = route.params;
    const [boardName, setBoardName] = useState(board.name);
    const [members, setMembers] = useState([]);
    const [workspace, setWorkspace] = useState(null);
    const [background, setBackground] = useState(null);
    const [modalMemberVisible, setModalMemberVisible] = useState(false);   
    const [searchInput, setSearchInput] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [membersInWorkspace, setMembersInWorkspace] = useState([]);
    const [modalMemberDetailsVisible, setModalMemberDetailsVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        navigation.setOptions({ title: 'Board Options' });
        fetchBoardDetails();
        fetchBoardMembers();
    }, [board]);

    const fetchMembers = async () => {
        const membersData = await apiCalls.getWorkspaceMembers(board.idOrganization);
        const detailedMembersData = await Promise.all(membersData.map(member => apiCalls.getMember(member.id)));
        setMembersInWorkspace(detailedMembersData);
        setFilteredMembers(detailedMembersData);
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchBoardDetails = async () => {
        try {
            const boardDetails = await apiCalls.getBoard(boardId);
            setWorkspace(boardDetails.workspace);
            setBackground(boardDetails.background);
        } catch (error) {
            Alert.alert('Error fetching board details', error.message);
        }
    };
    const fetchBoardMembers = async () => {
        try {
            const boardMembers = await apiCalls.getMembersInBoard(boardId);
            const detailedMembersData = await Promise.all(boardMembers.map(member => apiCalls.getMember(member.id)));
            setMembers(detailedMembersData);
        } catch (error) {
            Alert.alert('Error fetching board members', error.message);
        }
    };

    const handleSave = async () => {
        try {
            await apiCalls.updateBoard(boardId, boardName);
            navigation.navigate('Workspaces');
        } catch (error) {
            Alert.alert('Error updating board', error.message);
        }
    };

    const handleInvite = async (member) => {
        Alert.alert(
            "Invite User",
            `Are you sure you want to invite ${member.fullName}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Confirm", 
                    onPress: async () => {
                        const response = await apiCalls.addMemberToBoard(boardId, member.id);
                        //console.log(response.status);
                        if (response.status === 200) {
                            fetchBoardMembers();
                            setModalMemberVisible(false);
                        }
                        else {
                            Alert.alert('Error inviting user', response.message);
                        }
                    } 
                }
            ]
        );
    };

    useEffect(() => {
        handleSearch(searchInput);
    }, [members, searchInput]);

    const handleSearch = async (input) => {
        if (input.trim() !== '') {
            const results = await apiCalls.searchMembers(input);
            setFilteredMembers(results);
        } else {
            setFilteredMembers(membersInWorkspace);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Delete Board",
            "Are you sure you want to delete this board?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Confirm", 
                    style: "destructive",
                    onPress: async () => {
                        const response = await apiCalls.deleteBoard(boardId);

                        if (response.status === 200) {
                            navigation.navigate('Workspaces');
                        }
                        else {
                            Alert.alert('Error deleting board', response.message);
                        }
                    } 
                }
            ]
        );
    };

    const handleRemoveMember = async (member) => {
        Alert.alert(
            "Remove Member",
            `Are you sure you want to remove ${member.fullName} from this board?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Confirm", 
                    style: "destructive",
                    onPress: async () => {
                        const response = await apiCalls.removeMemberFromBoard(boardId, member.id);
                        if (response.status === 200) {
                            setModalMemberDetailsVisible(false);
                            fetchBoardMembers();
                        }
                        else {
                            Alert.alert('Error removing member', response.message);
                        }
                    } 
                }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Board Name</Text>
            <TextInput
                style={styles.input}
                value={boardName}
                onChangeText={setBoardName}
                onSubmitEditing={handleSave}
            />
            <Text style={styles.subtitle}>
                <Ionicons name="person-outline" size={22} color="black" />
                Members ({members.length})
            </Text> 
            <FlatList
                data={members}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {setSelectedMember(item); setModalMemberDetailsVisible(true);}}>
                        <View style={styles.member}>
                            <View style={styles.memberDetails}>
                                <Image source={{ uri: item.avatarUrl + '/50.png' }} style={styles.profilePicture} />
                                <View>
                                    <Text style={styles.memberName}>{item.fullName}</Text>
                                    <Text style={styles.memberUsername}>@{item.username}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalMemberDetailsVisible}
            >
                <View style={styles.modalMember}>
                    <View style={styles.modalMemberContent}>
                        <Text style={styles.modalTitle}>Member Details</Text>
                        {selectedMember && (
                            <View style={styles.memberInfo}>
                                <Image source={{ uri: selectedMember.avatarUrl + '/50.png' }} style={styles.profilePicture} />
                                <View>
                                    <Text style={styles.memberName}>{selectedMember.fullName}</Text>
                                    <Text style={styles.memberUsername}>@{selectedMember.username}</Text>
                                </View>
                            </View>
                        )}
                        <Button title="Remove Member" onPress={() => handleRemoveMember(selectedMember)} />
                        <Button title="Close" onPress={() => {setModalMemberDetailsVisible(false); setSelectedMember(null);}} />
                    </View>
                </View>
            </Modal>
            <Button title="Invite" onPress={() => setModalMemberVisible(true)} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalMemberVisible}
            >
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Invite a user</Text>
                        <TextInput
                            value={searchInput}
                            onChangeText={setSearchInput}
                            placeholder="Invite by name, username, or email"
                            style={styles.input}
                        />
                        <FlatList
                            data={filteredMembers}
                            renderItem={({ item }) => {
                                const isAssigned = members.some(member => member.id === item.id);
                                return (
                                    <TouchableOpacity onPress={() => handleInvite(item)}>
                                        <View style={styles.memberInfo}>
                                            <View style={styles.memberDetails}>
                                                <Image source={{uri: item.avatarUrl + '/50.png' }} style={styles.profilePicture} />
                                                <View>
                                                    <Text style={styles.memberName}>{item.fullName}</Text>
                                                    <Text style={styles.memberUsername}>@{item.username}</Text>
                                                </View>
                                            </View>    
                                            {isAssigned && <Ionicons name="checkmark-circle" size={22} color="green" />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={item => item.id}
                        />
                        <Button title="Invite" onPress={handleInvite} />
                        <Button title="Cancel" onPress={() => {setModalMemberVisible(false), setSearchInput(''), setFilteredMembers(membersInWorkspace)}} />
                    </View>
                </View>
            </Modal>
            <Button title="Delete" onPress={handleDelete} color="red" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    member: {
        marginTop: 10,
    },
    memberName: {
        fontSize: 16,
    },
    memberUsername: {
        fontSize: 14,
        color: '#888',
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
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    modalMember: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
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
        width: '90%',
        height: '70%', 
    },
    modalMemberContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        height: '40%',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});