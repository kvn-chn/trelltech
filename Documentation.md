# Project Documentation

## Overview
This project appears to be a task or project management application. It allows users to view workspaces and boards within those workspaces. Each board contains lists, which are displayed when a board is selected.

## Components
# Workspaces
The Workspaces component is responsible for fetching and displaying the workspaces and their associated boards and lists.

## Fetching Workspaces
The getWorkspaces function is an asynchronous function that fetches the workspaces from the API. For each workspace, it fetches the boards within that workspace. For each board, it fetches the lists within that board. The fetched workspaces, boards, and lists are stored in the workspaces state variable.

The getWorkspaces function is called whenever the Workspaces component is focused, thanks to the useFocusEffect hook from @react-navigation/native.

## Rendering Workspaces
The renderItem function is responsible for rendering each workspace. It checks if the workspace has any boards. If it does, it renders a TouchableOpacity for the workspace title, which navigates to the WorkspaceDetails screen when pressed. It also maps over the boards in the workspace and renders a TouchableOpacity for each board, which navigates to the BoardDetails screen when pressed. Each board is displayed as a Card from react-native-elements, with the board's lists displayed within the card.

The renderItem function is passed to the FlatList component's renderItem prop, which means it is called for each item in the workspaces array.

## Styles
The styles object defines the styles for the various elements of the Workspaces component. It uses React Native's StyleSheet.create method to create the styles. The styles include container, workspaceTitle, boardTitle, cardContainer, cardWrapper, listItem, and listTitle.

## Navigation
The Workspaces component receives a navigation prop from React Navigation. This prop is used to navigate to the WorkspaceDetails screen when a workspace title is pressed, and to the BoardDetails screen when a board is pressed. The workspace or board and its ID are passed as parameters to the navigate function.


# StackScreen 
The StackScreen component is the main navigation component of the application. It uses the createStackNavigator function from @react-navigation/stack to create a stack navigator.

# Menu
The StackScreen component uses the Menu, MenuOptions, MenuOption, MenuTrigger, and MenuProvider components from react-native-popup-menu to create a menu that is displayed in the header of the Workspaces screen. The menu has two options: "Create New Board" and "Create New Workspace". When an option is selected, the handleMenuSelect function is called with the value of the selected option, which is used to navigate to the corresponding screen.

# Screens
The StackScreen component defines several screens in the stack navigator:

* Workspaces: This screen displays the workspaces and their associated boards and lists. It has a menu in the header that allows the user to create a new board or workspace.

* WorkspaceDetails: This screen displays the details of a workspace. It has a button in the header that navigates to the WorkspaceOptions screen.

* WorkspaceOptions: This screen displays the options for a workspace. It is displayed as a modal.

* BoardDetails: This screen displays the details of a board. It has a button in the header that navigates to the BoardOptions screen.

* BoardOptions: This screen displays the options for a board. It is displayed as a modal.

* Create new board: This screen allows the user to create a new board. It is displayed as a modal.

* Create new workspace: This screen allows the user to create a new workspace. It is displayed as a modal.

* CardDetails: This screen displays the details of a card. It is displayed as a modal that slides in from the right side of the screen.

Each screen is associated with a component that is responsible for rendering the screen's content. The options prop is used to configure the screen's options, such as the header and the transition animation.