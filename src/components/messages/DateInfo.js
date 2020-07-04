import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import { GREY } from '../../constants/colours';

function DateInfo({ date }) {
  return (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  dateContainer: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateText: {
    fontSize: 12,
    color: GREY
  }
})

export default DateInfo = React.memo(DateInfo);
