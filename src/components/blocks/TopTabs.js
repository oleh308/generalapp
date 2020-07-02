import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

function TopTabs({ options, tab, setTab }) {

  function getOptions() {
    return options.map((option, index) => {
      const style = index === tab ? [styles.selectedOption, styles.optionButton] : styles.optionButton;
      return (
        <TouchableOpacity key={index} style={style} onPress={() => setTab(index)}>
          <Text>{option}</Text>
        </TouchableOpacity>
      )
    })
  }

  return (
    <View style={styles.optionsContainer}>
      {getOptions()}
    </View>
  )
}

const styles = StyleSheet.create({
  optionsContainer: {
    elevation: 1,
    shadowRadius: 1,
    marginBottom: 20,
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowOffset: { height: 0, width: 0 },
  },
  optionButton: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedOption: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  }
})

export default TopTabs;
