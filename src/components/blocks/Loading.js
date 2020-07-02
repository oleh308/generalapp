import React from 'react';
import { MaterialIndicator } from 'react-native-indicators';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

function Loading({loading, children}) {
  const getLoading = () => {
    return <View style={styles.flex}>
      {children}
      <View style={styles.loadingContainer}>
        <View>
          <MaterialIndicator color="grey" />
        </View>
      </View>
    </View>
  }

  return loading ? getLoading() : children;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  loadingContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)'
  }
});

export default Loading;
