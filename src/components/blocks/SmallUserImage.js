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

function SmallUserImage({ image, marginLeft = 0, marginRight = 0 }) {
  const apiUrl = SyncStorage.get('apiUrl');
  function getStyle() {
    return { marginLeft, marginRight };
  }

  function getImage() {
    const url = apiUrl + '/api/image/' + image;
    return <Image style={[styles.profileImage, getStyle()]} source={{ uri: url }} />
  }

  function getDummy() {
    return (
      <View style={[styles.profileDummy, commonStyles.shadow, getStyle()]}>
        <Ionicons name={"ios-person"} size={22} color={LIGHT_GREY}/>
      </View>
    );
  }

  return image ? getImage() : getDummy();
}

const styles = StyleSheet.create({
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileDummy: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});

export default SmallUserImage
