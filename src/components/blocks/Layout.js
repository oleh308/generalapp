import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  StatusBar
} from 'react-native';

import Loading from './Loading';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { BLACK } from '../../constants/colours';
import { ModelProvider } from '../../context/ModelContext';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

function Layout({
  title,
  goBack,
  loading,
  children,
  isScroll,
  noPadding,
  otherButton,
  avoidRule='never',
  scrollEnabled=true,
}) {
  const scrollView = useRef(null);

  const scrollToBottom = (contentWidth, contentHeight) => {
    if (scrollView.current) {
      let cb = () => scrollView.current.scrollToEnd({animated: true})
      timeout(50, cb)
    }
  }

  const timeout = (time, cb) => {
    setTimeout(() => {
      cb();
    }, time);
  }

  const getContent = () => {
    if (isScroll) {
      return (
        <ScrollView
          ref={scrollView}
          contentContainerStyle={{flex:1}}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )
    } else {
      return children;
    }
  }

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.statusBackground}/>
      <StatusBar translucent barStyle={'light-content'}/>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>{title}</Text>
        {goBack && <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name={'ios-arrow-back'} size={24} color={'grey'} />
        </TouchableOpacity>}
        {otherButton && <TouchableOpacity style={styles.otherButton} onPress={otherButton.cb}>
          <Ionicons name={otherButton.name} size={30} color="grey" />
        </TouchableOpacity>}
      </View>
      <Loading loading={loading}>
        <KeyboardAwareScrollView
          style={styles.flex}
          scrollEnabled={scrollEnabled}
          contentContainerStyle={styles.flex}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={avoidRule}
          extraScrollHeight={getBottomSpace() === 34 ? 20 : 0}
        >
          <ModelProvider>
            <View style={[noPadding ? {} : styles.contentPadding, styles.contentContainer]}>
              {children}
            </View>
          </ModelProvider>
        </KeyboardAwareScrollView>
      </Loading>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flexGrow: 1
  },
  statusBackground: {
    top: 0,
    height: 50,
    width: '100%',
    position: 'absolute',
    backgroundColor: BLACK
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  contentPadding: {
    marginTop: 10,
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  headerContainer: {
    height: 50,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLACK,
  },
  titleText: {
    fontSize: 24,
    color: 'white'
  },
  backButton: {
    left: 20,
    position: 'absolute'
  },
  otherButton: {
    right: 20,
    position: 'absolute'
  }
});

export default Layout
