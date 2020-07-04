import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Layout from '../../components/blocks/Layout';
import InputField from '../../components/inputs/InputField';
import ActionButton from '../../components/buttons/ActionButton';

function AddProduct({ navigation, route }) {
  const product = route.params ? route.params.product : null;

  const [title, setTitle] = useState(product ? product.title : '');
  const [content, setContent] = useState(product ? product.content : '');
  const [duration, setDuration] = useState(product ? product.duration : 1);

  function goBack() {
    navigation.goBack();
  }

  return (
    <Layout title={product ? 'Edit product' : 'Create product'} goBack={goBack}>

    </Layout>
  )
}

const styles = StyleSheet.create({

});

export default AddProduct;
