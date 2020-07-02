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
import { useIsFocused } from '@react-navigation/native';
import { AuthenticationContext } from '../context/AutheticationContext';

const options = ['Public', 'Private'];

function Chats({ navigation, route }) {
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const { furtherNavigate } = route.params ? route.params : {};

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const isFocused = useIsFocused();

  const [tab, setTab] = useState(0);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, [isFocused]);

  useEffect(() => {
    if (furtherNavigate) {
      navigation.navigate('SingleChat', { id: furtherNavigate });
    }
  }, [route.params])

  async function fetchChats() {
    try {
      const data = (await api.get(apiUrl + '/api/chats', config)).data;
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

  function getChats(type) {
    return chats.filter(chat => chat.type === type).map((chat, index) => {
      return (
        <TouchableOpacity key={index} style={styles.chatContainer} onPress={() => navigateChat(chat)}>
          <Image style={styles.chatImage} source={{ uri: getImageUri(chat.host.image, apiUrl) }} />
          <View style={styles.chatText}>
            <Text style={styles.chatName}>{getName(chat.host)}</Text>
            <Text>{'Nothing'}</Text>
          </View>
          <View style={styles.dotContainer}>
            {/*chat.isNew && <View style={styles.messageDot}/>*/}
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
    flexDirection: 'row',
  },
  chatImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5
  },
  chatText: {
    marginLeft: 10
  },
  chatName: {
    fontSize: 18,
    marginTop: '2%',
    marginBottom: '1%',
    fontWeight: 'bold'
  },
  dotContainer: {
    flex: 1,
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
