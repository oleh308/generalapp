import React, { useState, useContext } from 'react';
import {
  View
} from 'react-native';

import SyncStorage from 'sync-storage';
import Layout from '../components/blocks/Layout';
import InputField from '../components/inputs/InputField';
import ActionButton from '../components/buttons/ActionButton';

import { commonStyles } from '../styles';
import { BLUE, WHITE } from '../constants/colours';
import { AuthenticationContext } from '../context/AuthenticationContext';

function ChangeName({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const { user } = route.params;
  const { api, socket } = useContext(AuthenticationContext);

  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);

  async function update() {
    try {
      const body = {
        name: name,
        surname: surname
      }

      const data = (await api.put(apiUrl + '/api/users/' + user._id, body, config)).data;
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        console.log('ChangeName.js - update;', error.response.data);
      } else {
        console.log('ChangeName.js - update:', error.message);
      }
    }
  }

  function goBack() {
    navigation.goBack();
  }

  return (
    <Layout title={'Change Name'} goBack={goBack}>
      <View>
        <InputField title={'Name'} property={name} setProperty={setName} />
        <InputField title={'Surname'} property={surname} setProperty={setSurname} />
        <View style={commonStyles.buttonsContainer}>
          <ActionButton title={'Update'} colour={WHITE} background={BLUE} cb={update} />
        </View>
      </View>
    </Layout>
  );
}

export default ChangeName;
