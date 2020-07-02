import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import SyncStorage from 'sync-storage';
import { AuthenticationContext } from '../../context/AutheticationContext';

function Settings() {
  const { setAuthenticated } = useContext(AuthenticationContext);

  function logout() {
    SyncStorage.remove('token');
    SyncStorage.remove('user_id');

    setAuthenticated(false);
  }

  return (
    <View style={styles.settingsContainer}>
      <TouchableOpacity style={[styles.settingButton, styles.borderBottom]} onPress={() => {}}>
        <Text>Subscriptions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.settingButton, styles.borderBottom]} onPress={() => {}}>
        <Text>Payment Methods</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.settingButton, styles.borderBottom]} onPress={() => {}}>
        <Text>Payment History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.settingButton, styles.borderBottom]} onPress={() => {}}>
        <Text>Terms and Conditions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingButton} onPress={logout}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  settingsContainer: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  settingButton: {
    height: 50,
    justifyContent: 'center'
  },
  borderBottom: {
    borderColor: 'grey',
    borderBottomWidth: 1,
  }
})

export default Settings;
