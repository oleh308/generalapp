import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';

import { commonStyles } from '../../styles';
import { TITLE_SIZE } from '../../constants/sizes';
import { WHITE, LIGHT_GREY } from '../../constants/colours';

function SlotView({ slot, cb, isSession, children }) {
  const session = isSession ? slot : null;

  function getTime() {
    const end_time = isSession ? session.slot.end_time : slot.end_time;
    const start_time = isSession ? session.slot.start_time : slot.start_time;

    return moment(start_time).format('HH:mm - ') + moment(end_time).format('HH:mm');
  }

  function getCapacity() {
    if (!isSession) return slot.capacity;

    const base = session.slot.capacity;
    const remain = base - session.chats.length;
    
    return remain > 0 ? remain : 0;
  }

  return (
    <TouchableOpacity style={[styles.slotContainer, commonStyles.shadow]} onPress={cb}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>{getTime()}</Text>
        <Text style={styles.capacityText}>{'Places: ' + getCapacity()}</Text>
      </View>
      {children ? children : void(0)}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  slotContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderRadius: 12,
    paddingBottom: 10,
    paddingLeft: '3%',
    paddingRight: '3%',
    backgroundColor: WHITE
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleText: {
    fontWeight: '600',
  },
  capacityText: {
    color: LIGHT_GREY
  }
});

export default SlotView;
