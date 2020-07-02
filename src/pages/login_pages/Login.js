import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity
} from 'react-native';

import SyncStorage from 'sync-storage';
import Layout from '../../components/blocks/Layout';
import InputField from '../../components/blocks/InputField';
import ActionButton from '../../components/buttons/ActionButton';

import { BLACK, WHITE, BLUE } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AutheticationContext';

const Login: () => React$Node = ({ login, navigation }) => {
  const apiUrl = SyncStorage.get('apiUrl');
  const context = useContext(AuthenticationContext);

  const [email, setEmail] = useState('busko.oleh@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      let data = {
        password: password,
        email: email.toLowerCase(),
      }
      const response = (await axios.post(apiUrl + '/api/auth/login', data)).data;

      setLoading(false);
      if (response.token) {
        SyncStorage.set('token', response.token);
        SyncStorage.set('user_id', response.user_id);

        if (response.first_login) {
          navigation.navigate('LoginInterests', { isMentor: true });
        } else {
          context.setAuthenticated(true);
        }
      } else {
        console.log('error');
      }
    } catch (error) {
      if (error.response) {
        let response = error.response.data;

        if (response.type && response.type === 'confirmationRequired') {
          navigation.navigate('Confirmation');
        } else if (response.type &&
          (response.type === 'isNotMentor'
          || response.type === 'mentorIsPending'
          || response.type === 'mentorIsNotApproved')
          ) {
          navigation.navigate('MentorFeedback', { status: response.type });
        }
      }
      console.log('Signup.js - signup:', error.message);
    }
    setLoading(false);
  }

  function navigateSignup(isMentor) {
    navigation.navigate('Signup', { isMentor: isMentor });
  }

  return (
    <Layout title={'Login'} isScroll={true} goBack={null} loading={loading}>
      <View style={styles.loginContainer}>
        <Text style={styles.pageTitle}>{}</Text>
        <InputField title={'Email'} property={email} setProperty={setEmail} capitalize={'none'}/>
        <InputField title={'Password'} property={password} setProperty={setPassword} isPassword={true} />
        <TouchableOpacity style={styles.mentorButton} onPress={() => navigateSignup(true)}>
          <Text style={styles.mentorText}>Apply to be a mentor</Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          <ActionButton title={'Sign up'} cb={() => navigateSignup(false)} colour={BLUE} />
          <ActionButton title={'Login'} cb={submit} colour={WHITE} background={BLUE}/>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    width: '100%',
    height: '100%',
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'flex-start'
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
    marginTop: 100,
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
  },
  mentorButton: {
    marginTop: 20,
  },
  mentorText: {
    color: 'grey',
    textAlign: 'right'
  }
});

export default Login;
