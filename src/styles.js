import { StyleSheet } from 'react-native';

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
  }
});
