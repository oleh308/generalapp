import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

function ActionButton({ title, marginLeft = 0, cb, colour, background }) {
  const style = background ?
    [styles.buttonContainer, { marginLeft, backgroundColor: background }, styles.shadow] :
    [styles.buttonContainer, { marginLeft} ];

  return (
    <TouchableOpacity style={style} onPress={cb}>
      <Text style={{color: colour}}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 35,
    paddingLeft: 17,
    paddingRight: 17,
    borderRadius: 12,
    justifyContent: 'center',
  },
  shadow: {
    elevation: 1,
    shadowRadius: 1,
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    shadowOffset: { height: 0, width: 0 }
  }
});

export default ActionButton;
