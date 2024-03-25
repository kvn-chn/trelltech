import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import Workscapes from './Workspaces';
import WorkspaceDetails from './WorkspaceDetails';
import WorkspaceOptions from './WorkspaceOptions';
import BoardDetails from './BoardDetails';
import CardDetails from './CardDetails';
import CreateBoardScreen from './CreateBoardScreen';
import CreateWorkspaceScreen from './CreateWorkspaceScreen';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import BoardOptions from './BoardOptions';

export default function BoardsStack() {
  const Stack = createStackNavigator();

  const navigation = useNavigation();

  const handleMenuSelect = (value) => {
    navigation.navigate(value);
  };

  return (
    <MenuProvider>
      <Stack.Navigator
        // screenOptions={{
        //   gestureEnabled: true,
        //   gestureDirection: 'horizontal',
        // }}
      > 
        <Stack.Screen 
          name="Workspaces" 
          component={Workscapes} 
          options={{
            headerRight: () => (
              <Menu onSelect={handleMenuSelect}>
                <MenuTrigger testID="menu-trigger">
                  <Text style={{ fontSize: 32, marginRight: 20 }}>+</Text>
                </MenuTrigger>
                <MenuOptions customStyles={{ optionsContainer: { borderRadius: 10, marginTop: 30, width: 200 } }}>
                <MenuOption value="Create new board">
                  <Text style={{ fontSize: 14, padding: 10 }}>Create New Board</Text>
                </MenuOption>

                  <MenuOption value="Create new workspace">
                    <Text style={{ fontSize: 14, padding: 10 }}>Create New Workspace</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            ),
          }}
        />
        <Stack.Screen
          name="WorkspaceDetails"
          component={WorkspaceDetails}
          options={({ route, navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('WorkspaceOptions', { 
                workspace: route.params.workspace, 
                workspaceId: route.params.workspaceId 
              })}>
                <Ionicons name="ellipsis-horizontal" size={24} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="WorkspaceOptions"
          component={WorkspaceOptions}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            gestureEnabled: true,
            gestureDirection: 'vertical',
            title: null,
          }}
        />
        <Stack.Screen 
          name="BoardDetails" 
          component={BoardDetails} 
          options={({ route, navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('BoardOptions', { 
                board: route.params.board, 
                boardId: route.params.boardId 
              })}>
                <Ionicons name="ellipsis-horizontal" size={24} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="BoardOptions"
          component={BoardOptions}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            gestureEnabled: true,
            gestureDirection: 'vertical',
            title: null,
          }}
        />
        <Stack.Screen 
          name="Create new board" 
          component={CreateBoardScreen} 
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name="Create new workspace"
          component={CreateWorkspaceScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name="CardDetails"
          component={CardDetails}
          options={({ route, navigation }) => ({ 
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                      }),
                    },
                  ],
                },
              };
            },
          })}
        />
      </Stack.Navigator>
    </MenuProvider>
  );
}