import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';
import SyncStorage from 'sync-storage';
import Layout from '../components/blocks/Layout';
import ImagePicker from 'react-native-image-picker';
import AreaField from '../components/blocks/AreaField';
import InputField from '../components/blocks/InputField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchInput from '../components/blocks/SearchInput';
import ActionButton from '../components/buttons/ActionButton';
import SelectedProps from '../components/blocks/SelectedProps';

import { LIGHT_GREY, BLUE, WHITE, GREY } from '../constants/colours';

const hashtagsInit = [
  { title: 'Finance' },
  { title: 'Computer Science' },
  { title: 'Marketing' },
  { title: 'Psycology' }
]

function Create({ navigation, route }) {
  const apiUrl = SyncStorage.get('apiUrl');
  const token = SyncStorage.get('token');
  const { post } = route.params ? route.params : {};
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const [hashtag, setHashtag] = useState('');
  const [hashtags, setHashtags] = useState(hashtagsInit);
  const [title, setTitle] = useState(post ? post.title : '');
  const [content, setContent] = useState(post ? post.content : '');
  const [selectedHashtags, setSelectedHashtags] = useState(post ? post.hashtags : []);
  const [image, setImage] = useState(post && post.image ? { uri: apiUrl + '/api/image/' + post.image, uploaded: true } : null);

  const action = async () => {
    try {
      const data = getFormData();

      if (post) {
        const response = (await axios.put(apiUrl + '/api/posts/' + post._id, getFormData(), config)).data;
        navigation.goBack();
      } else {
        const response = (await axios.post(apiUrl + '/api/posts', data, config)).data;

        navigation.navigate('TimelineStack', { screen: 'Timeline'} );
      }
    } catch (error) {
      if (error.response) {
        console.log('Create.js - action:', error.response.data);
      } else {
        console.log('Create.js - action:', error.message);
      }
    }
  }

  function getFormData() {
    const data = new FormData();
    const ext = image.type ? image.type.split('/').pop() : 'png';

    data.append("file", {
      type: image.type,
      name: image.fileName ? image.fileName : 'image' + id + '.' + ext,
      uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", "")
    });

    data.append('title', title);
    data.append('content', content);

    selectedHashtags.forEach(tag => {
      data.append('hashtags[]', tag);
    })

    return data;
  }

  function chooseImage() {
    const options = {
      noData: true
    }

    ImagePicker.launchImageLibrary(options, async response => {
      if (response.uri) {
        setImage(response);
      }
    })
  }

  const selectHashtag = hashtag => {
    if (!selectedHashtags.includes(hashtag.title)) {
      setSelectedHashtags([...selectedHashtags, hashtag.title])
    }
    setHashtag('');
  }

  const cancelFunc = (hashtag, index) => {
    let temp = [...selectedHashtags]
    temp.splice(index, 1);
    setSelectedHashtags(temp);
  }

  function getImage() {
    if (image) {
      return (
        <TouchableOpacity style={styles.imageContainer} onPress={chooseImage}>
          <Image source={{ uri: image.uri }} style={styles.image}/>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.addImageContainer}>
          <TouchableOpacity style={styles.addImageModal} onPress={chooseImage}>
            <Ionicons name="ios-add" size={60} color={LIGHT_GREY} />
          </TouchableOpacity>
        </View>
      );
    }
  }

  return (
    <Layout title={'Write'} isScroll={false} goBack={post ? () => navigation.goBack() : null}>
      <InputField title={'Title'} property={title} setProperty={setTitle} />
      <Text style={styles.imageHeader}>Image</Text>
      {getImage()}
      <AreaField title={'Content'} property={content} setProperty={setContent} />
      <SearchInput
        title={'Hashtag'} property={hashtag} data={hashtags}
        setProperty={setHashtag} selectProperty={selectHashtag} prop={'title'}/>
      <SelectedProps props={selectedHashtags} cancelFunc={cancelFunc} />
      <View style={styles.buttonsContainer}>
        <ActionButton title={post ? 'Update' : 'Create'} cb={action} colour={WHITE} background={BLUE} />
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 20,
    marginBottom: 100,
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
  imageHeader: {
    color: GREY,
    marginTop: 20,
    marginLeft: 7
  },
  addImageContainer: {
    width: 80,
    marginTop: 10,
    flexDirection: 'row',
  },
  addImageModal: {
    width: 80,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    borderColor: LIGHT_GREY,
    justifyContent: 'center'
  },
  imageContainer: {
    height: 220,
    width: '100%',
    borderWidth: 1,
    paddingTop: 10,
    borderRadius: 3,
    paddingBottom: 10,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  image: {
    height: 200,
    width: '100%',
    resizeMode: 'contain',
  }
});

export default Create;
