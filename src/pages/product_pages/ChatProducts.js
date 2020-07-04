import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Layout from '../../components/blocks/Layout';

function ChatProducts({ navigation }) {
  function goBack() {
    navigation.goBack();
  }

  return (
    <Layout title={'Products'} goBack={goBack}>
    </Layout>
  );
}

const styles = StyleSheet.create({

});

export default ChatProducts;
