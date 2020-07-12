import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import SyncStorage from 'sync-storage';
import Layout from '../../components/blocks/Layout';
import ProductView from '../../components/blocks/ProductView';

import { useIsFocused } from '@react-navigation/native';
import { BLUE, LIGHT_GREY } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';

function getDefaultProduct() {
  return {
    cost: 1,
    title: '',
    amount: 1,
    content: '',
    capacity: 1,
    mon_slots: [],
    tue_slots: [],
    wed_slots: [],
    thu_slots: [],
    fri_slots: [],
    sat_slots: [],
    sun_slots: [],
    disabled: []
  }
}

function Products({ navigation, route }) {
  const { id } = route.params ? route.params : {};
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isFocused) fetchProducts();
  }, [isFocused]);

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
    navigation.navigate('AddProduct', { product: getDefaultProduct() });
  }

  function openEdit(product) {
    navigation.navigate('AddProduct', { product: product });
  }

  function getProducts() {
    return products.map((product, index) => {
      return <ProductView key={index} product={product} cb={() => openEdit(product)}/>
    })
  }

  return (
    <Layout title={'Products'} goBack={goBack}>
      {getProducts()}
      <TouchableOpacity style={styles.createContainer} onPress={openCreate}>
        <Text style={styles.createText}>Create new</Text>
      </TouchableOpacity>
    </Layout>
  )
}

const styles = StyleSheet.create({
  createContainer: {
    height: 50,
    marginTop: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: LIGHT_GREY,
    justifyContent: 'center'
  },
  createText: {
    color: LIGHT_GREY
  }
});

export default Products;
