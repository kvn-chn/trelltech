import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import Cards from './Cards';
import CardDetails from './CardDetails';
import { useNavigation } from '@react-navigation/native';
import CreateCardScreen from './CreateCardScreen';

export default function TabScreen() {
    const Stack = createStackNavigator();

    const navigation = useNavigation();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MyCards"
                component={Cards}
                options={{
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('CreateCard')}
                            style={{ marginRight: 20 }}
                        >
                            <Text style={{ fontSize: 32 }}>+</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen 
                name="CardDetails"
                component={CardDetails}
            />
            <Stack.Screen
                name="CreateCard"
                component={CreateCardScreen}
            />
        </Stack.Navigator>
    )
}