import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

function DateInfo({ date }) {
  return (
    <View style={styles.dateContainer}>
      <Text>{date}</Text>
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
    color: 'grey'
  }
})

export default DateInfo = React.memo(DateInfo);
