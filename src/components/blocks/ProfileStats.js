import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import { LIGHT_GREY } from '../../constants/colours';

function ProfileStats({ profile }) {
  const peopleInChat = profile.chat_users ? profile.chat_users : 0;
  const amountOfPrivate = profile.clients ? profile.clients : 0;
  const following = profile.following ? profile.following.length : 0;
  const followers = profile.followers ? profile.followers.length : 0;

  return (
    <View style={styles.statsContainer}>
      <View style={[styles.singleContainer, styles.borderRight]}>
        <Text style={styles.amountText}>{following}</Text>
        <Text style={styles.titleText}>followings</Text>
      </View>
      <View style={[styles.singleContainer, profile.mentor ? styles.borderRight : {}]}>
        <Text style={styles.amountText}>{followers}</Text>
        <Text style={styles.titleText}>followers</Text>
      </View>
      {profile.mentor && <Fragment>
        <View style={[styles.singleContainer, styles.borderRight]}>
          <Text style={styles.amountText}>{peopleInChat}</Text>
          <Text style={styles.titleText}>in chat</Text>
        </View>
        <View style={styles.singleContainer}>
          <Text style={styles.amountText}>{amountOfPrivate}</Text>
          <Text style={styles.titleText}>clients</Text>
        </View>
      </Fragment>}
    </View>
  )
}

const styles = StyleSheet.create({
  statsContainer: {
    flex: 1,
    height: 75,
    alignItems: 'center',
    flexDirection: 'row',
  },
  singleContainer: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: LIGHT_GREY
  },
  amountText: {
    fontSize: 22,
    fontWeight: '600'
  },
  titleText: {
    color: 'grey'
  }
})

export default ProfileStats;
