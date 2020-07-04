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
import { useIsFocused } from '@react-navigation/native';
import TimelinePost from '../components/blocks/TimelinePost';
import { AuthenticationContext } from '../context/AutheticationContext';

function Timeline({ navigation }) {
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    setupSocket();
  }, []);

  useEffect(() => {
    if (isFocused) fetchData();
  }, [isFocused])

  function refresh() {
    setPosts([...posts])
  }

  const setupSocket = () => {
    const socket = io(apiUrl, {
      transports: ['websocket'],
      jsonp: false
    });
    socket.connect();
    socket.on('connect', () => {
      socket.emit('message', 'test');
      console.log('connected to socket server');
    });
  }

  const fetchData = async () => {
    try {
      const data = (await api.get(apiUrl + '/api/posts', config)).data;
      setPosts(data);
    } catch (error) {
      if (error.response) {
        console.log('Timeline - fetchData2:', error.response.data);
      } else {
        console.log('Timeline - fetchData2:', error.message);
      }
    }
  }

  const generateList = () => {
    return posts.map((post, index) => {
      return <TimelinePost key={index} post={post} navigation={navigation} refresh={refresh}/>
    })
  }

  return (
    <Layout title={'Your network'}>
      {generateList()}
      <View style={styles.gap}/>
    </Layout>
  )
}

const styles = StyleSheet.create({
  gap: {
    height: 75
  }
});

export default Timeline;
