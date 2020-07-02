import React, { useState, useEffect, useContext, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import SyncStorage from 'sync-storage';
import useKeyboard from '@rnhooks/keyboard';
import { commonStyles } from '../styles.js';
import Layout from '../components/blocks/Layout';
import Basic from '../components/buttons/Basic';
import { useIsFocused } from '@react-navigation/native';
import SearchInput from '../components/inputs/SearchInput';
import TimelinePost from '../components/blocks/TimelinePost';
import ProfilePreview from '../components/blocks/ProfilePreview';
import { AuthenticationContext } from '../context/AutheticationContext';

let timeout = null;

function Search({ navigation }) {
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const user_id = SyncStorage.get('user_id');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();
  const [visible, dismiss] = useKeyboard();

  const [tab, setTab] = useState(1);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    getUser();
    fetchRecommendations()
  }, []);

  useEffect(() => {
    if (isFocused && search) fetchResults();
  }, [isFocused]);

  useEffect(() => {
    clearTimeout(timeout);
    if (!search) return;

    timeout = setTimeout(() => {
      if (search) fetchSuggestions();
      // console.log('execute timeout', new Date())
    }, 1000);
  }, [search])

  async function getUser() {
    try {
      const data = (await api.get(apiUrl + '/api/user/' + user_id, config)).data;
      setSuggestions(data.recent_searches ? data.recent_searches : []);
      setUser(data);
    } catch (error) {
      if (error.response) {
        console.log('Profile.js - getUser:', error.response.data);
      } else {
        console.log('Profile.js - getUser:', error.message);
      }
    }
  }

  async function fetchSuggestions() {
    try {
      const data = (await api.get(apiUrl + '/api/suggestions/' + search, config)).data;
      setSuggestions(data);
    } catch (error) {
      if (error.response) {
        console.log('Create.js - fetchSuggestions:', error.response.data);
      } else {
        console.log('Create.js - fetchSuggestions:', error.message);
      }
    }
  }

  async function fetchResults(search) {
    try {
      const data = (await api.get(apiUrl + '/api/results/' + search, config)).data;
      data.following.forEach(id => {
        let user = data.users.find(user => user._id === id);
        if (user) user.following_user = true;
      });

      if (Array.isArray(data.users)) setSearchedUsers(data.users);
      if (Array.isArray(data.posts)) setSearchedPosts(data.posts);

      if (user) {
        if (user.recent_searches.length > 5) {
          user.recent_searches.shift();
        }
        user.recent_searches.push(search);
        setUser({...user});
      }
    } catch (error) {
      if (error.response) {
        console.log('Create.js - fetchResults:', error.response.data);
      } else {
        console.log('Create.js - fetchResults:', error.message);
      }
    }
  }

  async function fetchRecommendations() {
    try {
      const data = (await api.get(apiUrl + '/api/posts/recommendations', config)).data;
      setRecommendations(data);
    } catch (error) {
      if (error.response) {
        console.log('Create.js - fetchRecommendations:', error.response.data);
      } else {
        console.log('Create.js - fetchRecommendations:', error.message);
      }
    }
  }

  function refreshRecommend() {
    setRecommendations([...recommendations]);
  }

  function refreshSearchPosts() {
    setSearchedPosts([...searchedPosts]);
  }

  function refreshSearchUsers() {
    setSearchedUsers([...searchedUsers]);
  }

  function selectSuggest(suggest) {
    setSearch(suggest);
    fetchResults(suggest);
    dismiss();
  }

  function manageSearch() {
    console.log('here')
    fetchResults(search);
    dismiss();
  }

  function getRecommendations() {
    if (search || visible) return void(0);

    return (
      <Fragment>
        <Text style={styles.recommendTitle}>Recommendations:</Text>
        {recommendations.map((post, index) => {
          return <TimelinePost key={index} post={post} navigation={navigation} refresh={refreshRecommend}/>
        })}
      </Fragment>
    )
  }

  function getSearchedPosts() {
    return searchedPosts.map((post, index) => {
      return <TimelinePost key={index} post={post} navigation={navigation} refresh={refreshSearchPosts}/>
    });
  }

  function getSearchedUsers() {
    return searchedUsers.map((user, index) => {
      return <ProfilePreview key={index} profile={user} navigation={navigation} refresh={refreshSearchUsers}/>
    })
  }

  function getResults() {
    if (visible || !search) return void(0);

    return (
      <Fragment>
        <View style={commonStyles.optionsContainer}>
          <TouchableOpacity style={[tab === 1 ? commonStyles.selectedOption : {}, commonStyles.optionButton]} onPress={() => setTab(1)}>
            <Text>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[tab === 2 ? commonStyles.selectedOption : {}, commonStyles.optionButton]} onPress={() => setTab(2)}>
            <Text>People</Text>
          </TouchableOpacity>
        </View>
        {tab === 1 && getSearchedPosts()}
        {tab === 2 && getSearchedUsers()}
      </Fragment>
    )
  }

  function getSuggestions() {
    if (!visible) return void(0);

    return suggestions.map((suggest, index) => {
      return (
        <TouchableOpacity key={index} style={styles.suggestionContainer} onPress={() => selectSuggest(suggest)}>
          <Text>{suggest}</Text>
        </TouchableOpacity>
      )
    })
  }

  return (
    <Layout title={'Search'} avoidRule={'always'}>
      <View style={styles.searchContainer}>
        <SearchInput
          cb={manageSearch}
          property={search}
          placeholder={'Search'}
          setProperty={setSearch}
          title={'Title, Topic or Name'}
        />
        <View style={styles.gap} />
        <Basic cb={manageSearch} title={'Search'} />
      </View>
      <View style={styles.contentContainer}>
        {getSuggestions()}
        {getRecommendations()}
        {getResults()}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
  contentContainer: {
    marginBottom: 75
  },
  recommendTitle: {
    marginTop: 20,
    fontWeight: "600"
  },
  suggestionContainer: {
    height: 50,
    borderColor: 'grey',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  gap: {
    width: 10
  }
})

export default Search;
