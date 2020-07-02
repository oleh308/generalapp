import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

function Basic({ title, cb }) {

  return (
    <TouchableOpacity style={styles.buttonOpacity1} onPress={cb}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonOpacity1: {
    height: 50,
    padding: 10,
    borderRadius: 3,
    backgroundColor: 'grey',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white'
  },
})

export default Basic;
