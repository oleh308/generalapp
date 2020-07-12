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
import SlotView from '../../components/blocks/SlotView';
import DaysList from '../../components/blocks/DaysList';
import AreaField from '../../components/inputs/AreaField';
import InputField from '../../components/inputs/InputField';
import ActionButton from '../../components/buttons/ActionButton';

import { commonStyles } from '../../styles';
import { BLUE, WHITE, RED_2, LIGHT_GREY } from '../../constants/colours';
import { AuthenticationContext } from '../../context/AuthenticationContext';

const message1 = 'The product was successfully created, now users can see it.';
const message2 = 'The product was successfully updated.';
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const days2 = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function AddProduct({ navigation, route }) {
  const { api } = useContext(AuthenticationContext);
  const token = SyncStorage.get('token');
  const apiUrl = SyncStorage.get('apiUrl');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const productInit = route.params ? route.params.product : null;

  const [visible, dismiss] = useKeyboard();

  const [day, setDay] = useState(0);
  const [alert, setAlert] = useState(null);
  const [cost, setCost] = useState(productInit.cost);
  const [product, setProduct] = useState(productInit);
  const [title, setTitle] = useState(productInit.title);
  const [amount, setAmount] = useState(productInit.amount);
  const [content, setContent] = useState(productInit.content);

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
      ...(product._id ? {} : product),
      cost: cost,
      title: title,
      amount: amount,
      content: content,
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

  function getSlotsData(index) {
    const key = days2[index] + '_slots';
    return product[key];
  }

  function navigateCreate(day, slot) {
    navigation.navigate('CreateSlot', { product: product, day: day });
  }

  function navigateUpdate(day, slot, index) {
    navigation.navigate('CreateSlot', { product: product, day: day, index: index, slot: slot });
  }

  function getSlots(day, dayText, slots) {
    return (
      <View key={day}>
        {dayText ? <Text>{dayText + ':'}</Text> : void(0)}
        {slots.map((slot, index) => {
          return <SlotView key={index} slot={slot} cb={() => navigateUpdate(day, slot, index)} />
        })}
        <TouchableOpacity style={styles.createSlot} onPress={() => navigateCreate(day, null)}>
          <Text style={styles.createText}>Create slot</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function getSchedule() {
    if (day === 0) {
      return days.map((dayText, index) => {
        return getSlots(index, dayText, getSlotsData(index));
      })
    } else {
      return getSlots(day - 1, '', getSlotsData(day - 1))
    }
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
      <View style={styles.contentContainer}>
        <InputField title={'Title'} property={title} setProperty={setTitle} />
        <AreaField title={'Content'} property={content} setProperty={setContent} />
        <InputField
          keyboard={'number-pad'}
          title={'Amount of sessions'}
          property={String(amount)}
          setProperty={manageAmount}
        />
        <InputField
          title={'Cost ($)'}
          keyboard={'number-pad'}
          property={String(cost)}
          setProperty={manageCost}
        />
        <DaysList day={day} setDay={setDay} style={{ marginTop: 20 }}/>
        {getSchedule()}
        <View style={commonStyles.buttonsContainer}>
          {product._id ? getEditButtons() : getCreateButtons()}
        </View>
      </View>
      {alert && <Modal alert={alert} />}
    </Layout>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: 75
  },
  createSlot: {
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

export default AddProduct;
