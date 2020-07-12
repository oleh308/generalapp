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
import DatePicker from 'react-native-date-picker';
import Layout from '../../components/blocks/Layout';
import SlotView from '../../components/blocks/SlotView';
import InputField from '../../components/inputs/InputField'
import SessionView from '../../components/blocks/SessionView';
import ActionButton from '../../components/buttons/ActionButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { commonStyles } from '../../styles';
import { useIsFocused } from '@react-navigation/native';
import { BLUE, WHITE, LIGHT_GREY, RED_2 } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';
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

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(moment(new Date()));

  useEffect(() => {
    if (isFocused) fetchSessions();
  }, [isFocused]);

  async function fetchSessions() {
    try {
      const data = (await api.get(apiUrl + '/api/sessions', config)).data;
      setSessions(data);
    } catch (error) {
      if (error.response) {
        console.log('Calendar.js - fetchSessions:', error.response.data);
      } else {
        console.log('Calendar.js - fetchSessions:', error.message);
      }
    }
    setLoading(false);
  }

  async function leave(session) {
    try {
      const body = {
        chat: session.chat
      }

      const data = (await api.post(apiUrl + '/api/sessions/' + session._id + '/leave', body, config)).data;
      fetchSessions();
    } catch (error) {
      if (error.response) {
        console.log('Calendar.js - leave:', error.response.data);
      } else {
        console.log('Calendar.js - leave:', error.message);
      }
    }
  }

  async function changeStatus(session, status) {
    try {
      const body = {
        status: status
      }

      const data = (await api.patch(apiUrl + '/api/sessions/' + session._id, body, config)).data;
      fetchSessions();
    } catch (error) {
      if (error.response) {
        console.log('Calendar.js - cancel:', error.response.data);
      } else {
        console.log('Calendar.js - cancel:', error.message);
      }
    }
  }

  function selectDate(date) {
    setDate(moment.unix(date.timestamp / 1000))
  }

  function getDays() {
    let days = {};

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

  function getSessionButtons(session) {
    let button = null;

    if (session.host._id === user_id) {
      if (session.status === 'active') {
        button = <ActionButton title={'Cancel'} colour={WHITE} background={RED_2} cb={() => changeStatus(session, 'cancelled')} />
      } else {
        button = <ActionButton title={'Activate'} colour={WHITE} background={BLUE} cb={() => changeStatus(session, 'active')} />
      }
    } else {
      button = <ActionButton title={'Leave'} colour={WHITE} background={RED_2} cb={() => leave(session)} />;
    }

    return (
      <View style={commonStyles.buttonsContainer}>
        {button}
      </View>
    );
  }

  function getSessions() {
    const daySessions = sessions.filter(session => moment(session.start_date).isSame(date, 'day'));

    return (
      <View style={styles.sessionsContainer}>
        {daySessions.map((session, index) => {
          return (
            <SlotView
              key={index}
              cb={() => {}}
              slot={session}
              isSession={true}
              children={getSessionButtons(session)}
            />
          );
        })}
      </View>
    )
  }

  return (
    <Layout title="Calendar" loading={loading}>
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
  },
  createSchedule: {
    height: 75,
    marginTop: 20,
    borderWidth: 1,
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

export default Calendar;
