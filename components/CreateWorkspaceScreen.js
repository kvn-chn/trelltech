// CreateWorkspaceScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as apiCalls from '../apiCalls';

export default function CreateWorkspaceScreen() {
    const [workspaceName, setWorkspaceName] = useState('');
    const navigation = useNavigation();

    const handleCreateWorkspace = async () => {
        if (!workspaceName.trim()) {
            alert('Workspace name is required');
            return;
        }

        try {
            const response = await apiCalls.createWorkspace(workspaceName);
            if (response.status === 200) {
                navigation.navigate("Workspaces");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Workspace name</Text>
            <TextInput
                style={styles.input}
                value={workspaceName}
                onChangeText={setWorkspaceName}
                placeholder="Workspace Name"
            />
            <Button title="Create Workspace" onPress={handleCreateWorkspace} />
        </View>
    );
}

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
});