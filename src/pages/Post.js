import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';
import moment from 'moment';
import io from 'socket.io-client';
import SyncStorage from 'sync-storage';
import Layout from '../components/blocks/Layout';
import AreaField from '../components/inputs/AreaField';
import UserImage from '../components/blocks/UserImage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionButton from '../components/buttons/ActionButton';
import SelectedProps from '../components/blocks/SelectedProps';

import { BLUE, WHITE } from '../constants/colours';
import { useIsFocused } from '@react-navigation/native';

function Post({ navigation, route }) {
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const { editable } = route.params;

  const [post, setPost] = useState(route.params.post);
  const { title, content, author, created_at, comments, _id, likes, image } = post
  const mylike = likes ? likes.find(like => like.author._id === user_id) : null;

  const isFocused = useIsFocused();
  const [socket, setSocket] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isFocused) {
      getPost();
      setupSockets()
    }
  }, [isFocused])

  function setupSockets() {
    const socket = io(apiUrl, {
      transports: ['websocket'],
      jsonp: false
    });
    socket.connect();
    socket.on('connect', () => {
      socket.emit('post_init', { id: _id });
      console.log('connected to socket server');
    });
    socket.on('update', data => {
      getPost();
      console.log('update requested', data);
    });

    setSocket(socket);
  }

  async function getPost() {
    try {
      const data = (await axios.get(apiUrl + '/api/posts/' + _id, config)).data;
      setPost(data);
    } catch (error) {
      if (error.response) {
        console.log('PreviewPost - getPost:', error.response.data);
      } else {
        console.log('PreviewPost - getPost:', error.message);
      }
    }
  }

  async function sendComment() {
    try {
      const body = {
        text: comment
      }
      const data = (await axios.post(apiUrl + '/api/comments/' + _id, body, config)).data;
    } catch (error) {
      if (error.response) {
        console.log('Post.js - sendComment:', error.response.data);
      } else {
        console.log('Post.js - sendComment:', error.message);
      }
    }
  }

  async function like() {
    try {
      const data = (await axios.post(apiUrl + '/api/likes/' + _id, {}, config)).data;
      toggleLike();
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
    refresh();
  }

  function refresh() {
    setPost({...post})
  }

  function getComments() {
    if (!comments) return [];

    if (comments.length === 0) return <Text style={styles.dateText}>No comments</Text>
    return comments.map((comment, index) => {
      const name = comment.author && comment.author.name ? comment.author.name : '';
      if (!comment.author) return void(0);
      return (
        <View key={index} style={styles.comment}>
          <UserImage image={comment.author.image}/>
          <View style={styles.commentText}>
            <Text style={styles.commentAuthor}>{name + ': '}</Text>
            <Text>{comment.text}</Text>
          </View>
        </View>
      )
    })
  }

  function navigateCreate() {
    navigation.navigate('Create', {
      post: post
    });
  }

  function navigateProfile() {
    if (editable) {
      navigation.goBack();
    } else {
      author.id = author._id;
      navigation.navigate('ProfilePage', { profile: author });
    }
  }

  function getContent() {
    const children = (
      <View style={styles.contentContainer}>
        <View style={styles.contentHeader}>
          <Text style={styles.postTitle}>{title}</Text>
        </View>
        {getImage()}
        <Text>{content}</Text>
      </View>
    );

    if (editable) {
      return (
        <TouchableOpacity onPress={navigateCreate}>
          {children}
        </TouchableOpacity>
      );
    } else {
      return children;
    }
  }

  function getImageUri(image) {
    if (image) {
      return apiUrl + '/api/image/' + image;
    } else {
      return "https://via.placeholder.com/200x200";
    }
  }

  function getAuthorName() {
    if (author && author.name) {
      return author.name + ' ' + author.surname
    } else {
      return '';
    }
  }

  function getLikeIcon() {
    if (mylike) {
      return <Ionicons name={'ios-heart'} size={20} color={'#DC4747'} />
    } else {
      return <Ionicons name={'ios-heart-empty'} size={20} color={'grey'} />
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
    <Layout title={'Preview'} isScroll={true} goBack={() => navigation.goBack()} loading={false} noPadding>
      <TouchableOpacity onPress={navigateProfile}>
        <View style={styles.postHeader}>
          <View style={styles.rowCenter}>
            <UserImage image={author.image}/>
            <View style={styles.authorName}>
              <Text>{getAuthorName()}</Text>
            </View>
          </View>
          <View style={styles.rowCenter}>
            <TouchableOpacity onPress={like}>
              {getLikeIcon()}
            </TouchableOpacity>
            <Text style={styles.amountText}>{likes ? likes.length : 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {getContent()}
      <View style={styles.hashtagsContainer}>
        <SelectedProps props={post.hashtags ? post.hashtags : []} cancelFunc={null} />
      </View>
      <View style={styles.postFooter}>
        <Text style={styles.dateText}>{moment(created_at).format('HH:mm DD MMM')}</Text>
      </View>
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Comments</Text>
        {getComments()}
      </View>
      <View style={styles.writeContainer}>
        <AreaField style={styles.writeInput} property={comment} setProperty={setComment} height={75}/>
        <View style={styles.buttonsContainer}>
          <ActionButton title='Send' cb={sendComment} colour={WHITE} background={BLUE} />
        </View>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  postHeader: {
    padding: 5,
    paddingLeft: '5%',
    paddingRight: '5%',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'space-between'
  },
  authorImage: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#E5E5E5'
  },
  rowCenter: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  hashtagsContainer: {
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  amountText: {
    color: 'grey',
    paddingLeft: '2%',
    paddingRight: '3%'
  },
  commentsContainer: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  commentsTitle: {
    marginBottom: 10,
    fontWeight: "600",
  },
  comment: {
    marginBottom: 10,
    flexDirection: 'row'
  },
  commentText: {
    flex: 1,
    marginTop: 3,
    marginLeft: '2%',
    paddingRight: '2%',
  },
  commentAuthor: {
    fontWeight: "600"
  },
  writeInput: {
    height: 40,
  },
  writeContainer: {
    paddingLeft: '5%',
    paddingRight: '5%',
    marginBottom: 100
  },
  authorName: {
    marginLeft: 5
  },
  contentHeader: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contentContainer: {
    padding: 10,
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  postFooter: {
    padding: 5,
    paddingLeft: '5%',
    paddingRight: '5%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: 'grey'
  },
  readMore: {
    color: 'grey'
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonOpacity1: {
    padding: 10,
    borderRadius: 3,
    backgroundColor: 'grey'
  },
  buttonText: {
    color: 'white'
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
})

export default Post;
