import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Layout from '../../components/blocks/Layout';
import TopTabs from '../../components/blocks/TopTabs';
import DaysList from '../../components/blocks/DaysList';

import { LIGHT_GREY } from '../../constants/colours';

const options = ['Schedule', 'Products'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function SessionsSchedule({ navigation }) {
  const [tab, setTab] = useState(0);
  const [day, setDay] = useState(0);

  function goBack() {
    navigation.goBack();
  }

  function navigateCreate(index) {
    // navigation.navigate('CreateSlot', { day: index });
  }

  function getSlots(index, dayText, slots) {
    return (
      <View key={index}>
        {dayText ? <Text>{dayText + ':'}</Text> : void(0)}
        {slots.map((slot, index) => {
          return (
            <TouchableOpacity>

            </TouchableOpacity>
          )
        })}
        {slots.length === 0 && <TouchableOpacity style={styles.createSlot} onPress={() => navigateCreate(index)}>
          <Text style={styles.createText}>Create slot</Text>
        </TouchableOpacity>}
      </View>
    );
  }

  function getSchedule() {
    console.log(day)
    return (
      <View style={styles.scheduleContainer}>
        <DaysList day={day} setDay={setDay} />
        {day === 0 && days.map((dayText, index) => {
          return getSlots(index, dayText, []);
        })}
        {day !== 0 && getSlots(day - 1, '', [])}
      </View>
    )
  }

  function getProducts() {

  }

  return (
    <Layout title={'Timetable'} goBack={goBack} noPadding>
      <TopTabs tab={tab} setTab={setTab} options={options} />
      {tab === 0 && getSchedule()}
      {tab === 1 && getProducts()}
    </Layout>
  )
}

const styles = StyleSheet.create({
  scheduleContainer: {
    marginBottom: 75,
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  createSlot: {
    height: 50,
    marginTop: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: LIGHT_GREY,
    justifyContent: 'center'
  },
  createText: {
    color: LIGHT_GREY
  }
});

export default SessionsSchedule;
