import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';
import SyncStorage from 'sync-storage';
import Layout from '../../components/blocks/Layout';
import TopTabs from '../../components/blocks/TopTabs';
import ActionView from '../../components/blocks/ActionView';
import SessionView from '../../components/blocks/SessionView';
import ActionButton from '../../components/buttons/ActionButton';

import { commonStyles } from '../../styles';
import { useIsFocused } from '@react-navigation/native';
import { RED_2, WHITE, BLUE } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';

const options = ['To Do', 'Sessions'];

function PrivateSettings({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const chat = route?.params?.chat;

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();
  const { api, socket } = useContext(AuthenticationContext);

  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchActions();
      fetchSessions();
    }
  }, [isFocused])

  async function fetchProduct() {
    try {
      const data = (await api.get(apiUrl + '/api/products/' + chat.product._id, config)).data;
      setProduct(data);
    } catch (error) {
      if (error.response) {
        console.log('PrivateSettings.js - fetchProduct', error.response.data);
      } else {
        console.log('PrivateSettings.js - fetchProduct:', error.message);
      }
    }
    setLoading(false);
  }

  async function fetchSessions() {
    try {
      const data = (await api.get(apiUrl + '/api/chats/' + chat._id + '/sessions', config)).data;
      data.sort(function (left, right) {
        return moment.utc(left.start_date).diff(moment.utc(right.start_date))
      });
      setSessions(data);
    } catch (error) {
      if (error.response) {
        console.log('PrivateSettings.js - fetchSessions', error.response.data);
      } else {
        console.log('PrivateSettings.js - fetchSessions:', error.message);
      }
    }
  }

  async function fetchActions() {
    try {
      const data = (await api.get(apiUrl + '/api/chats/' + chat._id + '/actions', config)).data;
      setActions(data);
    } catch (error) {
      if (error.response) {
        console.log('PrivateSettings.js - fetchActions', error.response.data);
      } else {
        console.log('PrivateSettings.js - fetchActions:', error.message);
      }
    }
  }

  async function leave(session) {
    try {
      const body = {
        chat: chat._id
      }

      const data = (await api.post(apiUrl + '/api/sessions/' + session._id + '/leave', body, config)).data;
      fetchSessions()
    } catch (error) {
      if (error.response) {
        console.log('PrivateSettings.js - leave:', error.response.data);
      } else {
        console.log('PrivateSettings.js - leave:', error.message);
      }
    }
  }

  async function toggleCompleted(action) {
    try {
      const body = {
        completed: !action.completed
      }

      const data = (await api.patch(apiUrl + '/api/chats/' + chat._id + '/actions/' + action._id, body, config)).data;
      fetchActions()
    } catch (error) {
      if (error.response) {
        console.log('PrivateSettings.js - toggleCompleted:', error.response.data);
      } else {
        console.log('PrivateSettings.js - toggleCompleted:', error.message);
      }
    }
  }

  function goBack() {
    navigation.goBack();
  }

  function joinSession() {
    navigation.navigate('CreateSession', { chat, product: product });
  }

  function createAction() {
    navigation.navigate('CreateAction', { chat })
  }

  function editAction(action) {
    navigation.navigate('CreateAction', { chat, action })
  }

  function getActions() {
    return (
      <View style={styles.contentContainer}>
        {actions.map((action, index) =>
          <ActionView key={index} action={action} cb={() => editAction(action)} doneCb={() => toggleCompleted(action)}/>
        )}
        <TouchableOpacity style={commonStyles.createContainer} onPress={createAction}>
          <Text style={commonStyles.createText}>Create item</Text>
        </TouchableOpacity>
      </View>
    )
  }

  function getButtons(session) {
    if (chat.host._id !== user_id) {
      return (
        <View style={commonStyles.buttonsContainer}>
          <ActionButton title={'Leave'} colour={WHITE} background={RED_2} cb={() => leave(session)} />
        </View>
      );
    } else {
      return null
    }
  }

  function getSessions() {
    let activeSessions = sessions.filter(session => session.status === 'active');

    const allowed = product.amount > activeSessions.length && chat.host._id !== user_id;
    return (
      <View style={styles.contentContainer}>
        {sessions.map((session, index) => <SessionView key={index} session={session} buttons={getButtons(session)}/>)}
        {allowed && <TouchableOpacity style={commonStyles.createContainer} onPress={joinSession}>
          <Text style={commonStyles.createText}>Join session</Text>
        </TouchableOpacity>}
      </View>
    );
  }

  // <TouchableOpacity style={styles.createContainer} onPress={openCreate}>
  //   <Text style={styles.createText}>Create new</Text>
  // </TouchableOpacity>

  return (
    <Layout title={'Details'} goBack={goBack} noPadding loading={loading}>
      <TopTabs options={options} tab={tab} setTab={setTab} />
      {tab === 0 && getActions()}
      {tab === 1 && getSessions()}
    </Layout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: 75,
    paddingLeft: '5%',
    paddingRight: '5%',
  }
});

export default PrivateSettings;
