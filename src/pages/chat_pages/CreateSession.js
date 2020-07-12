import React, { useEffect, useState, useContext } from 'react';
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
import InputField from '../../components/inputs/InputField';
import ActionButton from '../../components/buttons/ActionButton';

import { commonStyles } from '../../styles';
import { WHITE, BLUE, RED_2 } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { Calendar as CalendarComp, CalendarList, Agenda } from 'react-native-calendars';

const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function CreateSession({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const { chat, product } = route.params;

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const { api } = useContext(AuthenticationContext);

  const [date, setDate] = useState(moment());
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, [])

  async function fetchSessions() {
    try {
      const data = (await api.get(apiUrl + '/api/products/' + product._id + '/sessions', config)).data;
      setSessions(data);
    } catch(error) {
      if (error.response) {
        console.log('CreateSession.js - fetchSessions:', error.response.data);
      } else {
        console.log('CreateSession.js - fetchSessions:', error.message);
      }
    }
  }

  async function create(slot) {
    try {
      let start_date = date.clone()
      start_date.set({
        hour: moment(slot.start_time).get('hour'),
        minute: moment(slot.start_time).get('minute')
      });
      let end_date = date.clone()
      end_date.set({
        hour: moment(slot.end_time).get('hour'),
        minute: moment(slot.end_time).get('minute')
      });

      const body = {
        status: 'active',
        slot_id: slot._id,
        chat_id: chat._id,
        host_id: chat.host._id,
        product_id: product._id,
        end_date: end_date.format(),
        start_date: start_date.format(),
      }
      const data = (await api.post(apiUrl + '/api/sessions', body, config)).data;
      navigation.goBack()
    } catch (error) {
      if (error.response) {
        console.log('CreateSession.js - create:', error.response.data);
      } else {
        console.log('CreateSession.js - create:', error.message);
      }
    }
  }

  async function leave(session) {
    try {
      const body = {
        chat: chat._id
      }

      const data = (await api.post(apiUrl + '/api/sessions/' + session._id + '/leave', body, config)).data;
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        console.log('PrivateSettings.js - leave:', error.response.data);
      } else {
        console.log('PrivateSettings.js - leave:', error.message);
      }
    }
  }

  async function join(session) {
    try {
      const body = {
        chat: chat._id
      }

      const data = (await api.post(apiUrl + '/api/sessions/' + session._id + '/join', body, config)).data;
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        console.log('PrivateSettings.js - leave:', error.response.data);
      } else {
        console.log('PrivateSettings.js - leave:', error.message);
      }
    }
  }

  function selectDate(date) {
    setDate(moment.unix(date.timestamp / 1000))
  }

  function goBack() {
    navigation.goBack()
  }

  function getDays() {
    let days = {}
    let iterateDate = moment();

    for (let i = 0; i < 14; i++) {
      const iterateDay = iterateDate.isoWeekday() - 1;
      const dayKey = weekDays[iterateDay] + '_slots';
      if (product[dayKey].length > 0) {
        days[moment(iterateDate).format('YYYY-MM-DD')] = {
          marked: true,
          dotColor: BLUE
        }
      }
      iterateDate.add(1, 'day');
    }

    days[date.format('YYYY-MM-DD')] = {
      selected: true,
      selectedColor: BLUE,
      disableTouchEvent: true,
    }

    return days;
  }

  function getSessionButtons(session) {
    let button = null;

    if (session.chats.includes(chat._id)) {
      button = <ActionButton title={'Leave'} colour={WHITE} background={RED_2} cb={() => leave(session)} />;
    } else {
      button = <ActionButton title={'Join'} colour={WHITE} background={BLUE} cb={() => join(session)} />;
    }

    return (
      <View style={commonStyles.buttonsContainer}>
        {button}
      </View>
    )
  }

  function getButtons(slot) {
    return (
      <View style={commonStyles.buttonsContainer}>
        <ActionButton title={'Join'} colour={WHITE} background={BLUE} cb={() => create(slot)} />
      </View>
    )
  }

  function getSessions() {
    const day = date.isoWeekday() - 1;
    const dayKey = weekDays[day] + '_slots';
    let slots = product[dayKey];
    let daySessions = sessions.filter(session => moment(session.start_date).isSame(date, 'day'));

    slots = slots.filter(slot => {
      const exists = daySessions.find(session => session.slot._id === slot._id);

      return exists ? false : true;
    });

    slots = slots.concat(daySessions);
    slots.sort(function (left, right) {
      const hourOne = left.slot ? moment(left.slot.start_time).hour() : moment(left.start_time).hour()
      const hourTwo = right.slot ? moment(right.slot.start_time).hour() : moment(right.start_time).hour()
      return hourOne - hourTwo;
    });

    return (
      <View style={styles.sessionsContainer}>
        {slots.map((slot, index) => {
          if (slot.slot) {
            return (
              <SlotView
                key={index}
                slot={slot}
                cb={() => {}}
                isSession={true}
                children={getSessionButtons(slot)}
              />
            );
          } else {
            return (
              <SlotView
                key={index}
                slot={slot}
                cb={() => {}}
                children={getButtons(slot)}
              />
            )
          }
        })}
      </View>
    )
  }

  return (
    <Layout title={'Join session'} goBack={goBack}>
      <CalendarComp
        onDayPress={selectDate}
        style={styles.calendarContainer}
        markedDates={getDays()}
      />
      {getSessions()}
    </Layout>
  )
}

const styles = StyleSheet.create({
  pickersContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  singlePicker: {
    width: '49%',
  },
  disabledPicker: {
    opacity: 0.4,
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
  }
});

export default CreateSession;
