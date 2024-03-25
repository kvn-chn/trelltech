import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackScreen from './components/StackScreen';
import Cards from './components/Cards';
import TabScreen from './components/TabScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Workspace') {
              iconName = focused ? 'clipboard' : 'clipboard-outline';
            } else if (route.name === 'My Cards') {
              iconName = focused ? 'albums' : 'albums-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarActiveTintColor="blue"
        tabBarInactiveTintColor="gray"
      >
        <Tab.Screen name="Workspace" component={StackScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="My Cards" component={TabScreen} options={{headerShown: false}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}