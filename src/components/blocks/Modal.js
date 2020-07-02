import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { TITLE_SIZE } from '../../constants/sizes';

function Modal({ alert }) {
  const { title, text, buttons } = alert;

  function getButtons() {
    return buttons.map((button, index) => {
      const style = [styles.buttonContainer, buttons.length - 1 !== index ? styles.borderRight: {}];

      return (
        <TouchableOpacity key={index} style={style} onPress={button.cb}>
          <Text style={{color: button.color}}>{button.title}</Text>
        </TouchableOpacity>
      );
    })
  }

  return (
    <View style={styles.coverPage}>
      <View style={styles.modalContent}>
        <View style={styles.textContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text>{text}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          {getButtons()}
        </View>
        {/*<TouchableOpacity style={styles.closeIcon} onPress={clear}>
          <Ionicons name={'ios-close'} size={24} color={'grey'} />
        </TouchableOpacity>*/}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  coverPage: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    width: '80%',
    elevation: 1,
    minHeight: 120,
    borderRadius: 6,
    shadowRadius: 10,
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    shadowOffset: { height: 0, width: 0 },
  },
  textContainer: {
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  modalTitle: {
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: TITLE_SIZE,
  },
  modalText: {
    paddingLeft: ''
  },
  buttonsContainer: {
    marginTop: 15,
    flexDirection: 'row'
  },
  buttonContainer: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  borderRight: {
    borderColor: 'grey',
    borderRightWidth: 1
  }
});

export default Modal;
