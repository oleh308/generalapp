import { StyleSheet } from 'react-native';
import { LIGHT_GREY } from './constants/colours';

export const commonStyles = StyleSheet.create({
  optionsContainer: {
    marginBottom: 20,
    flexDirection: 'row',
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
  },
  shadow: {
    elevation: 1,
    shadowRadius: 1,
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    shadowOffset: { height: 0, width: 0 }
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  createContainer: {
    height: 50,
    marginTop: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: LIGHT_GREY,
    justifyContent: 'center'
  },
  createText: {
    color: LIGHT_GREY
  }
});
