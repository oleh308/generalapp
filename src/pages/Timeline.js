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
import { AuthenticationContext } from '../context/AuthenticationContext';

function Timeline({ navigation }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();
  const { api, socket } = useContext(AuthenticationContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchData();
  }, []);

  useEffect(() => {
    if (socket.connected && following.length > 0) {
      socket.emit('timeline_init', { mentors: following });
      socket.on('update', data => {
        fetchUser();
        fetchData();
      });
    }
  }, [socket.connected, following]);

  function refresh() {
    setPosts([...posts])
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
      setFollowing(data.following);
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
