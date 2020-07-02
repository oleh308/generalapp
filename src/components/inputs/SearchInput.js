import React from 'react';
import { TextInput, Text, StyleSheet, View } from 'react-native';

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
    width: '100%',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: '2%',
    borderColor: 'grey',
    backgroundColor: 'white'
  },
  inputHeader: {
    marginTop: 20
  },
})

export default SearchInput = React.memo(SearchInput);
