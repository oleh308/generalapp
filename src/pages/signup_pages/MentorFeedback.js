import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import Layout from '../../components/blocks/Layout.js';

function MentorFeedback({ route, navigation }) {
  const { status } = route.params;

  function getMessage() {
    if (status === 'isNotMentor') {
      return "We counldn't find a mentor account with such credentials, please try to login as a user.";
    } else if (status === 'mentorIsPending') {
      return 'We are still reviewing your application, please wait.';
    }  else if (status === 'mentorIsNotApproved') {
      return "Unfortunately you didn't pass the approval procedure, if you are have any questions, please contanct us.";
    } else {
      return '';
    }
  }

  function getTitle() {
    if (status === 'isNotMentor') {
      return 'Not found';
    } else if (status === 'mentorIsPending') {
      return 'Pending';
    } else if (status === 'mentorIsNotApproved') {
      return "Not approved";
    } else {
      return '';
    }
  }

  return (
    <Layout title={getTitle()} isScroll={true} goBack={() => navigation.goBack()} loading={false}>
      <View style={styles.contentContainer}>
        <Text>{getMessage()}</Text>
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


export default MentorFeedback;
