import React, { Fragment, useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import SyncStorage from 'sync-storage';
import Modal from '../../components/blocks/Modal';
import Layout from '../../components/blocks/Layout';
import TopTabs from '../../components/blocks/TopTabs';
import ActionButton from '../../components/buttons/ActionButton';
import SmallUserImage from '../../components/blocks/SmallUserImage';
import { AuthenticationContext } from '../../context/AutheticationContext';

import { getImageUri, getName } from '../../utils/user.js';

const options = ['Topics', 'Users'];

function ChatSettings({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const chatInit = route.params ? route.params.chat : null;

  const isOwner = user_id === chatInit.host._id;
  const isAdmin = false;

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const { api } = useContext(AuthenticationContext);

  const [tab, setTab] = useState(0);
  const [alert, setAlert] = useState(null);
  const [chat, setChat] = useState(chatInit);
  const [opened, setOpened] = useState([false, false]);

  async function fetchChat() {
    try {
      const data = (await api.get(apiUrl + '/api/chats/' + chat._id, config)).data;
      setChat(data);
    } catch (error) {
      if (error.response) {
        console.log('ChatSettings.js - fetchChat:', error.response.data);
      } else {
        console.log('ChatSettings.js - fetchChat:', error.message);
      }
    }
  }

  async function leave() {
    try {
      const data = (await api.post(apiUrl + '/api/chats/leave/' + chat._id, {}, config)).data;
      console.log(data);
      navigation.navigate('Chats');
    } catch (error) {
      if (error.response) {
        console.log('ChatSettings - leave:', error.response.data);
      } else {
        console.log('ChatSettings - leave', error.message);
      }
    }
  }

  async function promote(user) {
    try {
      const data = (await api.post(apiUrl + '/api/chats/promote/' + chat._id, { id: user._id }, config)).data;
      fetchChat();
      setAlert(null);
    } catch (error) {
      if (error.response) {
        console.log('ChatSettings - leave:', error.response.data);
      } else {
        console.log('ChatSettings - leave', error.message);
      }
    }
  }

  async function remove(user) {
    try {
      const data = (await api.post(apiUrl + '/api/chats/remove/' + chat._id, { id: user._id }, config)).data;
      fetchChat();
      setAlert(null);
    } catch (error) {
      if (error.response) {
        console.log('ChatSettings - leave:', error.response.data);
      } else {
        console.log('ChatSettings - leave', error.message);
      }
    }
  }

  function navigateBack() {
    navigation.goBack();
  }

  function getUsersArray(users, index) {
    if (opened[index] || users.length < 6) return users;
    else return users.slice(0, 5);
  }

  function openConfirmLeave() {
    setAlert({
      title: 'Confirmation',
      text: 'Please confirm your intent to leave the chat.',
      buttons: [
        {
          title: 'Cancel',
          color: 'grey',
          cb: () => setAlert(null)
        },
        {
          title: 'Confirm',
          color: 'grey',
          cb: leave
        }
      ]
    })
  }

  function openConfirmDemote(user) {
    setAlert({
      title: 'Demotion',
      text: 'Please confirm your intent to demote ' + getName(user) + '.',
      buttons: [
        {
          title: 'Cancel',
          color: 'grey',
          cb: () => setAlert(null)
        },
        {
          title: 'Confirm',
          color: 'grey',
          cb: () => promote(user)
        }
      ]
    });
  }

  function openConfirmPromote(user) {
    setAlert({
      title: 'Promotion',
      text: 'Please confirm your intent to promote ' + getName(user) + '.',
      buttons: [
        {
          title: 'Cancel',
          color: 'grey',
          cb: () => setAlert(null)
        },
        {
          title: 'Confirm',
          color: 'grey',
          cb: () => promote(user)
        }
      ]
    });
  }

  function openConfirmRemove(user) {
    setAlert({
      title: 'Removal',
      text: 'Please confirm your intent to remove ' + getName(user) + ' from chat.',
      buttons: [
        {
          title: 'Cancel',
          color: 'grey',
          cb: () => setAlert(null)
        },
        {
          title: 'Confirm',
          color: '#DC4747',
          cb: () => remove(user)
        }
      ]
    })
  }

  function getLabel(type) {
    if (type === 'admin') {
      return <Text style={styles.labelText}>Admin</Text>;
    } else if (type === 'host') {
      return <Text style={styles.labelText}>Host</Text>;
    } else {
      return void(0);
    }
  }

  function getActions(user, type) {
    if (isOwner) {
      if (type === 'admin') return <ActionButton title='Demote' colour='grey' cb={() => openConfirmDemote(user)}/>
      else if (type === 'user') {
        return (
          <View style={styles.actionsContainer}>
            <ActionButton title='Promote' colour='grey' cb={() => openConfirmPromote(user)}/>
            <ActionButton marginLeft={10} title='Remove' colour='#DC4747' cb={() => openConfirmRemove(user)}/>
          </View>
        )
      }
    } else if (isAdmin) {
      if (type === 'admin') return getLabel(type);
      else if (type === 'user') return <ActionButton title='Remove' colour='#DC4747' cb={() => {}}/>
      else return void(0)
    } else {
      return getLabel(type);
    }
  }

  function getUserView(user, type, index, last) {
    return (
      <View key={index} style={styles.profileContainer}>
        <SmallUserImage image={user.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.nameText}>{getName(user)}</Text>
          {getActions(user, type)}
        </View>
      </View>
    )
  }

  function getNoUsers(label) {
    return (
      <View>
        <Text style={styles.noUsersText}>{label}</Text>
      </View>
    )
  }

  function getTopics() {
    return [];
  }

  function getUsers() {
    return (
      <Fragment>
        <View style={styles.usersContainer}>
          <Text style={styles.sectionText}>Host:</Text>
          {getUserView(chat.host, 'host', 0, true)}
        </View>
        <View style={styles.usersContainer}>
          <Text style={styles.sectionText}>Admins:</Text>
          {getUsersArray(chat.admins).map((admin, i) => getUserView(admin, 'admin', i, chat.admins.length === i))}
          {chat.admins.length === 0 && getNoUsers('No Admins')}
        </View>
        <View style={styles.usersContainer}>
          <Text style={styles.sectionText}>Users:</Text>
          {getUsersArray(chat.users).map((user, i) => getUserView(user, 'user', i, chat.admins.length === i))}
          {chat.users.length === 0 && getNoUsers('No Users')}
        </View>
        {!isOwner && <TouchableOpacity style={styles.leaveContainer} onPress={openConfirmLeave}>
          <Text style={styles.leaveText}>Leave chat</Text>
        </TouchableOpacity>}
      </Fragment>
    )
  }

  return (
    <Layout title="Settings" goBack={navigateBack} noPadding>
      <TopTabs options={options} tab={tab} setTab={setTab}/>
      <View style={styles.contentContainer}>
        {tab === 0 && getTopics()}
        {tab === 1 && getUsers()}
      </View>
      {alert && <Modal alert={alert} />}
    </Layout>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingLeft: '3%',
    paddingRight: '3%'
  },
  usersContainer: {
    marginBottom: 10
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600"
  },
  noUsersText: {
    color: 'grey',
    marginBottom: 10
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover'
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameText: {
    marginLeft: 10,
  },
  labelText: {
    color: 'grey'
  },
  actionsContainer: {
    flexDirection: 'row'
  },
  gap: {
    width: 5
  },
  leaveContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leaveText: {
    color: '#DC4747'
  }
});

export default ChatSettings;
