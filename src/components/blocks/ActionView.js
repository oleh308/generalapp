import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { commonStyles } from '../../styles';
import { GREEN, LIGHT_GREY, WHITE } from '../../constants/colours';

function ActionView({ action, cb, doneCb }) {

  function getIcon() {
    if (action.completed) {
      return <Ionicons name={'ios-checkmark-circle'} size={24} color={GREEN} />
    } else {
      return <FontAwesome name={'circle-thin'} size={24} color={LIGHT_GREY} />
    }
  }

  return (
    <TouchableOpacity style={[styles.actionContainer, commonStyles.shadow]} onPress={cb}>
      <Text>{action.title}</Text>
      <TouchableOpacity onPress={doneCb}>
        {getIcon()}
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  actionContainer: {
    height: 40,
    marginTop: 10,
    borderRadius: 12,
    paddingLeft: '3%',
    paddingRight: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    justifyContent: 'space-between'
  }
});

export default ActionView;
