/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import HomeStyles from './HomeStyles';
import Colors from '../../utils/Colors';
import ComponentStyles from '../../components/ComponentStyles';
import {useDispatch, useSelector} from 'react-redux';
import {addItemsToCart} from '../../actions/CartAction';
import {showToast} from '../../helpers/ShowToast';
import {useEffect} from 'react';
import HomeComponentStyles from '../../components/Home/HomeComponentStyles';
import ProductCard from '../../components/Products/ProductCard';
import {getsuggestedProducts} from '../../actions/ProductActions';
import Loader from '../../components/Loader';

export default function ProductDetails(props) {
  const dispatch = useDispatch();
  const product = props.route.params.product;
  // const categoryId = props.route.params.categoryId;
  const [quantity, setQuantity] = useState(0);
  const {products, loading, error} = useSelector(
    state => state.suggestedProducts,
  );
  const {cartItems} = useSelector(state => state.cart);

  useEffect(() => {
    setQuantity(0);
    if (error) {
      showToast('error', error);
    }

    dispatch(getsuggestedProducts());
  }, [product, dispatch, error]);

  useEffect(() => {
    cartItems.map(item => {
      item.product === product._id ? setQuantity(item.quantity) : null;
    });
  }, [cartItems, product]);

  const increaseQuantity = () => {
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

  const decreaseQuantity = () => {
    setQuantity(quantity - 1);
    dispatch(addItemsToCart(product._id, quantity - 1));
    showToast('success', 'Cart Updated');
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={HomeStyles.productDetailsContainer}>
      <Image
        source={{uri: product.images[0].url}}
        style={HomeStyles.productDetailsImage}
      />
      <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
        <Text style={HomeStyles.productDetailsHeading}>{product.name}</Text>
        <Text
          style={{
            color: product.stock === 0 ? Colors.RED : Colors.DARK_GREEN,
            fontSize: 17,
            fontWeight: '700',
            marginBottom: 5,
          }}>
          {product.stock === 0 ? 'Out Of Stock' : 'In Stock'}
        </Text>
        <Text style={HomeStyles.productDetailsSubHeading}>Produt Details</Text>
        <Text style={HomeStyles.productDetailsDescription}>
          {product.description}
        </Text>

        {/* Add To Cart */}
        {quantity === 0 ? (
          <TouchableOpacity
            onPress={increaseQuantity}
            style={ComponentStyles.btnContainer}>
            <Text style={ComponentStyles.btnLabel}>Add To Cart</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              marginTop: 20,
              width: '100%',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={decreaseQuantity}
              style={{
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                borderColor: Colors.PRIMARY,
                borderWidth: 1,
                backgroundColor: Colors.PRIMARY,
              }}>
              <Text
                style={{
                  color: Colors.WHITE,
                  paddingHorizontal: 25,
                  fontSize: 16,
                  paddingVertical: 4,
                }}>
                -
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: Colors.PRIMARY,
                textAlign: 'center',
                width: '64%',
                fontSize: 16,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: Colors.PRIMARY,
                paddingVertical: 4,
              }}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={increaseQuantity}
              style={{
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                borderColor: Colors.PRIMARY,
                borderWidth: 1,
                backgroundColor: Colors.PRIMARY,
              }}>
              <Text
                style={{
                  color: Colors.WHITE,
                  paddingHorizontal: 25,
                  fontSize: 16,
                  paddingVertical: 4,
                }}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Suggested Products */}
      <View style={{marginVertical: 10}}>
        {loading ? (
          <Loader />
        ) : (
          <View style={HomeComponentStyles.homeProductsContainer}>
            <View style={HomeComponentStyles.homeProductsHeadingContainer}>
              <Text style={HomeComponentStyles.homeProductCategory}>
                Products you may like
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicatol={false}
              data={products}
              renderItem={({item}) => <ProductCard product={item} />}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
