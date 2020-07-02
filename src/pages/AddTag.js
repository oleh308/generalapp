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
import SearchInput from '../components/blocks/SearchInput.js';
import SelectedProps from '../components/blocks/SelectedProps';

function AddTag({ navigation, route }) {
  const apiUrl = SyncStorage.get('apiUrl');
  const { type, tags, cb } = route.params;

  const [interest, setInterest] = useState('');
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState(tags);

  useEffect(() => {
    fetchInterests();
  }, [])

  const fetchInterests = async () => {
    try {
      const data = (await axios.get(apiUrl + '/api/interests')).data;
      setInterests(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data)
      }
      console.log('AddTag - fetchInterests:', error.message);
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

  const save = async () => {
    let token = SyncStorage.get('token');
    let user_id = SyncStorage.get('user_id');

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      let data = {};
      let suburl = '';
      if (type === 'areas') {
        suburl = '/api/mentor/';
        data.areas = selectedInterests
      } else if (type === 'interests') {
        suburl = '/api/user/';
        data.interests = selectedInterests
      }

      const response = (await axios.put(apiUrl + suburl + user_id, data, config)).data;
      if (response.success) {
        cb();
        navigation.goBack();
      }
    } catch (error) {
      let message = error.message;
      if (error.response)
        message = error.response.data;

      console.log('AddTag - save:', message)
    }
  }

  function getTitle() {
    if (type === 'areas') {
      return 'Areas';
    } else if (type === 'interests') {
      return 'Interests';
    } else {
      return '';
    }
  }

  return (
    <Layout title={getTitle()} isScroll={true} goBack={() => navigation.goBack()} loading={false}>
      <SearchInput
        title={'Choose'} property={interest} data={interests}
        setProperty={setInterest} selectProperty={selectInterest} prop={'title'}/>
      <SelectedProps props={selectedInterests} cancelFunc={cancelFunc} />
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

export default AddTag;
