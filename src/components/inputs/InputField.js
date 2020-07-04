import React from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import { GREY, BLACK } from '../../constants/colours';

function InputField ({
  title,
  property,
  setProperty,
  placeholder,
  isPassword=false,
  autoCorrect=false,
  capitalize="sentences"
}) {
  return <View style={styles.inputContainer}>
    <Text style={styles.inputHeader}>{title}</Text>
    <TextInput
      value={property}
      style={styles.input}
      autoCorrect={autoCorrect}
      autoCapitalize={capitalize}
      secureTextEntry={isPassword}
      onChangeText={text => setProperty(text)}
      placeholder={placeholder ? placeholder : title}
    />
  </View>
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    elevation: 1,
    width: '100%',
    shadowRadius: 1,
    borderRadius: 10,
    paddingLeft: '3%',
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    backgroundColor: 'white',
    shadowOffset: { height: 0, width: 0 },
  },
  inputHeader: {
    color: GREY,
    marginTop: 10,
    marginLeft: 7,
    marginBottom: 2,
  },
})

export default InputField = React.memo(InputField);