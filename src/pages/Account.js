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
import { useIsFocused } from '@react-navigation/native';

const options = ['Profile', 'Settings'];

function Account({ navigation }) {
  const user_id = SyncStorage.get('user_id');

  const isFocused = useIsFocused();

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const profile = <Profile isEditable={true} id={user_id} navigation={navigation} setLoading={setLoading} />;
  const settings = <Settings id={user_id} navigation={navigation} />;

  return (
    <Layout title={'Account'} isScroll={true} noPadding loading={loading}>
      <TopTabs options={options} tab={tab} setTab={setTab}/>
      {tab === 0 ? profile : settings}
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
