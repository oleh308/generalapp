import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import SyncStorage from 'sync-storage';
import Layout from '../../components/blocks/Layout';
import InputField from '../../components/inputs/InputField';
import ActionButton from '../../components/buttons/ActionButton';

import { commonStyles } from '../../styles';
import { RED_2, WHITE, BLUE } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';

function CreateAction({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const { chat, action } = route.params;
  const { api } = useContext(AuthenticationContext);

  const [title, setTitle] = useState(action ? action.title : '');

  async function create() {
    try {
      const body = {
        title
      }
      const data = (await api.post(apiUrl + '/api/chats/' + chat._id + '/actions', body, config)).data;
      navigation.goBack();
    } catch(error) {
      if (error.response) {
        console.log('CreateAction.js - create:', error.response.data);
      } else {
        console.log('CreateAction.js - create:', error.message);
      }
    }
  }

  async function update() {
    try {
      const body = {
        title
      }
      const data = (await api.patch(apiUrl + '/api/chats/' + chat._id + '/actions/' + action._id, body, config)).data;
      navigation.goBack();
    } catch(error) {
      if (error.response) {
        console.log('CreateAction.js - update:', error.response.data);
      } else {
        console.log('CreateAction.js - update:', error.message);
      }
    }
  }

  async function deleteFunc() {
    try {
      const body = {
        title
      }
      const data = (await api.delete(apiUrl + '/api/chats/' + chat._id + '/actions/' + action._id, config)).data;
      navigation.goBack();
    } catch(error) {
      if (error.response) {
        console.log('CreateAction.js - deleteFunc:', error.response.data);
      } else {
        console.log('CreateAction.js - deleteFunc:', error.message);
      }
    }
  }

  function goBack() {
    navigation.goBack()
  }

  function getButtons() {
    return (
      <View style={commonStyles.buttonsContainer}>
        {action && <ActionButton title={'Delete'} colour={RED_2} cb={deleteFunc} />}
        {action && <ActionButton title={'Update'} colour={WHITE} background={BLUE} cb={update} />}
        {!action && <ActionButton title={'Create'} colour={WHITE} background={BLUE} cb={create} />}
      </View>
    )
  }

  return (
    <Layout title={action ? 'Update Item' : 'Create Item'} goBack={goBack}>
      <View>
        <InputField title={'Title'} property={title} setProperty={setTitle} />
        {getButtons()}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({

});

export default CreateAction;
