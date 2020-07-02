import React, { Fragment } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';
import moment from 'moment';
import SyncStorage from 'sync-storage';
import SelectedProps from './SelectedProps';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { LIGHT_GREY } from '../../constants/colours';

function TimelinePost({ post, navigation, owner, refresh, isEditable }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const {
    _id,
    date,
    title,
    image,
    likes,
    author,
    content,
    comments,
    created_at,
  } = post;
  const mylike = likes ? likes.find(like => like.author._id === user_id) : null;

  async function like() {
    try {
      const data = (await axios.post(apiUrl + '/api/likes/' + _id, {}, config)).data;
      if (refresh) toggleLike()
    } catch (error) {
      if (error.response) {
        console.log('TimelinePost:', error.response.data);
      } else {
        console.log('TimelinePost:', error.message);
      }
    }
  }

  function toggleLike() {
    let newLikes = likes;
    if (!newLikes) newLikes = [];

    if (mylike) {
      newLikes.splice(likes.indexOf(mylike), 1);
    } else {
      newLikes.push({
        author: { _id: user_id }
      })
    }
    post.likes = newLikes;
    refresh()
  }

  function openPost() {
    navigation.push('Post', { post, editable: isEditable });
  }

  function openAuthor() {
    navigation.navigate('ProfilePage', { profile: author });
  }

  function getHeader() {
    if (owner) {
      return (
        <View style={styles.postHeader}>
          <Image style={styles.authorImage} source={{ uri: getImageUri(author.image) }} />
          <View style={styles.authorName}>
            <Text>{author.name + ' ' + author.surname}</Text>
          </View>
        </View>
      )
    } else {
      return (
        <TouchableOpacity style={styles.postHeader} onPress={openAuthor}>
          <Image style={styles.authorImage} source={{ uri: getImageUri(author.image) }} />
          <View style={styles.authorName}>
            <Text>{author.name + ' ' + author.surname}</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  function getContent() {
    if (content.length > 200) {
      return (
        <Fragment>
          {content.substring(0, 200).trim() + '... '}
          <Text style={styles.readMore}>Read more</Text>
        </Fragment>
      )
    } else {
      return content;
    }
  }

  function getLikeIcon() {
    if (mylike) {
      return <Ionicons name={'ios-heart'} size={20} color={'#DC4747'} />
    } else {
      return <Ionicons name={'ios-heart-empty'} size={20} color={'grey'} />
    }
  }

  function getImageUri(image) {
    if (image) {
      return apiUrl + '/api/image/' + image;
    } else {
      return "https://via.placeholder.com/200x200";
    }
  }

  function getImage() {
    if (image) {
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri: getImageUri(image) }} style={styles.image}/>
        </View>
      );
    } else {
      return void(0);
    }
  }

  return (
    <TouchableOpacity style={styles.postContainer} onPress={openPost}>
      {getHeader()}
      <View style={styles.contentContainer}>
        <Text style={styles.postTitle}>{title}</Text>
        {getImage()}
        <Text>{getContent()}</Text>
      </View>
      <View style={styles.postFooter}>
        <View style={styles.likeContainer}>
          <TouchableOpacity onPress={like}>
            {getLikeIcon()}
          </TouchableOpacity>
          <Text style={styles.amountText}>{likes ? likes.length : 0}</Text>
          <Ionicons name={'ios-chatboxes'} size={18} color={'grey'}/>
          <Text style={styles.amountText}>{comments ? comments.length : 0}</Text>
        </View>
        <Text style={styles.dateText}>{moment(created_at).format('HH:mm DD MMM')}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  postContainer: {
    elevation: 1,
    shadowRadius: 1,
    borderRadius: 12,
    marginBottom: 10,
    shadowOpacity: 0.75,
    shadowColor: 'grey',
    flexDirection: 'column',
    backgroundColor: 'white',
    shadowOffset: { height: 0, width: 0 }
  },
  postHeader: {
    padding: 5,
    paddingLeft: '5%',
    paddingRight: '5%',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: LIGHT_GREY,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#E5E5E5'
  },
  authorName: {
    marginLeft: 5
  },
  contentContainer: {
    padding: 10,
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  postTitle: {
    fontSize: 18,
    paddingBottom: 8,
    fontWeight: '600'
  },
  postFooter: {
    padding: 5,
    paddingLeft: '5%',
    paddingRight: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  likeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  amountText: {
    color: 'grey',
    paddingLeft: '2%',
    paddingRight: '3%'
  },
  dateText: {
    fontSize: 12,
    color: 'grey'
  },
  readMore: {
    color: 'grey'
  },
  imageContainer: {
    height: 220,
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 200,
    width: '100%',
    resizeMode: 'contain',
  }
});


export default TimelinePost;
