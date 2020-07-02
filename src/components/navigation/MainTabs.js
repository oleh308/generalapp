import React from 'react';
import {
  Text,
  StyleSheet
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProfileProvider } from '../../context/ProfileContext';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import getMainStack from './MainStack';

import Chats from '../../pages/Chats.js';
import Search from '../../pages/Search.js';
import Create from '../../pages/Create.js';
import Account from '../../pages/Account.js';
import Timeline from '../../pages/Timeline.js';

const Tab = createBottomTabNavigator();

function MainTabs({setAuthenticated}) {
  return (
    <ProfileProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'TimelineStack') { iconName = 'ios-list' }
            else if (route.name === 'SearchStack') { iconName = 'ios-search' }
            else if (route.name === 'ChatsStack') { iconName = 'ios-text' }
            else if (route.name === 'AccountStack') { iconName = 'ios-contact' }
            else if (route.name === 'CreateStack') { iconName = 'ios-create' }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabel: ({ focused, color }) => {
            return <Text style={[styles.tabLabel, { color }]}>{route.name.replace('Stack', '')}</Text>
          }
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          keyboardHidesTabBar: true
        }}
      >
        <Tab.Screen name="TimelineStack" component={getMainStack('Timeline')} />
        <Tab.Screen name="SearchStack" component={getMainStack('Search')} />
        <Tab.Screen name="CreateStack" component={getMainStack('Create')} />
        <Tab.Screen name="ChatsStack" component={getMainStack('Chats')} />
        <Tab.Screen name="AccountStack" component={getMainStack('Account')} />
      </Tab.Navigator>
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12
  }
})

export default MainTabs;
