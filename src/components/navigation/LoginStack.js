import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../../pages/login_pages/Login.js';
import Signup from '../../pages/signup_pages/Signup.js';
import LoginCountry from '../../pages/login_pages/LoginCountry.js';
import Confirmation from '../../pages/signup_pages/Confirmation.js';
import LoginInterests from '../../pages/login_pages/LoginInterests.js';
import MentorFeedback from '../../pages/signup_pages/MentorFeedback.js';

const Stack = createStackNavigator();

let stackDefault = [
  { name: 'Login', component: Login },
  { name: 'Signup', component: Signup },
  { name: 'Confirmation', component: Confirmation },
  { name: 'LoginInterests', component: LoginInterests },
  { name: 'LoginCountry', component: LoginCountry },
  { name: 'MentorFeedback', component: MentorFeedback }
]

function LoginStack() {
  const getScreens = () => {
    let stack = [...stackDefault];
    const screens = stack.slice();

    return screens.map((screen, index) => <Stack.Screen key={index} name={screen.name} component={screen.component} />)
  }

  return (
    <Stack.Navigator headerMode={'none'}>
      {getScreens()}
    </Stack.Navigator>
  );
}

export default LoginStack;
