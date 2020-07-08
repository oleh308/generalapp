import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';
import SyncStorage from 'sync-storage';
import Layout from '../components/blocks/Layout.js';
import AreaField from '../components/inputs/AreaField';
import SelectedProps from '../components/blocks/SelectedProps';

function ChangeAbout({ navigation, route }) {
  const apiUrl = SyncStorage.get('apiUrl');
  const { aboutPrev } = route.params;
  const [about, setAbout] = useState(aboutPrev);

  const save = async () => {
    let token = SyncStorage.get('token');
    let user_id = SyncStorage.get('user_id');

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const data = {
        about
      };

      const response = (await axios.put(apiUrl + '/api/users/' + user_id, data, config)).data;
      navigation.goBack();
    } catch (error) {
      let message = error.message;
      if (error.response)
        message = error.response.data;

      console.log('ChangeAbout - save:', message)
    }
  }

  return (
    <Layout title={'About'} isScroll={true} goBack={() => navigation.goBack()} loading={false}>
      <AreaField title={'About'} property={about} setProperty={setAbout} />
      <View style={styles.buttomContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonOpacity1} onPress={save}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  buttomContainer: {
    flex: 1,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonOpacity1: {
    padding: 10,
    borderRadius: 3,
    backgroundColor: 'grey'
  },
  buttonOpacity2: {
    padding: 10,
    borderRadius: 3,
    borderColor: 'grey',
  },
  buttonText: {
    color: 'white'
  }
})

export default ChangeAbout;
