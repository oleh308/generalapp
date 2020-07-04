import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import SyncStorage from 'sync-storage';
import Layout from '../components/blocks/Layout';
import TopTabs from '../components/blocks/TopTabs';
import Loading from '../components/blocks/Loading';
import { getImageUri, getName } from '../utils/user';
import UserImage from '../components/blocks/UserImage';
import { useIsFocused } from '@react-navigation/native';
import { AuthenticationContext } from '../context/AutheticationContext';

const options = ['Public', 'Private'];

function Chats({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const isFocused = useIsFocused();
  const { api } = useContext(AuthenticationContext);

  const [tab, setTab] = useState(0);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) fetchChats();
  }, [isFocused]);

  useEffect(() => {
    const chatRedirect = SyncStorage.get('chatRedirect');

    if (chatRedirect) {
      const id = chatRedirect;
      SyncStorage.remove('chatRedirect');
      navigation.navigate('SingleChat', { id: id });
    }
  }, [])

  async function fetchChats() {
    try {
      const data = (await api.get(apiUrl + '/api/chats', config)).data;
      console.log(data);
      setChats(data);
    } catch (error) {
      if (error.response) {
        console.log('Chats.js - fetchChats:', error.response.data);
      } else {
        console.log('Chats.js - fetchChats:', error.message);
      }
    }
    setLoading(false);
  }

  function navigateChat(chat) {
    navigation.navigate('SingleChat', { id: chat._id });
  }

  function getText(text) {
    let maxlimit = 30;
    return ((text).length > maxlimit) ? (((text).substring(0,maxlimit-3)) + '...') : text
  }

  function getLastMessage(chat) {
    if (chat.last_message) {
      if (chat.last_message.text.trim() !== '') {
        return chat.last_message.text;
      } else if (chat.last_message.images.length > 0) {
        return chat.last_message.images.length + ' images'
      } else {
        return ''
      }
    } else {
      return '';
    }
  }

  function getChats(type) {
    return chats.filter(chat => chat.type === type).map((chat, index) => {
      let hasNew = false;
      if (chat.last_message && chat.last_seen_message) {
        hasNew = chat.last_message._id !== chat.last_seen_message._id;
      }

      return (
        <TouchableOpacity key={index} style={styles.chatContainer} onPress={() => navigateChat(chat)}>
          <UserImage image={chat.host.image} height={75}/>
          <View style={styles.chatText}>
            <Text style={styles.chatName}>{getName(chat.host)}</Text>
            <Text>{getLastMessage(chat)}</Text>
          </View>
          <View style={styles.dotContainer}>
            {hasNew && <View style={styles.messageDot}/>}
          </View>
        </TouchableOpacity>
      )
    })
  }

  return (
    <Layout title={'Chats'} loading={loading} noPadding>
      <TopTabs options={options} tab={tab} setTab={setTab}/>
      <View style={styles.chatsContainer}>
        {getChats(tab === 0 ? 'public' : 'private')}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  chatsContainer: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  chatContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  chatImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5
  },
  chatText: {
    flex: 1,
    marginLeft: 10
  },
  chatName: {
    fontSize: 18,
    marginTop: '2%',
    marginBottom: '1%',
    fontWeight: 'bold'
  },
  dotContainer: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'grey'
  }
});

export default Chats;
