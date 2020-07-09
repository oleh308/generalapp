import React, { useEffect, useContext, useState, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';
import SyncStorage from 'sync-storage';
import Modal from '../../components/blocks/Modal';
import Layout from '../../components/blocks/Layout';
import ProductView from '../../components/blocks/ProductView';
import ActionButton from '../../components/buttons/ActionButton';

import { WHITE, BLUE } from '../../constants/colours';
import { useIsFocused } from '@react-navigation/native';
import { AuthenticationContext } from '../../context/AuthenticationContext';

function ChatProducts({ navigation, route }) {
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const id = route.params ? route.params.id : '';

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const isFocused = useIsFocused();
  const [alert, setAlert] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isFocused) fetchProducts();
  }, [isFocused]);

  async function fetchProducts() {
    try {
      const data = (await api.get(apiUrl + '/api/users/' + id + '/products', config)).data;
      setProducts(data);
    } catch (error) {
      if (error.response) {
        console.log('ChatProducts.js - fetchProducts:', error.response.data);
      } else {
        console.log('ChatProducts.js - fetchProducts:', error.message);
      }
    }
  }

  async function pay(product) {
    try {
      // let date = moment();
      // date.add(product.duration, 'days');
      // date = date.format();
      // console.log(date);
      const body ={
        product_id: product._id
      }
      const data = (await api.post(apiUrl + '/api/chats/private/join/' + id, body, config)).data;
      console.log(data);
      navigateChat(data.id);
    } catch (error) {
      if (error.response) {
        console.log('ChatProducts.js - pay:', error.response.data);
      } else {
        console.log('ChatProducts.js - pay:', error.message);
      }
    }
  }

  function navigateChat(id) {
    SyncStorage.set('chatRedirect', id);
    navigation.navigate('ChatsStack', { screen: 'Chats' });
  }

  function openSuccess() {
    setAlert({
      title: 'Success',
      text: 'The payment was successfully now you can talk to the mentor.',
      buttons: [
        {
          title: 'Ok',
          color: 'grey',
          cb: () => setAlert(null)
        }
      ]
    })
  }

  function goBack() {
    navigation.goBack();
  }

  function getProducts() {
    return products.map((product, index) => {
      const extraButtons = (
        <Fragment>
          <ActionButton title={'Pay'} colour={WHITE} background={BLUE} cb={() => pay(product)}/>
        </Fragment>
      );
      return <ProductView key={index} product={product} extraButtons={extraButtons} />
    });
  }

  return (
    <Layout title={'Choose'} goBack={goBack}>
      {getProducts()}
    </Layout>
  );
}

const styles = StyleSheet.create({

});

export default ChatProducts;
