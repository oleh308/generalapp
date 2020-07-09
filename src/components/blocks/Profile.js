import React, { useState, useEffect, useContext, Fragment } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Modal from './Modal';
import Follow from '../buttons/Follow';
import SyncStorage from 'sync-storage';
import ChatActions from './ChatActions';
import ProfileStats from './ProfileStats';
import TimelinePost from './TimelinePost';
import SelectedProps from './SelectedProps';
import Following from '../buttons/Following';
import ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useIsFocused } from '@react-navigation/native';
import { ModelContext } from '../../context/ModelContext';
import { ProfileContext } from '../../context/ProfileContext';
import { BLUE, RED_2, LIGHT_GREY, WHITE } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';

function Profile({ isEditable, user, update, navigation, setLoading }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const { api } = useContext(AuthenticationContext);
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();
  const [edit, setEdit] = useState(null);
  const [following, setFollowing] = useState(user.followers && user.followers.includes(user_id));

  const owner = user_id === user._id;
  const isMentor = user && user.mentor && user.mentor.status === 'approved';

  async function uploadImage(image) {
    try {
      const data = new FormData();
      const ext = image.type ? image.type.split('/').pop() : 'png';

      data.append("file", {
        type: image.type,
        name: image.fileName ? image.fileName : 'image' + id + '.' + ext,
        uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", "")
      });

      const response = (await api.post(apiUrl + '/api/users/image/' + id, data, config)).data;
      if (response.success) {
        user.image = response.image;
        update({...user});
      }
    } catch (error) {
      if (error.response) {
        console.log('Profile.js - uploadImage:', error.response.data);
      } else {
        console.log('Profile.js - uploadImage:', error.message);
      }
    }
  }

  async function toggleFollow() {
    try {
      const data = (await api.post(apiUrl + '/api/users/follow/' + id, {}, config)).data
      setFollowing(!following);
    } catch (error) {
      if (error.response) {
        console.log('ProfilePreview - toggleFollow:', error.response.data);
      } else {
        console.log('ProfilePreview - toggleFollow:', error.message);
      }
    }
  }

  function chooseImage() {
    const options = {
      noData: true
    }

    ImagePicker.launchImageLibrary(options, async response => {
      if (response.uri) {
        uploadImage(response);
        console.log(response)
      }
    })
  }

  async function joinChat() {
    try {
      const data = (await api.post(apiUrl + '/api/chats/public/join/' + id, {}, config)).data

      navigateChat(data.id);
    } catch (error) {
      if (error.response) {
        console.log('Profile.js - joinChat:', error.response.data);
      } else {
        console.log('Profile.js - joinChat:', error.message);
      }
    }
  }

  function navigateChat(id) {
    SyncStorage.set('chatRedirect', id);
    navigation.navigate('ChatsStack', { screen: 'Chats' });
  }

  function navigateProducts() {
    navigation.navigate('ChatProducts', { id: user._id });
  }

  const getMentorTag = () => {
    const text = isMentor ? 'Mentor' : 'Mentee';
    const style = isMentor ? [styles.profileTag, styles.mentorTag] : [styles.profileTag, styles.menteeTag];

    return <Text style={style}>{text}</Text>
  }

  const getArea = (area, index) => {
    return <Text key={index} style={styles}>{area}</Text>
  }

  const getPost = (post, index) => {
    post.author = {
      name: user.name,
      image: user.image,
      surname: user.surname,
    }
    return (
      <TimelinePost
        key={index}
        post={post}
        owner={true}
        isEditable={isEditable}
        navigation={navigation}
        refresh={() => update({...user})}
      />
    )
  }

  function EditableName({ children }) {
    const cb = () => navigation.navigate('ChangeName', { user: user });
    return isEditable ?
      <TouchableOpacity style={styles.editNameContainer} onPress={cb}>
        {children}
        <MaterialIcons style={styles.editIcon} name="edit" size={20} color={LIGHT_GREY} />
      </TouchableOpacity> :
      <View>{children}</View>
  }

  function EditableTags({ children, type, tags }) {
    const cb = () => navigation.navigate('AddTag', { type, tags });

    return isEditable ?
      <TouchableOpacity onPress={cb}>
        {children}
      </TouchableOpacity> :
      <View>{children}</View>
  }

  function EditableAbout({ children }) {
    const cb = () => navigation.navigate('ChangeAbout', { aboutPrev: user.about });

    return isEditable ?
      <TouchableOpacity onPress={cb}>
        {children}
      </TouchableOpacity> :
      <View>{children}</View>
  }

  function EditableImage({ children }) {
    return isEditable ?
      <TouchableOpacity style={styles.imageContainer} onPress={chooseImage}>
        {children}
      </TouchableOpacity> :
      <View style={styles.imageContainer}>{children}</View>
  }

  function getTags(tags) {
    if (tags.length === 0) {
      return <Text style={styles.addNewText}>Add new</Text>
    } else {
      return <SelectedProps props={tags} cancelFunc={null} />
    }
  }

  function getAbout(about) {
    if (about) {
      return (
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>{about}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.aboutContainer}>
          <Text style={[styles.aboutText, styles.addAbout]}>Write...</Text>
        </View>
      );
    }
  }

  function getAreas() {
    if (!isMentor) return void(0)

    return (
      <EditableTags type={'areas'} tags={user.mentor.areas}>
        <Text style={styles.profileTitle}>Expertises</Text>
        <View style={styles.areasContainer}>
          {getTags(user.mentor.areas)}
        </View>
      </EditableTags>
    )
  }

  function getImageUri() {
    if (user.image) {
      return apiUrl + '/api/image/' + user.image + `?${new Date().getTime()}`;
    } else {
      return "https://via.placeholder.com/200x200";
    }
  }

  function getFollowButton() {
    if (owner) return void(0);

    return (
      <View style={styles.followContainer}>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
          <Ionicons name="ios-add" size={24} color="grey" />
        </TouchableOpacity>
      </View>
    )
  }

  function getFollowActions() {
    if (owner) return void(0);

    return following ?
      <Following unfollow={toggleFollow} /> :
      <Follow follow={toggleFollow} />
  }

  return user ?
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <EditableImage>
          {user.image ?
            <Image style={styles.profileImage} source={{ uri: getImageUri() }}  /> :
            <View style={styles.profileDummy}>
              <Ionicons name="ios-person" size={64} color={LIGHT_GREY}/>
            </View>
          }
        </EditableImage>
        <View style={styles.headerRight}>
          <View style={styles.headerRightTop}>
            <View style={styles.headerRightTopFirst}>
              <EditableName>
                <Text style={styles.profileName}>{user.name + ' ' + user.surname}</Text>
              </EditableName>
              {getMentorTag(user)}
            </View>
            {getFollowActions()}
          </View>
          {!owner && <ChatActions profile={user} cb={joinChat} cb2={navigateProducts}/>}
        </View>
      </View>
      <ProfileStats profile={user} />
      <View>
        {getAreas()}
        <EditableTags type={'interests'} tags={user.interests}>
          <Text style={styles.profileTitle}>Interests</Text>
          <View style={styles.areasContainer}>
            {getTags(user.interests)}
          </View>
        </EditableTags>
        <EditableAbout type={'about'}>
          <Text style={styles.profileTitle}>About</Text>
          {getAbout(user.about)}
        </EditableAbout>
        {isMentor && <Fragment>
          <Text style={styles.profileTitle}>Recent posts</Text>
          <View>
            {user.posts.map(getPost)}
            {user.posts.length === 0 && <Text style={styles.addAbout}>No posts yet</Text>}
          </View>
        </Fragment>}
      </View>
    </View> : <View />
}

