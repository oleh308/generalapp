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
import TimelinePost from '../components/blocks/TimelinePost';

import { useIsFocused } from '@react-navigation/native';
import { AuthenticationContext } from '../context/AutheticationContext';

function Timeline({ navigation }) {
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();

  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  // useEffect(() => {
  //   fetchData();
  //   fetchUser();
  // }, []);

  useEffect(() => {
    if (isFocused) {
      fetchData();
      fetchUser();
    }
  }, [isFocused])

  function refresh() {
    setPosts([...posts])
  }

  function setupSockets(following) {
    const socket = io(apiUrl, {
      transports: ['websocket'],
      jsonp: false
    });
    socket.connect();
    socket.on('connect', () => {
      socket.emit('timeline_init', { mentors: following });
      console.log('connected to socket server');
    });
    socket.on('update', data => {
      fetchData();
      console.log('update requested', data);
    });

    setSocket(socket);
  }

  const fetchData = async () => {
    try {
      const data = (await api.get(apiUrl + '/api/posts', config)).data;
      setPosts(data);
    } catch (error) {
      if (error.response) {
        console.log('Timeline - fetchData:', error.response.data);
      } else {
        console.log('Timeline - fetchData:', error.message);
      }
    }
  }

  const fetchUser = async () => {
    try {
      const data = (await api.get(apiUrl + '/api/users/' + user_id, config)).data;
      setupSockets(data.following);
    } catch (error) {
      if (error.response) {
        console.log('Timeline - fetchUser:', error.response.data);
      } else {
        console.log('Timeline - fetchUser:', error.message);
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
