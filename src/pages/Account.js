import React, { useState, useEffect, useContext } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import SyncStorage from 'sync-storage';
import Layout from '../components/blocks/Layout';
import Profile from '../components/blocks/Profile';
import Loading from '../components/blocks/Loading';
import TopTabs from '../components/blocks/TopTabs';
import Settings from '../components/blocks/Settings';

import { useIsFocused } from '@react-navigation/native';
import { AuthenticationContext } from '../context/AuthenticationContext';

const options = ['Profile', 'Settings'];

function Account({ navigation }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const { api } = useContext(AuthenticationContext);
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();

  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) getUser();
  }, [isFocused]);

  async function getUser() {
    try {
      const data = (await api.get(apiUrl + '/api/users/' + user_id, config)).data;
      setUser(data);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        console.log('Account.js - getUser:', error.response.data);
      } else {
        console.log('Account.js - getUser:', error.message);
      }
    }
  }

  function update(data) {
    if (data) {
      setUser(data);
    } else {
      getUser();
    }
  }

  return (
    <Layout title={'Account'} isScroll={true} noPadding loading={loading}>
      <TopTabs options={options} tab={tab} setTab={setTab}/>
      {user && tab === 0 && <Profile
        user={user}
        update={update}
        isEditable={true}
        navigation={navigation}
      />}
      {user && tab === 1 && <Settings user={user} navigation={navigation} />}
    </Layout>
  )
}


const styles = StyleSheet.create({
  optionsContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  optionButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedOption: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  }
});

export default Account;
