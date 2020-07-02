import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import Layout from '../../components/blocks/Layout.js';

function Confirmation({ navigation }) {
  const { status } = route.params;

  return (
    <Layout title={'Success'} isScroll={true} goBack={() => navigation.goBack()} loading={false}>
      <View style={styles.contentContainer}>
        <Text>Please verify your email address.</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonOpacity1} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonOpacity1: {
    padding: 10,
    borderRadius: 3,
    backgroundColor: 'grey'
  },
  buttonText: {
    color: 'white'
  }
});


export default Confirmation;
