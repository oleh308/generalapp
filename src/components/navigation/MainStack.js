import React from 'react';
import Post from '../../pages/Post.js';
import Chats from '../../pages/Chats.js';
import Search from '../../pages/Search.js';
import Create from '../../pages/Create.js';
import AddTag from '../../pages/AddTag.js';
import Account from '../../pages/Account.js';
import Timeline from '../../pages/Timeline.js';
import ChangeAbout from '../../pages/ChangeAbout.js';
import ProfilePage from '../../pages/ProfilePage.js';
import SingleChat from '../../pages/chat_pages/SingleChat';
import ChatSettings from '../../pages/chat_pages/ChatSettings';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const stackDefault = [
  { name: 'Post', component: Post },
  { name: 'Chats', component: Chats },
  { name: 'Search', component: Search },
  { name: 'Create', component: Create },
  { name: 'AddTag', component: AddTag },
  { name: 'Account', component: Account },
  { name: 'Timeline', component: Timeline },
  { name: 'SingleChat', component: SingleChat },
  { name: 'ProfilePage', component: ProfilePage },
  { name: 'ChangeAbout', component: ChangeAbout },
  { name: 'ChatSettings', component: ChatSettings }
]

const getMainStack = (firstPage) => {
  return function MainStack() {
    const getScreens = () => {
      let stack = [...stackDefault];
      const screens = stack.slice();

      if (stack[0].name !== firstPage) {
        let index = 0;
        for (let i = 0; i < stack.length; i++) {
          if (stack[i].name === firstPage) index = i;
        }
        screens[0] = stack[index];
        screens[index] = stack[0];
      }

      return screens.map((screen, index) => <Stack.Screen key={index} name={screen.name} component={screen.component} />)
    }

    return (
      <Stack.Navigator headerMode={'none'}>
        {getScreens()}
      </Stack.Navigator>
    );
  }
}


export default getMainStack;
