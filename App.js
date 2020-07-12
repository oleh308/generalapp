import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import io from 'socket.io-client';
import 'react-native-gesture-handler';
import SyncStorage from 'sync-storage';
import buildCall from './src/utils/api';
import useAppState from 'react-native-appstate-hook';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainTabs from './src/components/navigation/MainTabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LoginStack from './src/components/navigation/LoginStack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { MaterialIndicator } from 'react-native-indicators';
import { NavigationContainer } from '@react-navigation/native';
import { AuthenticationContext } from './src/context/AuthenticationContext';

import './src/utils/api.js';
Ionicons.loadFont();
FontAwesome.loadFont();
MaterialIcons.loadFont();

const API_URL = 'http://localhost:5000';

SyncStorage.set('apiUrl', API_URL);

const App: () => React$Node = () => {
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { appState } = useAppState();

  useEffect(() => {
    initSockets();
  }, [])

  useEffect(() => {
    init();
  }, [])

  function initSockets() {
    const socket = io(API_URL, {
      transports: ['websocket'],
      jsonp: false
    });
    socket.connect();

    setSocket(socket);
  }

  async function init() {
    const data = await SyncStorage.init();
    let token = SyncStorage.get('token');
    if (token) setAuthenticated(true);

    setLoading(false);
  }

  function getIsMentor() {
    return SyncStorage.get('is_mentor');
  }

  function getContent() {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <MaterialIndicator color="grey" />
        </View>
      )
    } else {
      return (
        <AuthenticationContext.Provider value={{
          setAuthenticated: setAuthenticated,
          api: buildCall(setAuthenticated),
          socket: socket
        }}>
          {authenticated ? <MainTabs isMentor={getIsMentor()}/>
            : <LoginStack />
          }
        </AuthenticationContext.Provider>
      )
    }
  }

  return (
    <NavigationContainer>
      {getContent()}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  }
});

export default App;
