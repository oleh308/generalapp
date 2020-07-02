import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { getImageUri } from '../../utils/user';
import { getBasicUri } from '../../utils/image';

function MyTextMessages({ block }) {
  const image = block?.author?.image;

  function getImages(images) {
    return (
      <View style={styles.imagesContainer}>
        {images.map((image, index) => {
          return <Image key={index} style={styles.imagePreview} source={{ uri: getBasicUri(image) }}/>
        })}
      </View>
    )
  }

  function getMessages() {
    return block.messages.map((message, index) => {
      const style = [styles.messageContainer, (block.messages.length - 1) === index ? {} : styles.messageMargin];
      return (
        <View key={index} style={style}>
          {message.images && message.images.length > 0 && getImages(message.images)}
          {message.text !== '' && <Text style={styles.messageText}>{message.text}</Text>}
        </View>
      )
    })
  }

  return (
    <View style={styles.blockContainer}>
      <View style={styles.messagesContainer}>
        <Text>Me</Text>
        {getMessages()}
      </View>
      <TouchableOpacity>
        <Image style={styles.profileImage} source={{ uri: getImageUri(image) }} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  blockContainer: {
    width: '60%',
    marginBottom: 10,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messagesContainer: {
    flex: 1
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'grey'
  },
  messageMargin: {
    marginBottom: 5,
  },
  messageText: {
    color: 'white'
  },
  profileImage: {
    width: 40,
    height: 40,
    marginLeft: 3,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#E5E5E5'
  },
  imagesContainer: {
    flex: 1,
  },
  imagePreview: {
    height: 120,
    marginBottom: 5,
    resizeMode: 'contain',
  }
});

export default MyTextMessages;
