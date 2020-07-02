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
  }
});
