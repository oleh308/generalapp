import React, { useEffect, useState, useContext, Fragment } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';
import SyncStorage from 'sync-storage';
import useKeyboard from '@rnhooks/keyboard';
import DatePicker from 'react-native-date-picker';
import Layout from '../../components/blocks/Layout';
import AreaField from '../../components/inputs/AreaField';
import InputField from '../../components/inputs/InputField';
import ActionButton from '../../components/buttons/ActionButton';

import { commonStyles } from '../../styles';
import { WHITE, BLUE, RED_2 } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function CreateSlot({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const { day, product, slot, index } = route.params;

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const [visible, dismiss] = useKeyboard();
  const { api } = useContext(AuthenticationContext);

  const [modal, setModal] = useState(null);
  const [capacity, setCapacity] = useState(slot ? slot.capacity : 1);
  const [duration, setDuration] = useState(slot ? slot.duration : 1);
  const [displayTime2, setDisplayTime2] = useState(slot ? moment(slot.end_time) : null);
  const [displayTime1, setDisplayTime1] = useState(slot ? moment(slot.start_time) : null);
  const [date, setDate] = useState(slot ? moment(slot.start_time) : moment().startOf('day'));

  useEffect(() => {
    if (!visible && capacity === 0) setCapacity(1);
    if (!visible && duration === 0) setDuration(1);
  }, [visible]);

  async function create() {
    if (!product._id) return saveLocally(null);
    try {
      const body = {
        duration,
        capacity,
        day_key: days[day],
        end_time: displayTime2.format(),
        start_time: displayTime1.format()
      };

      const data = (await api.post(apiUrl + '/api/products/' + product._id + '/slots', body, config)).data;
      console.log(data);
      saveLocally(data.id);
    } catch (error) {
      if (error.response) {
        console.log('CreateSlot.js - create:', error.response.data);
      } else {
        console.log('CreateSlot.js - create:', error.message);
      }
    }
  }

  async function update() {
    if (!product._id) return updateLocally();

    try {
      const body = {
        duration,
        capacity,
        end_time: displayTime2.format(),
        start_time: displayTime1.format()
      };

      const data = (await api.patch(apiUrl + '/api/products/' + product._id + '/slots/' + slot._id, body, config)).data;
      updateLocally();
    } catch (error) {
      if (error.response) {
        console.log('CreateSlot.js - update:', error.response.data);
      } else {
        console.log('CreateSlot.js - update:', error.message);
      }
    }
  }

  async function deleteFunc() {
    if (!product._id) return deleteLocally();

    try {
      const data = (await api.delete(apiUrl + '/api/products/' + product._id + '/slots/' + slot._id, config)).data;
      deleteLocally();
    } catch (error) {
      if (error.response) {
        console.log('CreateSlot.js - delete:', error.response.data);
      } else {
        console.log('CreateSlot.js - delete:', error.message);
      }
    }
  }

  function deleteLocally() {
    const key = days[day] + '_slots';
    product[key].splice(index, 1);
    navigation.navigate('AddProduct', { product });
  }

  function updateLocally() {
    const key = days[day] + '_slots';
    product[key][index] = {
      ...product[key][index],
      duration,
      capacity,
      end_time: displayTime2.format(),
      start_time: displayTime1.format()
    }

    navigation.navigate('AddProduct', { product });
  }

  function saveLocally(id) {
    const key = days[day] + '_slots';
    let slot = {
      duration,
      capacity,
      end_time: displayTime2.format(),
      start_time: displayTime1.format()
    }
    if (id) slot._id = id;
    product[key] = [...product[key], slot]

    navigation.navigate('AddProduct', { product });
  }

  function goBack() {
    navigation.goBack();
  }

  function selectTime() {
    let endDate = date.clone();
    endDate.add(duration, 'hour');
    setDisplayTime1(date);
    setDisplayTime2(endDate);
    setModal(null);
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

  function getEditButtons() {
    return (
      <Fragment>
        <ActionButton title={'Delete'} colour={RED_2} cb={deleteFunc} />
        <ActionButton title={'Edit'} colour={WHITE} background={BLUE} cb={update} />
      </Fragment>
    );
  }

  function getCreateButtons() {
    return <ActionButton title={'Create'} colour={WHITE} background={BLUE} cb={create} />;
  }

  return (
    <Layout title={'Create Slot'} goBack={goBack}>
      <View>
        <InputField
          title={'Capacity'}
          keyboard={'number-pad'}
          setProperty={setCapacity}
          property={String(capacity)}
        />
        <InputField
          title={'Duration (hours)'}
          keyboard={'number-pad'}
          setProperty={setDuration}
          property={String(duration)}
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
          {slot ? getEditButtons() : getCreateButtons()}
        </View>
      </View>
      {getModal()}
    </Layout>
  );
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
})

export default CreateSlot;
