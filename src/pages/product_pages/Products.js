import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import SyncStorage from 'sync-storage';
import Layout from '../../components/blocks/Layout';

import { BLUE } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AutheticationContext';

function Products({ navigation, route }) {
  const { id } = route.params ? route.params : {};
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = (await api.get(apiUrl + '/api/products', config)).data;
      setProducts(data);
    } catch (error) {
      if (error.response) {
        console.log('Products.js - fetchProducts:', error.response.data);
      } else {
        console.log('Products.js - fetchProducts:', error.message);
      }
    }
  }

  function goBack() {
    navigation.goBack();
  }

  function openCreate() {
    navigation.navigate('AddProduct');
  }

  return (
    <Layout title={'Products'} goBack={goBack}>
      <TouchableOpacity style={styles.createContainer} onPress={openCreate}>
        <Text style={styles.createText}>Create new</Text>
      </TouchableOpacity>
    </Layout>
  )
}

const styles = StyleSheet.create({
  createContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  createText: {
    color: BLUE
  }
});

export default Products;
