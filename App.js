import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

Ionicons.loadFont();

import SyncStorage from 'sync-storage';
import buildCall from './src/utils/api';
import { MaterialIndicator } from 'react-native-indicators';
import MainTabs from './src/components/navigation/MainTabs';
import LoginStack from './src/components/navigation/LoginStack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthenticationContext } from './src/context/AutheticationContext';
import './src/utils/api.js';

SyncStorage.set('apiUrl', 'http://localhost:5000');

const App: () => React$Node = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    init();
  }, [])

  async function init() {
    const data = await SyncStorage.init();
    let token = SyncStorage.get('token');
    if (token) setAuthenticated(true);

    setLoading(false);
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
          api: buildCall(setAuthenticated)
        }}>
          {authenticated ? <MainTabs />
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
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
