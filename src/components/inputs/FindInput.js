import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import InputField from './InputField';

const equalPrefix = (str1, str2) => {
  if (typeof str1 !== 'string' || typeof str2 !== 'string') return false;
  else if (str1.length === 0 || str2.length === 0) return false;

  if (str1.substring(0, str2.length).toLowerCase() === str2.toLowerCase()) return true;
  else if (str2.substring(0, str1.length).toLowerCase() === str1.toLowerCase()) return true;
  else return false;
}

function FindInput ({property, title, setProperty, isPassword=false, data, prop, selectProperty}) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    try {
      let results = data.filter(single => equalPrefix(single[prop], property));
      setResults(Array.isArray(results) ? results.slice(0, results.length > 5 ? 5 : results.length) : []);
    } catch {
      console.log('SearchInput.js - useEffect:', error.message);
    }
  }, [property])

  const select = (data) => {
    let cb = () => {
      setResults([]);
    }
    selectProperty(data, cb);
  }

  const getResultView = (data, index) => {
    const style = [styles.resultView, results.length - 1 !== index ? styles.borderBottom : {}];

    return (
      <TouchableOpacity key={index} style={style} onPress={() => select(data)}>
        <Text>{data[prop]}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.inputContainer}>
      <InputField title={title} property={property} setProperty={setProperty} />
      {results.map(getResultView)}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  resultView: {
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: '2%',
    justifyContent: 'center',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  }
})

export default FindInput = React.memo(FindInput);
