import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

function Following({ unfollow }) {

  return (
    <View style={styles.followContainer}>
      <TouchableOpacity style={styles.followButton} onPress={unfollow}>
        <Text style={styles.followText}>Following</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  followContainer: {
    flex: 1,
    height: 30,
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
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'grey'
  },
  followText: {
    color: 'white',
  },
})

export default Following;
