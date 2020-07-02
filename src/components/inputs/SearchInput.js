import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

import { GREY } from '../../constants/colours';

function SearchInput ({property, title, setProperty, placeholder, cb}) {
  return <View style={styles.inputContainer}>
    <Text style={styles.inputHeader}>{title}</Text>
    <TextInput
      value={property}
      style={styles.input}
      onSubmitEditing={cb}
      returnKeyType={'search'}
      onChangeText={text => setProperty(text)}
      placeholder={placeholder ? placeholder : title}
    />
  </View>
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
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

export default SearchInput = React.memo(SearchInput);
