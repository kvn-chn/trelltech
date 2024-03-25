import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import BoardsStack from '../components/StackScreen';

jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useNavigation: jest.fn().mockReturnValue({
            navigate: jest.fn(),
        }),
    };
});

describe('BoardsStack', () => {
    it('renders without crashing', () => {
        render(
            <NavigationContainer>
                <BoardsStack />
            </NavigationContainer>
        );
    });

    it('renders menu trigger', () => {
        const { getByTestId } = render(
            <NavigationContainer>
                <BoardsStack />
            </NavigationContainer>
        );
        const menuTrigger = getByTestId('menu-trigger');
        expect(menuTrigger).toBeDefined();
      });
});

