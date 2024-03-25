import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as apiCalls from '../apiCalls'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function WorkspaceOptions({ route }) {
    const { workspace, workspaceId } = route.params;

    const [members, setMembers] = useState([]);
    //const [email, setEmail] = useState('');
    const [workspaceName, setWorkspaceName] = useState(workspace.displayName);
    const [modalMemberVisible, setModalMemberVisible] = useState(false);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [membersInWorkspace, setMembersInWorkspace] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [modalMemberDetailsVisible, setModalMemberDetailsVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [editName, setEditName] = useState(false);

    const navigation = useNavigation();

    const fetchMembers = async () => {
        const membersData = await apiCalls.getWorkspaceMembers(workspaceId);
        const detailedMembersData = await Promise.all(membersData.map(member => apiCalls.getMember(member.id)));
        setMembers(detailedMembersData);
        setFilteredMembers(detailedMembersData);
        //console.log(JSON.stringify(detailedMembersData, null, 2));
    };

    useEffect(() => {
        navigation.setOptions({ title: 'Workspace options' });
        fetchMembers();
    }, []);

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
                        const response = await apiCalls.addMemberToWorkspace(workspaceId, member.id);
                        if (response.status === 200) {
                            setModalMemberVisible(false);
                            fetchMembers();
                        }
                    } 
                }
            ]
        );
    };

    const handleRemoveMember = async (member) => {
        Alert.alert(
            "Remove Member",
            `Are you sure you want to remove ${member.fullName}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Confirm", 
                    style: "destructive",
                    onPress: async () => {
                        const response = await apiCalls.removeMemberFromWorkspace(workspaceId, member.id);
                        if (response.status === 200) {
                            fetchMembers();
                            setModalMemberDetailsVisible(false);
                        }
                    } 
                }
            ]
        );
    };

    const handleUpdateName = async () => {
        await apiCalls.updateWorkspaceName(workspaceId, workspaceName);
        navigation.navigate('Workspaces');
    };

    const handleDelete = async () => {
        Alert.alert(
            "Delete Workspace",
            "Are you sure you want to delete this workspace?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Confirm",
                    style: "destructive", 
                    onPress: async () => {
                        await apiCalls.deleteWorkspace(workspaceId);
                        navigation.navigate('Workspaces');
                    } 
                }
            ]
        );
    };

    useEffect(() => {
        handleSearch(searchInput);
    }, [members, searchInput]);

    const handleSearch = async (inputMember) => {
        if (inputMember.trim() !== '') {
            const results = await apiCalls.searchMembers(inputMember);
            setFilteredMembers(results);
        } else {
            setFilteredMembers(membersInWorkspace);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.cardTitleContainer}>
                    {editName ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={workspaceName}
                                onChangeText={text => setWorkspaceName(text)}
                                onEndEditing={() => {handleUpdateName(workspaceName); setEditName(false);}}
                                style={styles.inputName}
                            />
                            <Ionicons name="checkmark-circle" size={20} onPress={() => {handleUpdateName(workspaceName); setEditName(false);}} />
                        </View>
                    ) : (
                        <>
                            <Text style={styles.subtitle}>{workspaceName}</Text>
                            <Ionicons name="pencil" size={20} onPress={() => setEditName(true)} />
                        </>
                    )}
                </View>
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
                            <View style={styles.memberDetails}>
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
            <Button title="Invite a member" onPress={() => setModalMemberVisible(true)} />
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
                            style={styles.inputMember}
                        />
                        <FlatList
                            data={filteredMembers}
                            renderItem={({ item }) => {
                                const isAdded = members.some(member => member.id === item.id);
                                return (
                                    <TouchableOpacity onPress={() => handleInvite(item)}>
                                        <View style={styles.memberInfo}>
                                            <View style={styles.memberDetails}>
                                                <View>
                                                    <Text style={styles.memberName}>{item.fullName}</Text>
                                                    <Text style={styles.memberUsername}>@{item.username}</Text>
                                                </View>
                                            </View>
                                            {isAdded && <Ionicons name="checkmark-circle" size={22} color="green" />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={item => item.id}
                        />
                        <Button title="Cancel" onPress={() => {setModalMemberVisible(false) , setSearchInput('')}} />
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    member: {
        marginBottom: 10,
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
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
    },
    button: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
    },
    modalMemberContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        height: '40%',
    },
    modalMember: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    inputMember: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    inputName: {
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
    },

    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});