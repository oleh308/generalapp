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
  editable=true,
  isPassword=false,
  autoCorrect=false,
  keyboard='default',
  capitalize="sentences"
}) {
  return <View style={styles.inputContainer}>
    <Text style={styles.inputHeader}>{title}</Text>
    <TextInput
      value={property}
      editable={editable}
      style={styles.input}
      keyboardType={keyboard}
      autoCorrect={autoCorrect}
      autoCapitalize={capitalize}
      secureTextEntry={isPassword}
      onChangeText={text => setProperty(text)}
      pointerEvents={editable ? "auto" : "none"}
      placeholder={placeholder ? placeholder : title}
    />
  </View>
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1
  },
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
