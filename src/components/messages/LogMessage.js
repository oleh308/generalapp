import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import { getName } from '../../utils/user';
import { LIGHT_GREY, GREY, WHITE } from '../../constants/colours';

function LogMessage({ block }) {

  function getText() {
    const message = block.messages[0];

    if (message.type === 'userPromote') {
      return message.text + ' is admin now.';
    } else if (message.type === 'userDemote') {
      return message.text + ' is not longer admin.';
    } else if (message.type === 'userLeft') {
      return getName(block.author) + ' left.';
    } else if (message.type === 'userJoined') {
      return getName(block.author) + ' joined.';
    } else if (message.type === 'userJoined') {
      return message.text + ' was kicked out.';
    }
  }

  return (
    <View style={styles.messageCenter}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{getText()}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  messageCenter: {
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'column',
  },
  messageContainer: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12,
    backgroundColor: GREY
  },
  messageText: {
    color: WHITE,
    fontSize: 11
  }
});

export default LogMessage;
