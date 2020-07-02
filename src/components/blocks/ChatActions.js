import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import ActionButton from '../buttons/ActionButton';
import { BLUE, WHITE } from '../../constants/colours';

function ChatActions({ cb, cb2 }) {
  return (
    <View style={styles.actionsContainer}>
      <ActionButton title={'Join chat'} cb={cb} colour={WHITE} background={BLUE}/>
      <View style={styles.gap} />
      <ActionButton title={'Private chat'} cb={cb2} colour={WHITE} background={BLUE}/>
    </View>
  )
}

const styles = StyleSheet.create({
  actionsContainer: {
    marginLeft: 10,
    flexDirection: 'row',
  },
  gap: {
    width: '3%'
  }
})

export default ChatActions;
