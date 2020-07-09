import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import io from 'socket.io-client';
import SyncStorage from 'sync-storage';
import Layout from '../components/blocks/Layout';
import postsData from '../placeholders/postsData';
import Profile from '../components/blocks/Profile';
import TimelinePost from '../components/blocks/TimelinePost';

import { useIsFocused } from '@react-navigation/native';
import { AuthenticationContext } from '../context/AuthenticationContext';

function ProfilePage({ navigation, route }) {
  const { profile } = route.params;

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
      const data = (await api.get(apiUrl + '/api/users/' + profile._id, config)).data;
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
    <Layout title={user ? user.name : 'Loading'} goBack={() => navigation.goBack()} noPadding loading={loading}>
      <View style={styles.marginTop}/>
      {user && <Profile isEditable={false} user={user} navigation={navigation}/>}
    </Layout>
  )
}

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 20
  }
});

export default ProfilePage;
