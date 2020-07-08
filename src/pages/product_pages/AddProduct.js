import React, { Fragment, useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import SyncStorage from 'sync-storage';
import useKeyboard from '@rnhooks/keyboard';
import Modal from '../../components/blocks/Modal';
import Layout from '../../components/blocks/Layout';
import AreaField from '../../components/inputs/AreaField';
import InputField from '../../components/inputs/InputField';
import ActionButton from '../../components/buttons/ActionButton';

import { commonStyles } from '../../styles';
import { BLUE, WHITE, RED_2 } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AutheticationContext';

const message1 = 'The product was successfully created, now users can see it.';
const message2 = 'The product was successfully updated.';

function AddProduct({ navigation, route }) {
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const product = route.params ? route.params.product : null;

  const [visible, dismiss] = useKeyboard();

  const [alert, setAlert] = useState(null);
  const [cost, setCost] = useState(product ? product.cost : 1);
  const [title, setTitle] = useState(product ? product.title : '');
  const [content, setContent] = useState(product ? product.content : '');
  const [amount, setAmount] = useState(product ? product.amount : 1);

  useEffect(() => {
    if (!visible && amount === 0) setAmount(1);
  }, [visible]);

  async function createProduct() {
    try {
      const data = (await api.post(apiUrl + '/api/products', getBody(), config)).data;
      openConfirmation(message1);
    } catch (error) {
      if (error.response) {
        console.log('AddProduct.js - createProduct:', error.response.data);
      } else {
        console.log('AddProduct.js - createProduct:', error.message);
      }
    }
  }

  async function deleteProduct() {
    try {
      const data = (await api.delete(apiUrl + '/api/products/' + product._id, config)).data;
      navigation.goBack();

      // openConfirmation();
    } catch (error) {
      if (error.response) {
        console.log('AddProduct.js - deleteProduct:', error.response.data);
      } else {
        console.log('AddProduct.js - deleteProduct:', error.message);
      }
    }
  }

  async function updateProduct() {
    try {
      const data = (await api.patch(apiUrl + '/api/products/' + product._id, getBody(), config)).data;

      openConfirmation(message2);
    } catch (error) {
      if (error.response) {
        console.log('AddProduct.js - updateProduct:', error.response.data);
      } else {
        console.log('AddProduct.js - updateProduct:', error.message);
      }
    }
  }

  function getBody() {
    return {
      cost: cost,
      title: title,
      content: content,
      amount: amount
    };
  }

  function openDeleteConfirm() {
    setAlert({
      title: 'Warning',
      text: 'Please confirm your intend to delete the product.',
      buttons: [
        {
          title: 'Cancel',
          color: 'grey',
          cb: () => setAlert(null)
        },
        {
          title: 'Confirm',
          color: RED_2,
          cb: deleteProduct
        },
      ]
    })
  }

  function openConfirmation(message) {
    setAlert({
      title: 'Success',
      text: message,
      buttons: [
        {
          title: 'Ok',
          color: 'grey',
          cb: () => {
            setAlert(null)
            navigation.goBack();
          }
        }
      ]
    })
  }

  function goBack() {
    navigation.goBack();
  }

  function manageAmount(text) {
    text = text.replace(/\D/g,'');

    setAmount(Number(text));
  }

  function manageCost(text) {
    text = text.replace(/\D/g,'');

    setCost(Number(text));
  }

  function getEditButtons() {
    return (
      <Fragment>
        <ActionButton title={'Delete'} colour={RED_2} cb={openDeleteConfirm} />
        <ActionButton title={'Edit'} colour={WHITE} background={BLUE} cb={updateProduct} />
      </Fragment>
    );
  }

  function getCreateButtons() {
    return <ActionButton title={'Create'} colour={WHITE} background={BLUE} cb={createProduct} />;
  }

  return (
    <Layout title={product ? 'Edit product' : 'Create product'} goBack={goBack}>
      <View>
        <InputField title={'Title'} property={title} setProperty={setTitle} />
        <AreaField title={'Content'} property={content} setProperty={setContent} />
        <InputField
          keyboard={'number-pad'}
          title={'Amount sessions'}
          property={String(amount)}
          setProperty={manageAmount}
        />
        <InputField
          title={'Cost ($)'}
          keyboard={'number-pad'}
          property={String(cost)}
          setProperty={manageCost}
        />
        <View style={commonStyles.buttonsContainer}>
          {product ? getEditButtons() : getCreateButtons()}
        </View>
      </View>
      {alert && <Modal alert={alert} />}
    </Layout>
  )
}

const styles = StyleSheet.create({

});

export default AddProduct;
