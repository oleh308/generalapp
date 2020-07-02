import React, { useState, useEffect, useContext } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import SyncStorage from 'sync-storage';
import Layout from '../components/blocks/Layout';
import Profile from '../components/blocks/Profile';
import Loading from '../components/blocks/Loading';
import TopTabs from '../components/blocks/TopTabs';
import Settings from '../components/blocks/Settings';

const options = ['Profile', 'Settings'];

function Account({ navigation }) {
  const user_id = SyncStorage.get('user_id');

  const [tab, setTab] = useState(1);
  const [loading, setLoading] = useState(true);

  return (
    <Layout title={'Account'} isScroll={true} noPadding>
      <TopTabs options={options} tab={tab} setTab={setTab}/>
      {tab === 0 ?
        <Profile isEditable={true} id={user_id} navigation={navigation}/> :
        <Settings/>
      }
    </Layout>
  )
}


const styles = StyleSheet.create({
  optionsContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  optionButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedOption: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  }
});

export default Account;
