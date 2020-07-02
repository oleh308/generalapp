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
import { useIsFocused } from '@react-navigation/native';
import TimelinePost from '../components/blocks/TimelinePost';
import { AuthenticationContext } from '../context/AutheticationContext';

function ProfilePage({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const { api } = useContext(AuthenticationContext);

  const { profile } = route.params;

  return (
    <Layout title={profile.name} goBack={() => navigation.goBack()} noPadding>
      <View style={styles.marginTop}/>
      <Profile isEditable={false} id={profile.id} navigation={navigation}/>
    </Layout>
  )
}

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 20
  }
});

export default ProfilePage;
