import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';
import SyncStorage from 'sync-storage';
import Modal from '../../components/blocks/Modal';
import Layout from '../../components/blocks/Layout';
import InputField from '../../components/blocks/InputField';
import SearchInput from '../../components/blocks/SearchInput';
import ActionButton from '../../components/buttons/ActionButton';

import { BLACK, WHITE, BLUE, GREY } from '../../constants/colours';

const Signup: () => React$Node = ({ login, route, navigation }) => {
  const apiUrl = SyncStorage.get('apiUrl');
  const { isMentor } = route.params;

  const [name, setName] = useState('Oleh');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('busko.oleh@gmail.com');
  const [alert, setAlert] = useState(null);
  const [surname, setSurname] = useState('Busko');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('123456');

  const signup = async () => {
    if (loading) return;
    setLoading(true)
    try {
      let data = {
        city: '',
        name: name,
        country: '',
        interests: [],
        surname: surname,
        password: password,
        email: email.toLowerCase(),
      }
      const url = isMentor ? '/api/auth/mentor/signup' : '/api/auth/signup';
      const response = (await axios.post(apiUrl + url, data)).data;
      if (isMentor) {
        openApplyConfirmation();
      } else {
        openSignupConfirmation();
      }
    } catch (error) {
      if (error.response) {
        console.log('Signup.js - signup:', error.response.data);
      } else {
        console.log('Signup.js - signup:', error.message);
      }
    }
    setLoading(false);
  }

  function openApplyConfirmation() {
    setAlert({
      title: 'Thank you',
      text: 'We will review your application and come back to you shortly. While you are waiting please confirm your email.',
      buttons: [
        {
          title: 'OK',
          color: BLUE,
          cb: () => navigation.goBack()
        }
      ]
    })
  }

  function openSignupConfirmation() {
    setAlert({
      title: 'Successful',
      text: 'Please verify your email before logging in.',
      buttons: [
        {
          title: 'OK',
          color: BLUE,
          cb: () => navigation.goBack()
        }
      ]
    })
  }

  return (
    <Layout title={isMentor ? 'Apply' : 'Sign up'} isScroll={true} goBack={() => navigation.goBack()} loading={loading}>
      <InputField title={'Name'} property={name} setProperty={setName}/>
      <InputField title={'Surname'} property={surname} setProperty={setSurname}/>
      <InputField title={'Email'} property={email} setProperty={setEmail} capitalize={'none'}/>
      <InputField title={'Password'} property={password} setProperty={setPassword} isPassword={true} />
      <InputField title={'Confirm Password'} property={confirmPassword} setProperty={setConfirmPassword} isPassword={true} />
      <View style={styles.buttonsContainer}>
        <ActionButton title={isMentor ? 'Submit' : 'Signup'} cb={signup} colour={WHITE} background={BLUE}/>
      </View>
      {alert && <Modal alert={alert} />}
    </Layout>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    width: '100%',
    height: '100%',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  inputContainer: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: '2%',
    borderColor: 'grey'
  },
  inputHeader: {
    marginTop: 20
  },
  pageTitle: {
    height: 100,
    fontSize: 24,
    // marginTop: 100,
    lineHeight: 100,
    textAlign: 'center',
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
});

export default Signup;
