import React from 'react';
import Post from '../../pages/Post';
import Search from '../../pages/Search';
import Create from '../../pages/Create';
import AddTag from '../../pages/AddTag';
import Account from '../../pages/Account';
import Timeline from '../../pages/Timeline';
import Chats from '../../pages/chat_pages/Chats';
import ChangeAbout from '../../pages/ChangeAbout';
import ProfilePage from '../../pages/ProfilePage';
import Products from '../../pages/product_pages/Products';
import SingleChat from '../../pages/chat_pages/SingleChat';
import AddProduct from '../../pages/product_pages/AddProduct';
import ChatSettings from '../../pages/chat_pages/ChatSettings';
import ChatProducts from '../../pages/product_pages/ChatProducts';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const stackDefault = [
  { name: 'Post', component: Post },
  { name: 'Chats', component: Chats },
  { name: 'Search', component: Search },
  { name: 'Create', component: Create },
  { name: 'AddTag', component: AddTag },
  { name: 'Account', component: Account },
  { name: 'Products', component: Products },
  { name: 'Timeline', component: Timeline },
  { name: 'SingleChat', component: SingleChat },
  { name: 'AddProduct', component: AddProduct },
  { name: 'ProfilePage', component: ProfilePage },
  { name: 'ChangeAbout', component: ChangeAbout },
  { name: 'ChatSettings', component: ChatSettings },
  { name: 'ChatProducts', component: ChatProducts }
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
