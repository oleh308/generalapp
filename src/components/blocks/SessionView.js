import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';
import SyncStorage from 'sync-storage';
import ActionButton from '../buttons/ActionButton';

import { commonStyles } from '../../styles';
import { BLUE, RED_2, WHITE, LIGHT_GREY, GREEN } from '../../constants/colours';

function SessionView({ session, buttons }) {
  const user_id = SyncStorage.get('user_id');

  function getDate() {
    const startDate = moment(session.start_date);

    return startDate.format('DD MMM');
  }

  function getTime() {
    const endDate = moment(session.end_date);
    const startDate = moment(session.start_date);

    return startDate.format('HH:mm') + ' - ' + endDate.format('HH:mm');
  }

  function getStatus() {
    if (session.status === 'active') {
      if (moment().isAfter(moment(session.end_date))) {
        return <Text style={[styles.labelText, styles.doneText]}>Done</Text>
      } else {
        return <Text style={[styles.labelText, styles.approvedText]}>Active</Text>
      }
    } else if (session.status === 'cancelled') {
      return <Text style={[styles.labelText, styles.cancelledText]}>Cancelled</Text>
    } else {
      return '';
    }
  }

  function getButtons() {
    // let button = null;
    //
    // if (session.status === 'pending') {
    //   if (user_id === session.mentor._id) {
    //     button = <ActionButton title="Approve" colour={WHITE} background={BLUE} cb={() => update('approved')} />;
    //   } else {
    //     button = <ActionButton title="Edit" colour={WHITE} background={BLUE} cb={navigateEdit}/>;
    //   }
    // } else if (session.status === 'approved') {
    //   button = <ActionButton title="Cancel" colour={WHITE} background={RED_2} cb={() => update('cancelled')} />;
    // } else if (session.status === 'cancelled' && user_id === session.user._id) {
    //   button = <ActionButton title="Edit" colour={WHITE} background={BLUE} cb={navigateEdit}/>;
    // }
    //
    return (
      <View style={commonStyles.buttonsContainer}>

      </View>
    )
  }

  return (
    <View style={[styles.sessionContainer, commonStyles.shadow]}>
      <View style={styles.headerContainer}>
        <Text style={styles.dateText}>{getDate()}</Text>
        {getStatus()}
      </View>
      <Text style={styles.timeText}>{getTime()}</Text>
      {buttons ? buttons : void(0)}
    </View>
  )
}

const styles = StyleSheet.create({
  sessionContainer: {
    paddingTop: 10,
    borderRadius: 12,
    marginBottom: 10,
    paddingBottom: 10,
    paddingLeft: '3%',
    paddingRight: '3%',
    backgroundColor: 'white'
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600"
  },
  timeText: {
    color: LIGHT_GREY
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  doneText: {
    color: LIGHT_GREY,
    borderColor: LIGHT_GREY,
  },
  approvedText: {
    color: GREEN,
    borderColor: GREEN
  },
  cancelledText: {
    color: RED_2,
    borderColor: RED_2
  },
  labelText: {
    paddingTop: 5,
    borderWidth: 1,
    paddingLeft: 10,
    paddingBottom: 5,
    borderRadius: 12,
    paddingRight: 10,
  }
});

export default SessionView;
