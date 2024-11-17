import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../../helpers/Dimensions';
import Colors from '../../utils/Colors';
import CartCard from '../../components/Cart/CartCard';
import HorizontalLine from '../../components/HorizontalLine';
import AccountComponentStyles from '../../components/Account/AccountComponentStyles';
import {Capitalize} from '../../helpers/StringMethods';
import Btn from '../../components/Btn';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {showToast} from '../../helpers/ShowToast';
import {clearErrors, createOrder} from '../../actions/OrderActions';
import {RESET_NEW_ORDER} from '../../constants/OrderConstants';
import {RESET_CART} from '../../constants/CartConstants';
import {RESET_COUPON} from '../../constants/couponConstants';
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import {encode} from 'base-64';
import {sha256} from 'react-native-sha256';
import axiosInstance, {BASE_URL} from '../../utils/Axios';
import Enums from '../../utils/Enums';

export default function OrderConfirmation(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {error} = useSelector(state => state.newOrder);
  const {user} = useSelector(state => state.user);
  const [isCOD, setIsCOD] = useState(false);
  const {orderPrices, orderItems, shippingAddress, address} =
    props.route.params;

  useEffect(() => {
    if (error) {
      showToast('error', error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const placeOrder = () => {
    const order = {orderItems, shippingAddress, ...orderPrices};
    if (isCOD) {
      order.paymentInfo = {
        transactionId: 'Parchun_King_' + Date.now(),
        status: Enums.PAYMENT_STATUS.FAILED,
      };
      order.orderStatus = Enums.ORDER_STATUS.RECEIVED;

      dispatch(createOrder(order));
      dispatch({type: RESET_NEW_ORDER});
      dispatch({type: RESET_CART});
      dispatch({type: RESET_COUPON});
      showToast('success', 'Order Placed!');
      navigation.reset({index: 1, routes: [{name: 'tabnav'}]});
    } else {
      PhonePePaymentSDK.init(
        'UAT', // environment - PRODUCTION
        'PGTESTPAYUAT133', // merchantId - M15F3PTMWJNE - PGTESTPAYUAT133
        'ksejndfksedc', // appId - 3c970ac1a3bd4a569b21332a68784bc5
        true,
      )
        .then(res => {
          const params = {
            name: user?.name,
            amount: order.itemsPrice,
            number: user.contactNumber,
            MUID: 'MUID' + Date.now(),
            transactionId: 'Parchun_King_' + Date.now(),
          };
          const data = {
            merchantId: 'PGTESTPAYUAT133', // - M15F3PTMWJNE
            merchantTransactionId: params.transactionId,
            merchantUserId: params.MUID,
            name: params.name,
            amount: params.amount * 100,
            redirectUrl: `${BASE_URL}/api/v1/payment_status`, // @TODO
            callbackUrl: `${BASE_URL}/api/v1/payment_status`, // @TODO
            redirectMode: 'POST',
            mobileNumber: params.number,
            paymentInstrument: {
              type: 'PAY_PAGE',
            },
          };
          const salt_key = 'b43a021e-2f17-4654-9e70-8410bb7a9715'; // salt_key - 9935b12d-2cde-4fd3-ba89-4d10217bf4f2
          const payload = JSON.stringify(data);
          const payloadMain = encode(payload);
          const keyIndex = 1; // - 3
          const string = payloadMain + '/pg/v1/pay' + salt_key;
          sha256(string).then(res => {
            const checksum = res + '###' + keyIndex;
            PhonePePaymentSDK.startPGTransaction(
              payloadMain,
              checksum,
              '/pg/v1/pay',
              {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
              },
              null,
              null,
            )
              .then(res => {
                if (res.status === 'SUCCESS') {
                  order.paymentInfo = {
                    transactionId: params.transactionId,
                    status: Enums.PAYMENT_STATUS.SUCCEEDED,
                  };

                  dispatch(createOrder(order));
                  axiosInstance.get(
                    `${BASE_URL}/api/v1/payment_status/${params.transactionId}`,
                  );
                  dispatch({type: RESET_NEW_ORDER});
                  dispatch({type: RESET_CART});
                  dispatch({type: RESET_COUPON});
                  navigation.reset({index: 1, routes: [{name: 'tabnav'}]});
                }
              })
              .catch(err => {
                showToast(
                  'error',
                  'Could not complete the payment. Please try again.',
                );
                console.log('Error while making order payment ', err);
              });
          });
        })
        .catch(err =>
          console.log('Error while initializing order payment ', err),
        );
    }
  };

  return (
    <ScrollView nestedScrollEnabled>
      <ScrollView
        nestedScrollEnabled
        style={{
          height: deviceHeight * 0.4,
          backgroundColor: Colors.WHITE,
          marginVertical: 10,
          elevation: 4,
        }}
        showsVerticalScrollIndicator={false}>
        {orderItems.map(item => (
          <CartCard showEditOptions={false} product={item} key={item.product} />
        ))}
      </ScrollView>
      <View
        style={{
          height: deviceHeight * 0.19,
          backgroundColor: Colors.WHITE,
          elevation: 4,
          paddingVertical: 7,
          paddingHorizontal: 16,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{color: Colors.GRAY, fontSize: 16}}>Sub Total:</Text>
          <Text style={{fontSize: 16}}>₹ {orderPrices.itemsPrice}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{color: Colors.GRAY, fontSize: 16}}>
            Shipping Price:
          </Text>
          <Text style={{fontSize: 16}}>₹ {orderPrices.shippingPrice}</Text>
        </View>
        {/* <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{color: Colors.GRAY, fontSize: 16}}>GST (18%):</Text>
          <Text style={{fontSize: 16}}>₹ {orderPrices.taxPrice}</Text>
        </View> */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{color: Colors.GRAY, fontSize: 16}}>Discount:</Text>
          <Text style={{fontSize: 16}}>₹ {orderPrices.couponDiscount}</Text>
        </View>
        <HorizontalLine />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{color: Colors.BLACK, fontSize: 16, fontWeight: 'bold'}}>
            Total:
          </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            ₹ {orderPrices.totalPrice}
          </Text>
        </View>
      </View>

      {/* Address Info */}
      <View
        style={[
          AccountComponentStyles.container,
          {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            marginVertical: 10,
          },
        ]}>
        <View style={{width: 190}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            {Capitalize(address.label)}
          </Text>
          <Text numberOfLines={2} ellipsizeMode="tail">
            {`${address.address} ${address.city} ${address.pincode}`}
          </Text>
          <Text
            style={{
              color: Colors.GRAY,
            }}>{`${address.state} ${address.country}`}</Text>
        </View>

        {/* COD option */}
        <TouchableOpacity
          onPress={() => setIsCOD(!isCOD)}
          style={[
            AccountComponentStyles.container,
            {elevation: 0, paddingHorizontal: 0},
          ]}>
          {/* Radio Button */}
          <View
            style={{
              borderWidth: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: Colors.PRIMARY,
              padding: 2,
              marginTop: 5,
              marginRight: 10,
              borderRadius: 100,
              height: 16,
              width: 16,
              backgroundColor: Colors.WHITE,
            }}>
            <View
              style={{
                backgroundColor: isCOD ? Colors.PRIMARY : Colors.WHITE,
                borderRadius: 100,
                height: 10,
                width: 10,
              }}
            />
          </View>
          <View style={{width: 190}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>
              Pay Cash on Delivery
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{marginHorizontal: 20, marginTop: -20, marginBottom: 13}}>
        <Btn label="Place Order" onClick={placeOrder} />
      </View>
    </ScrollView>
  );
}
