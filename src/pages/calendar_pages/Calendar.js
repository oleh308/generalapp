import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';
import SyncStorage from 'sync-storage';
import DatePicker from 'react-native-date-picker'
import Layout from '../../components/blocks/Layout';
import InputField from '../../components/inputs/InputField'
import SessionView from '../../components/blocks/SessionView';
import ActionButton from '../../components/buttons/ActionButton';

import { commonStyles } from '../../styles';
import { BLUE, WHITE } from '../../constants/colours';
import { useIsFocused } from '@react-navigation/native';
import { AuthenticationContext } from '../../context/AutheticationContext';
import { Calendar as CalendarComp, CalendarList, Agenda } from 'react-native-calendars';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Calendar({ navigation }) {
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();

  const [modal, setModal] = useState(null);
  const [time, setTime] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [date, setDate] = useState(moment(new Date()));
  const [displayTime1, setDisplayTime1] = useState(null);
  const [displayTime2, setDisplayTime2] = useState(null);

  useEffect(() => {
    if (isFocused) fetchSessions();
  }, [isFocused]);


  async function fetchSessions() {
    try {
      const data = (await api.get(apiUrl + '/api/sessions', config)).data;
      console.log(data);
      setSessions(data);
    } catch (error) {
      if (error.response) {
        console.log('Calendar.js - fetchSessions:', error.response.data);
      } else {
        console.log('Calendar.js - fetchSessions:', error.message);
      }
    }
  }

  async function updateStatus(id, status) {
    try {
      const body = {
        status: status
      }
      const data = (await api.patch(apiUrl + '/api/sessions/' + id, body, config)).data;
      fetchSessions();
    } catch (error) {
      if (error.response) {
        console.log('ChatSettings.js - updateStatus:', error.response.data);
      } else {
        console.log('ChatSettings.js - updateStatus:', error.message);;
      }
    }
  }

  function openModal(type) {
    setModal(type);
  }

  function closeModal() {
    setModal(null)
  }

  function selectTime() {
    if (modal === 'from') setDisplayTime1(time);
    else if (modal === 'until') setDisplayTime2(time);
    setTime(new Date());
    setModal(null);
  }

  function selectDate(date) {
    setDate(moment.unix(date.timestamp / 1000))
  }

  function getDay() {
    return days[date.day()];
  }

  function getTime(type) {
    if (type === 'from') {
      return displayTime1 ? moment(displayTime1).format('HH:mm') : '';
    } else if (type === 'until') {
      return displayTime2 ? moment(displayTime2).format('HH:mm') : '';
    }
  }

  function getSessions() {
    const todaySessions = sessions.filter(session => moment(session.start_date).isSame(date, 'day'));

    return (
      <View style={styles.sessionsContainer}>
        {todaySessions.map((session, index) => <SessionView
          key={index}
          chat={null}
          session={session}
          navigation={navigation}
          updateStatus={updateStatus}
        />)}
      </View>
    )
  }

  function getDays() {
    let days = {}
    sessions.forEach(session => {
      days[moment(session.start_date).format('YYYY-MM-DD')] = {
        marked: true,
        dotColor: BLUE
      }
    });
    days[date.format('YYYY-MM-DD')] = {
      selected: true,
      selectedColor: BLUE,
      disableTouchEvent: true,
    }
  
    return days;
  }

  function getModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={modal ? true : false}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeBackground} onPress={closeModal}>
          </TouchableOpacity>
          <View style={[styles.modalContainer, commonStyles.shadow]}>
            <DatePicker
              date={time}
              mode={'time'}
              minuteInterval={30}
              onDateChange={setTime}
            />
            <View style={commonStyles.buttonsContainer}>
              <ActionButton title={'Select'} colour={WHITE} background={BLUE} marginLeft={10} cb={selectTime}/>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Layout title="Calendar">
      <CalendarComp
        onDayPress={selectDate}
        style={styles.calendarContainer}
        markedDates={getDays()}
      />
      {getSessions()}
    </Layout>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    borderRadius: 12,
  },
  pickersContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  singlePicker: {
    width: '49%',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  closeBackground: {
    flex: 1
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: WHITE,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  sessionsContainer: {
    marginTop: 20,
    marginBottom: 75
  }
});

export default Calendar;
