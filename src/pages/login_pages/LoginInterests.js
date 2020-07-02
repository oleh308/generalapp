import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';
import SyncStorage from 'sync-storage';
import Layout from '../../components/blocks/Layout.js';
import ActionButton from '../../components/buttons/ActionButton';
import SearchInput from '../../components/blocks/SearchInput.js';
import SelectedProps from '../../components/blocks/SelectedProps';

import { BLACK, WHITE, BLUE } from '../../constants/colours';

function LoginInterests({ navigation, route }) {
  const apiUrl = SyncStorage.get('apiUrl');
  const { isMentor } = route.params;

  const [interest, setInterest] = useState('');
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    fetchInterests();
  }, [])

  const fetchInterests = async () => {
    try {
      const data = (await axios.get(apiUrl + '/api/interests')).data;
      setInterests(data);
      console.log(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data)
      }
      console.log('Signup - fetchCountries:', error.message);
    }
  }

  const selectInterest = interest => {
    if (!selectedInterests.includes(interest.title)) {
      setSelectedInterests([...selectedInterests, interest.title])
    }
    setInterest('');
  }

  const cancelFunc = (interest, index) => {
    let temp = [...selectedInterests]
    temp.splice(index, 1);
    setSelectedInterests(temp);
  }

  const next = async () => {
    let token = SyncStorage.get('token');
    let user_id = SyncStorage.get('user_id');

    try {
      let body = {
        interests: selectedInterests
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = (await axios.put(apiUrl + '/api/user/' + user_id, body, config)).data;
      if (response.success) navigation.navigate('LoginCountry')
    } catch (error) {
      let message = error.message;
      if (error.response)
        message = error.response.data;

      console.log('LoginInterests - next:', message)
    }
  }

  return (
    <Layout title={isMentor ? 'Areas' : 'Interests'} isScroll={true} goBack={null} loading={false}>
      <SearchInput
        title={'Interests'} property={interest} data={interests}
        setProperty={setInterest} selectProperty={selectInterest} prop={'title'}/>
      <SelectedProps props={selectedInterests} cancelFunc={cancelFunc} />
      <View style={styles.buttomContainer}>
        <View style={styles.buttonsContainer}>
          <ActionButton title={'Next'} cb={next} colour={WHITE} background={BLUE} />
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

export default LoginInterests;
