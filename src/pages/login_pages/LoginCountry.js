import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';
import SyncStorage from 'sync-storage';
import Layout from '../../components/blocks/Layout.js';
import FindInput from '../../components/inputs/FindInput.js';
import InputField from '../../components/inputs/InputField.js';
import ActionButton from '../../components/buttons/ActionButton';

import { BLACK, WHITE, BLUE } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';

function LoginCountry({ navigation }) {
  const apiUrl = SyncStorage.get('apiUrl');
  const context = useContext(AuthenticationContext);

  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchInterests();
  }, [])

  const fetchInterests = async () => {
    try {
      const data = (await axios.get(apiUrl + '/api/countries')).data;
      setCountries(data);
    } catch (error) {
      if (error.response) {
        console.log('LoginCountry - fetchCountries:', error.response.data);
      } else {
        console.log('LoginCountry - fetchCountries:', error.message);
      }
    }
  }

  const selectCountry = (country, cb) => {
    setCountry(country.title);
    setTimeout(() => {
      cb();
    }, 100)
  }

  const next = async () => {
    let token = SyncStorage.get('token');
    let user_id = SyncStorage.get('user_id');

    try {
      let body = {
        city: city,
        country: country
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = (await axios.put(apiUrl + '/api/user/' + user_id, body, config)).data;
      if (response.success) {
        context.setAuthenticated(true);
      }
    } catch (error) {
      let message = error.message;
      if (error.response)
        message = error.response.data;

      console.log('LoginCountry - next:', message)
    }
  }

  return (
    <Layout title={'Country'} isScroll={true} goBack={null} loading={false}>
      <FindInput
        title={'Country'} property={country} data={countries}
        setProperty={setCountry} selectProperty={selectCountry} prop={'title'}/>
      <InputField title={'City'} property={city} setProperty={setCity} />

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

export default LoginCountry;
