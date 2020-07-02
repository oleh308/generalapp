import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { LIGHT_GREY } from '../../constants/colours';

function SelectedInterests({ props, cancelFunc }) {
  const getProp = (prop, index) => {
    return <View key={index} style={[styles.singleInterest, cancelFunc ? {} : styles.extraPadding]}>
      <Text style={styles.propText}>{prop}</Text>
      {cancelFunc && <TouchableOpacity onPress={() => cancelFunc(prop, index)}>
        <Ionicons style={styles.cancelButton} name={'ios-close'} size={24} color={'white'} />
      </TouchableOpacity>}
    </View>
  }

  return <View style={styles.propsContainer}>
    {props.map(getProp)}
  </View>
}

const styles = StyleSheet.create({
  propsContainer: {
    marginTop: 5,
    flexWrap:'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  singleInterest: {
    height: 40,
    elevation: 1,
    paddingLeft: 5,
    paddingRight: 5,
    shadowRadius: 1,
    borderRadius: 12,
    marginBottom: 10,
    marginRight: '3%',
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    flexDirection: 'row',
    backgroundColor: LIGHT_GREY,
    shadowOffset: { height: 0, width: 0 }
  },
  extraPadding: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  cancelButton: {
    width: 30,
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
  },
  propText: {
    color: 'white',
    height: 40,
    lineHeight: 40
  }
})

export default SelectedInterests;