const styles = StyleSheet.create({
  profileContainer: {
    marginBottom: 75,
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  profileHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'grey',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileDummy: {
    width: 100,
    height: 100,
    elevation: 1,
    shadowRadius: 1,
    borderRadius: 50,
    marginBottom: 10,
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowOffset: { height: 0, width: 0 },
  },
  headerRight: {
    flex: 1
  },
  headerRightTop: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRightTopFirst: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold"
  },
  profileTag: {
    height: 20,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 2,
    textAlign: 'center',
  },
  mentorTag: {
    color: BLUE,
    borderColor: BLUE
  },
  menteeTag: {
    color: RED_2,
    borderColor: RED_2
  },
  followContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  followButton: {
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: '5%',
    paddingRight: '5%',
    borderColor: 'grey',
    alignItems: 'center',
    flexDirection: 'row'
  },
  followText: {
    color: 'grey',
    paddingRight: '5%',
  },
  noProfile: {
    flex: 1,
    textAlign: 'center'
  },
  areasContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  addNewText: {
    height: 40,
    color: 'grey'
  },
  aboutContainer: {
    elevation: 1,
    borderRadius: 12,
    marginBottom: 10,
    shadowRadius: 1,
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    backgroundColor: WHITE,
    shadowOffset: { height: 0, width: 0 }
  },
  addAbout: {
    color: LIGHT_GREY
  },
  aboutText: {
    padding: '5%',
  },
  profileTitle: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
  },
  buttonOne: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonsContainer: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  areaEdit: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editNameContainer: {
    flexDirection: 'row'
  },
  editIcon: {
    paddingTop: 2,
    marginLeft: 5
  }
});

export default Profile = React.memo(Profile);
