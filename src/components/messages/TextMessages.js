import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import UserImage from '../blocks/UserImage';

import { commonStyles } from '../../styles';
import { getImageUri } from '../../utils/user';
import { getBasicUri } from '../../utils/image';

import { LIGHT_GREY, BLACK, GREY, WHITE } from '../../constants/colours';

function TextMessages({ block }) {
  const name = block?.author?.name;
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
      const style = [
        commonStyles.shadow,
        styles.messageContainer,
        (block.messages.length - 1) === index ? {} : styles.messageMargin
      ];

      return (
        <View key={index} style={style}>
          {index === 0 && <Text style={styles.nameText}>{name}</Text>}
          {message.images && message.images.length > 0 && getImages(message.images)}
          {message.text !== '' && <Text style={styles.messageText}>{message.text}</Text>}
        </View>
      )
    })
  }

  return (
    <View style={styles.blockContainer}>
      <View style={styles.messagesContainer}>
        {getMessages()}
      </View>
      <TouchableOpacity>
        <UserImage image={image} marginLeft={3} marginRight={10}/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  blockContainer: {
    marginBottom: 10,
    alignItems: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messagesContainer: {
    flex: 1,
    alignItems: 'flex-start'
  },
  nameText: {
    left: 7,
    top: -18,
    color: GREY,
    position: 'absolute',
    alignSelf: 'flex-start',
  },
  messageContainer: {
    padding: 10,
    maxWidth: '60%',
    borderRadius: 12,
    backgroundColor: WHITE
  },
  messageMargin: {
    marginBottom: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    marginRight: 3,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#E5E5E5'
  },
  imagesContainer: {
    minWidth: '100%',
  },
  imagePreview: {
    height: 120,
    marginBottom: 5,
    resizeMode: 'contain',
  }
});

export default TextMessages;
