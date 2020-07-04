import React from 'react';
import {
  View,
  Image,
  StyleSheet
} from 'react-native';

import SyncStorage from 'sync-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { commonStyles } from '../../styles.js';
import { LIGHT_GREY } from '../../constants/colours';

function UserImage({ image, marginLeft = 0, marginRight = 0, height = 40 }) {
  const ratio = 0.55;
  const apiUrl = SyncStorage.get('apiUrl');

  function getStyle() {
    return {
      height,
      marginLeft,
      marginRight,
      width: height,
      borderRadius: height / 2
    };
  }

  function getImage() {
    const url = apiUrl + '/api/image/' + image;
    return <Image style={getStyle()} source={{ uri: url }} />
  }

  function getDummy() {
    return (
      <View style={[styles.profileDummy, commonStyles.shadow, getStyle()]}>
        <Ionicons name={"ios-person"} size={height * ratio} color={LIGHT_GREY}/>
      </View>
    );
  }

  return image ? getImage() : getDummy();
}

const styles = StyleSheet.create({
  profileDummy: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});

export default UserImage
