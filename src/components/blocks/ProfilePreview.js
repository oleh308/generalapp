import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Follow from '../buttons/Follow';
import SyncStorage from 'sync-storage';
import Following from '../buttons/Following';
import SelectedProps from './SelectedProps';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { commonStyles } from '../../styles';
import { AuthenticationContext } from '../../context/AutheticationContext';

function ProfilePreview({ profile, navigation, refresh }) {
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const { name, surname, image, mentor, _id } = profile;

  async function toggleFollow() {
    try {
      const data = (await api.post(apiUrl + '/api/users/follow/' + _id, {}, config)).data
      profile.following_user = !profile.following_user;
      refresh()
    } catch (error) {
      if (error.response) {
        console.log('ProfilePreview - toggleFollow:', error.response.data);
      } else {
        console.log('ProfilePreview - toggleFollow:', error.message);
      }
    }
  }

  function navigateProfile() {
    profile.id = profile._id;
    navigation.navigate('ProfilePage', { profile: profile });
  }

  function getImageUri(image) {
    if (image) {
      return apiUrl + '/api/image/' + image;
    } else {
      return "https://via.placeholder.com/200x200";
    }
  }

  function getMentorTag() {
    const text = mentor ? 'Mentor' : 'Mentee';
    const style = mentor ? [styles.profileTag, styles.mentorTag] : [styles.profileTag, style.menteeTag];

    return <Text style={style}>{text}</Text>
  }

  return (
    <TouchableOpacity style={[styles.profileContainer, commonStyles.shadow]} onPress={navigateProfile}>
      <Image style={styles.profileImage} source={{ uri: getImageUri(image) }} />
      <View style={styles.profileDetails}>
        <Text style={styles.profileName}>{name + ' ' + surname}</Text>
        {getMentorTag()}
      </View>
      {profile.following_user ?
        <Following unfollow={toggleFollow}/> :
        <Follow follow={toggleFollow}/>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  profileContainer: {
    paddingTop: 10,
    borderRadius: 12,
    paddingBottom: 10,
    paddingLeft: '5%',
    paddingRight: '5%',
    borderColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 10
  },
  profileImage: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderRadius: 37.5,
    borderColor: '#E5E5E5'
  },
  profileDetails: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600"
  },
  profileTag: {
    height: 20,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: '5%',
    paddingRight: '5%',
    textAlign: 'center',
    alignSelf: 'flex-start'
  },
  mentorTag: {
    color: 'green',
    borderColor: 'green'
  },
  extraMargin: {
    height: 10
  },
})

export default ProfilePreview = React.memo(ProfilePreview);
