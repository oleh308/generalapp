import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';
import { groupBy } from 'lodash';
import SyncStorage from 'sync-storage';
import useKeyboard from '@rnhooks/keyboard';
import Layout from '../../components/blocks/Layout';
import ImagePicker from 'react-native-image-picker';
import DateInfo from '../../components/messages/DateInfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextMessages from '../../components/messages/TextMessages';
import MyTextMessages from '../../components/messages/MyTextMessages';
import { AuthenticationContext } from '../../context/AutheticationContext';

function SingleChat({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const { id } = route.params ? route.params : {};

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const scrollView = useRef(null);
  const [visible, dismiss] = useKeyboard();
  const { api } = useContext(AuthenticationContext);

  const [chat, setChat] = useState(null);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) fetchChat();
    else setLoading(false);
  }, [])

  useEffect(() => {
    if (scrollView.current) {
      scrollView.current.scrollToEnd({animated: true});
    }
  }, [visible])

  async function fetchChat() {
    try {
      const data = (await api.get(apiUrl + '/api/chats/' + id, config)).data;
      setChat(data);
    } catch (error) {
      if (error.response) {
        console.log('SingleChat.js - fetchChat:', error.response.data);
      } else {
        console.log('SingleChat.js - fetchChat:', error.message);
      }
    }

    setLoading(false);
  }

  async function sendMessage() {
    try {
      if (!message && images.length === 0) return;

      const body = new FormData();
      body.append('text', message);

      images.forEach((image, index) => {
        const ext = image.type ? image.type.split('/').pop() : 'png';

        body.append("file[]", {
          type: image.type,
          name: 'image' + index + '.' + ext,
          uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", "")
        });
      })

      const data = (await api.post(apiUrl + '/api/chats/messages/' + id, body, config)).data;
      fetchChat();
      setMessage('');
      setImages([]);
    } catch (error) {
      if (error.response) {
        console.log('SingleChat - sendMessage:', error.response.data);
      } else {
        console.log('SignleChat - sendMessage:', error.message);
      }
    }
  }

  function chooseImage() {
    if (images.length >= 5) return;
    const options = {
      noData: true
    }

    ImagePicker.launchImageLibrary(options, async response => {
      if (response.uri) {
        setImages([...images, response]);
      }
    })
  }

  function removeImage(index) {
    images.splice(index, 1);

    setImages([...images]);
  }

  function goBack() {
    navigation.goBack()
  }

  function getMessages() {
    if (!chat || !chat.messages) return void(0);

    let blocks = [];
    const days = groupBy(chat.messages, message => moment(message.created_at).format('DD MMM'));

    for (const [key, messages] of Object.entries(days)) {
      blocks.push({ type: 'date', date: key });

      messages.forEach(message => {
        let last = blocks[blocks.length - 1];

        if (last && last._id === message.author._id) {
          last.messages.push(message);
        } else {
          blocks.push({
            type: 'messages',
            _id: message.author._id,
            author: message.author,
            messages: [message]
          })
        }
      })
    }

    return blocks.map((block, index) => {
      if (block.type === 'date') {
        return <DateInfo key={index} date={block.date} />
      } else if (block.type === 'messages') {
        if (block.author._id === user_id) {
          return <MyTextMessages key={index} block={block} />
        } else {
          return <TextMessages key={index} block={block} />
        }
      } else {
        return void(0);
      }
    });
  }

  function getChatName() {
    if (chat && chat.host) {
      let fullName = chat.host.name;
      return fullName ? fullName + ' ' + chat.host.surname : chat.host.surname;
    } else {
      return '';
    }
  }

  function getImages() {
    return (
      <View style={styles.imagesContainer}>
        {images.map((image, index) => {
          return (
            <View key={index}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview}/>
              <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                <Ionicons name="ios-close-circle" size={20} color='grey' />
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    );
  }

  function getOtherButton() {
    return {
      name: 'ios-menu',
      cb: () => navigation.navigate('ChatSettings', { chat })
    };
  }

  return (
    <Layout
      noPadding
      goBack={goBack}
      loading={loading}
      avoidRule={'always'}
      title={getChatName()}
      scrollEnabled={false}
      otherButton={getOtherButton()}
    >
      <View style={styles.messagesContainer}>
        <ScrollView
          ref={scrollView}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            scrollView.current.scrollToEnd({animated: false})
          }}
        >
          {getMessages()}
        </ScrollView>
      </View>
      {images.length > 0 && getImages()}
      <View style={styles.staticContainer}>
        <TouchableOpacity style={styles.uploadContainer} onPress={chooseImage}>
          <Ionicons name='ios-image' size={30} color="grey" />
        </TouchableOpacity>
        <TextInput placeholder={'Write'} style={styles.searchInput} value={message} onChangeText={setMessage} />
        <TouchableOpacity style={styles.sendContainer} onPress={sendMessage}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  messagesContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 50,
    paddingLeft: '2%',
    paddingRight: '2%',
    position: 'absolute'
  },
  staticContainer: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderColor: 'grey',
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  uploadContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  imagesContainer: {
    left: 0,
    right: 0,
    bottom: 50,
    height: 100,
    borderTopWidth: 1,
    borderColor: 'grey',
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imagePreview: {
    width: 60,
    height: 80,
    marginLeft: 10,
    borderRadius: 3,
    backgroundColor: 'red'
  },
  removeIcon: {
    top: -11,
    width: 30,
    height: 30,
    right: -15,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    height: '100%'
  },
  searchInput: {
    flex: 1,
    height: 50,
    paddingLeft: '3%'
  },
  sendContainer: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center'
  }
})

export default SingleChat;
