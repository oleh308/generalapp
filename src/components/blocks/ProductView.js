import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { commonStyles } from '../../styles'
import { RED_2 } from '../../constants/colours';

function ProductView({ product, cb, extraButtons }) {

  function getCost() {
    const daysText = product.duration === 1 ? 'day' : 'days';
    return `$${product.cost} for ${product.duration} ${daysText}`;
  }

  return (
    <TouchableOpacity style={[styles.productContainer, commonStyles.shadow]} onPress={cb}>
      <Text style={styles.productTitle}>{product.title}</Text>
      <Text>{product.content}</Text>
      <Text style={styles.priceText}>{getCost()}</Text>
      {extraButtons && <View style={commonStyles.buttonsContainer}>
        {extraButtons}
      </View>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  productContainer: {
    paddingTop: 10,
    borderRadius: 12,
    paddingBottom: 10,
    paddingLeft: '3%',
    paddingRight: '3%',
    backgroundColor: 'white'
  },
  productTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  priceText: {
    fontSize: 12,
    color: RED_2,
    marginTop: 10,
  }
})

export default ProductView;
