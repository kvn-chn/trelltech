// Mocking modules
// The first part of the file is setting up mocks for certain modules that your App component uses. Mocking is a technique to isolate your tests from external factors or dependencies.

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon'); // This mock replaces the Ionicons component from react-native-vector-icons with a dummy component. This is because Jest runs in a Node environment and doesn't understand native modules.
jest.mock('@react-navigation/bottom-tabs', () => ({ // This mock replaces the createBottomTabNavigator function from @react-navigation/bottom-tabs with a function that returns an object with Navigator and Screen properties. This is because your App component uses createBottomTabNavigator to create a tab navigator, and you need to provide a mock implementation for it in your tests.
    createBottomTabNavigator: () => ({ // This is the mock implementation for createBottomTabNavigator. It returns an object with Navigator and Screen properties.
        Navigator: jest.fn(),
        Screen: jest.fn(),
    }),
}));
jest.mock('@react-navigation/native', () => { // This mock replaces the useNavigation hook from @react-navigation/native with a function that returns an object with a navigate function. This is because your App component likely uses useNavigation to navigate between screens, and you need to provide a mock implementation for it in your tests.
    return {
        ...jest.requireActual('@react-navigation/native'), // This line imports the actual module and spreads its properties into the mock object. This is necessary to ensure that other functions from @react-navigation/native work as expected.
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
    };
});

// Import the necessary modules for the test
// The next part of the file is importing the modules you need for your tests. This includes React (for writing JSX), @testing-library/react-native (for rendering components and making assertions), and your App component.

import React from 'react';
import { render } from '@testing-library/react-native';

import App from '../App'; 

// Write the test

describe('App', () => { // This is the test suite for the App component. It contains one test case that checks if the component renders without crashing.
    it('renders without crashing', () => { // This is the test case that checks if the App component renders without crashing.
        render(<App />); // This renders the App component using the render function from @testing-library/react-native.
    });
});