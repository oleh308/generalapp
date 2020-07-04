import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

function ActionButton({
  cb,
  title,
  colour,
  background,
  height = 35,
  marginTop = 0,
  marginLeft = 0,
  marginRight = 0
}) {

  function getStyles() {
    let base = {
      height,
      marginTop,
      marginLeft,
      marginRight
    }
    let style = [styles.buttonContainer];
    if (background) {
      base = { ...base, backgroundColor: background };
      style.push(styles.shadow);
    }

    style.push(base);

    return style;
  }

  return (
    <TouchableOpacity style={getStyles()} onPress={cb}>
      <Text style={{color: colour}}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
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
