/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProductStyles from './ProductStyles';
import Colors from '../../utils/Colors';
import {showToast} from '../../helpers/ShowToast';
import {useDispatch, useSelector} from 'react-redux';
import {addItemsToCart} from '../../actions/CartAction';
import {useNavigation} from '@react-navigation/native';

export default function ProductCard({product, categoryId, navigation}) {
  const dispatch = useDispatch();
  const nav = navigation || useNavigation();
  const {cartItems} = useSelector(state => state.cart);
  const {isAuthenticated} = useSelector(state => state.user);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    cartItems.map(item => {
      item.product === product._id ? setQuantity(item.quantity) : null;
    });
  }, [cartItems, product._id]);

  const increaseQuanity = () => {
    if (!isAuthenticated) {
      nav.navigate('loginotp');
      return;
    }

    if (product.stock <= quantity) {
      showToast(
        'info',
        `We only have ${product.stock} units left for ${product.name}`,
      );
      return;
    }

    if (product.maxOrderQuantity && quantity >= product.maxOrderQuantity) {
      showToast(
        'info',
        `You can only order ${product.maxOrderQuantity} units of ${product.name} at a time.`,
      );
      return;
    }

    setQuantity(quantity + 1);
    dispatch(addItemsToCart(product._id, quantity + 1));
    showToast('success', 'Item Added');
  };

  const decreaseQuanity = () => {
    setQuantity(quantity - 1);
    dispatch(addItemsToCart(product._id, quantity - 1));
    showToast('success', 'Cart Updated');
  };

  return (
    <TouchableOpacity
      onPress={() =>
        nav.navigate('tabnav', {
          screen: 'categorytab',
          params: {
            screen: 'productdetails',
            params: {product, categoryId, navigation: nav},
          },
        })
      }
      style={ProductStyles.productCardContainer}>
      {/* If image is not present, then showing placeholder image */}
      {product.images[0] ? (
        <Image
          source={{uri: product.images[0].url}}
          style={ProductStyles.productCardImage}
        />
      ) : (
        <Image
          source={require('../../images/placeholder_image.png')}
          style={ProductStyles.productCardImage}
        />
      )}
      <Text style={ProductStyles.productCardName}>{product.name}</Text>
      <View style={ProductStyles.productCardSubContainer}>
        <View
          style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          {product.finalPrice !== product.price ? (
            <Text
              style={{
                fontSize: 14,
                textDecorationLine: 'line-through',
              }}>
              ₹{product.price}
            </Text>
          ) : null}
          <Text style={{fontSize: 17, fontWeight: '600'}}>
            {' '}
            ₹{product.finalPrice}
          </Text>
        </View>

        {/* Add To Cart Button */}
        {quantity === 0 ? (
          <TouchableOpacity
            onPress={increaseQuanity}
            style={{
              borderWidth: 1,
              borderRadius: 4,
              borderColor: Colors.PRIMARY,
            }}>
            <Text
              style={{color: Colors.PRIMARY, textAlign: 'center', width: 34}}>
              Add
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={decreaseQuanity}
              style={{
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                borderColor: Colors.PRIMARY,
                borderWidth: 1,
                backgroundColor: Colors.PRIMARY,
              }}>
              <Text style={{color: Colors.WHITE, paddingHorizontal: 4}}>-</Text>
            </TouchableOpacity>
            <Text
              style={{
                color: Colors.PRIMARY,
                textAlign: 'center',
                width: 25,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: Colors.PRIMARY,
              }}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={increaseQuanity}
              style={{
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                borderColor: Colors.PRIMARY,
                borderWidth: 1,
                backgroundColor: Colors.PRIMARY,
              }}>
              <Text style={{color: Colors.WHITE, paddingHorizontal: 4}}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
