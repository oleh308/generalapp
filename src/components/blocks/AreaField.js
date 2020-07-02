import React from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';

import { GREY } from '../../constants/colours';

function AreaField ({property, title, setProperty, height=250}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputHeader}>{title}</Text>
      <TextInput style={[styles.input, {height}]} placeholder={'Write...'} numberOfLines={10}
        multiline={true} value={property} onChangeText={text => setProperty(text)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  input: {
    elevation: 1,
    width: '100%',
    shadowRadius: 1,
    borderRadius: 12,
    paddingLeft: '3%',
    paddingRight: '3%',
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    backgroundColor: 'white',
    shadowOffset: { height: 0, width: 0 },
  },
  inputHeader: {
    color: GREY,
    marginTop: 20,
    marginLeft: 7,
    marginBottom: 2,
  },
})

export default AreaField = React.memo(AreaField);
