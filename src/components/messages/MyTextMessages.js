import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import SmallUserImage from '../blocks/SmallUserImage';

import { commonStyles } from '../../styles';
import { getImageUri } from '../../utils/user';
import { getBasicUri } from '../../utils/image';

import { LIGHT_GREY, BLACK, GREY } from '../../constants/colours';

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
      const style = [
        commonStyles.shadow,
        styles.messageContainer,
        (block.messages.length - 1) === index ? {} : styles.messageMargin
      ];
      return (
        <View key={index} style={style}>
          {index === 0 && <Text style={styles.nameText}>Me</Text>}
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
        <SmallUserImage image={image} marginLeft={10} marginRight={3}/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  blockContainer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messagesContainer: {
    flex: 1,
    alignItems: 'flex-end'
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
    backgroundColor: LIGHT_GREY,
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
