import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

function Follow({ follow }) {

  return (
    <View style={styles.followContainer}>
      <TouchableOpacity style={styles.followButton} onPress={follow}>
        <Text style={styles.followText}>Follow</Text>
        <Ionicons name="ios-add" size={24} color="grey" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  followContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  followButton: {
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: '5%',
    paddingRight: '5%',
    borderColor: 'grey',
    alignItems: 'center',
    flexDirection: 'row'
  },
  followText: {
    color: 'grey',
    paddingRight: '5%',
  },
})

export default Follow;
