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
import InputField from '../../components/inputs/InputField';
import ActionButton from '../../components/buttons/ActionButton';

import { commonStyles } from '../../styles';
import { WHITE, BLUE } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { Calendar as CalendarComp, CalendarList, Agenda } from 'react-native-calendars';

function CreateSession({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const { chat, session } = route.params;

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const { api } = useContext(AuthenticationContext);

  const [modal, setModal] = useState(null);
  const [displayTime2, setDisplayTime2] = useState(session ? moment(session.end_date) : null);
  const [displayTime1, setDisplayTime1] = useState(session ? moment(session.start_date) : null);
  const [date, setDate] = useState(session ? moment(session.start_date) : moment().startOf('day'));

  async function create() {
    try {
      let startDate = date.toDate();
      startDate.setHours(moment(displayTime1).hour());
      startDate.setMinutes(moment(displayTime1).minutes());
      let endDate = date.toDate();
      endDate.setHours(moment(displayTime2).hour());
      endDate.setMinutes(moment(displayTime2).minutes());

      const body = {
        chat_id: chat._id,
        end_date: endDate,
        start_date: startDate,
        host_id: chat.host._id,
        user_id: chat.users.length > 0 ? chat.users[0]._id : null,
        status: chat.host._id === user_id ? 'approved' : 'pending',
      }
      const data = (await api.post(apiUrl + '/api/sessions', body, config)).data;
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        console.log('CreateSession.js - create:', error.response.data);
      } else {
        console.log('CreateSession.js - create:', error.message);
      }
    }
  }

  async function update() {
    try {
      let startDate = date.toDate();
      startDate.setHours(moment(displayTime1).hour());
      startDate.setMinutes(moment(displayTime1).minutes());
      let endDate = date.toDate();
      endDate.setHours(moment(displayTime2).hour());
      endDate.setMinutes(moment(displayTime2).minutes());
      console.log(endDate)
      const body = {
        status: 'pending',
        end_date: moment(endDate).format(),
        start_date: moment(startDate).format(),
      }
      const data = (await api.patch(apiUrl + '/api/sessions/' + session._id, body, config)).data;
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        console.log('CreateSession.js - update:', error.response.data);
      } else {
        console.log('CreateSession.js - update:', error.message);
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
    let endDate = date.clone();
    endDate.add(1, 'hour');
    setDisplayTime1(date);
    setDisplayTime2(endDate);
    setModal(null);
  }

  function selectDate(date) {
    setDate(moment.unix(date.timestamp / 1000))
  }

  function getDay() {
    return days[date.day()];
  }

  function goBack() {
    navigation.goBack();
  }

  function getTime(type) {
    if (type === 'from') {
      return displayTime1 ? moment(displayTime1).format('HH:mm') : '';
    } else if (type === 'until') {
      return displayTime2 ? moment(displayTime2).format('HH:mm') : '';
    }
  }

  function getModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={modal ? true : false}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeBackground} onPress={() => setModal()}>
          </TouchableOpacity>
          <View style={[styles.modalContainer, commonStyles.shadow]}>
            <DatePicker
              date={date.toDate()}
              mode={'time'}
              minuteInterval={30}
              onDateChange={date => setDate(moment(date))}
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
    <Layout title={'New Session'} goBack={goBack}>
      <CalendarComp
        onDayPress={selectDate}
        style={styles.calendarContainer}
        markedDates={{
          [date.format('YYYY-MM-DD')]: {
            selected: true,
            selectedColor: BLUE,
            disableTouchEvent: true,
          }
        }}
      />
      <View style={styles.pickersContainer}>
        <TouchableOpacity style={styles.singlePicker} onPress={() => setModal('from')}>
          <InputField title={'From'} property={getTime('from')} editable={false} />
        </TouchableOpacity>
        <View style={[styles.singlePicker, styles.disabledPicker]}>
          <InputField title={'Until'} property={getTime('until')} editable={false} />
        </View>
      </View>
      <View style={commonStyles.buttonsContainer}>
        <ActionButton
          colour={WHITE}
          marginLeft={10}
          background={BLUE}
          cb={session ? update : create}
          title={session ? 'Update' : 'Create'}
        />
      </View>
      {getModal()}
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
