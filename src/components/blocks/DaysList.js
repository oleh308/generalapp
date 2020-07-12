import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { commonStyles } from '../../styles';
import { LIGHT_GREY, WHITE, BLUE } from '../../constants/colours';

const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function DaysList({ day, setDay, style={} }) {
  return (
    <View style={[styles.daysContainer, style]}>
      {days.map((dayText, index) => {
        let style = [commonStyles.shadow, styles.singleDay];
        const cb = index === day ? () => {} : () => setDay(index);
        if (index === day) style.push(styles.selectedDay);

        return (
          <TouchableOpacity key={index} style={style} onPress={cb}>
            <Text style={styles.dayText}>{dayText}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  daysContainer: {
    flexWrap:'wrap',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  singleDay: {
    height: 40,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 12,
    marginBottom: 10,
    marginRight: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GREY,
  },
  selectedDay: {
    backgroundColor: BLUE
  },
  dayText: {
    color: WHITE
  }
});

export default DaysList;
