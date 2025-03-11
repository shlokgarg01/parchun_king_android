/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AccountStyles from './AccountStyles';
import AccountTabs from '../../components/Account/AccountTabs';
import Colors from '../../utils/Colors';
import {clearErrors, deleteUser, logout} from '../../actions/userActions';
import {showToast} from '../../helpers/ShowToast';
import {RESET_CART} from '../../constants/CartConstants';
import {RESET_COUPON} from '../../constants/couponConstants';
import {RESET_NEW_ORDER} from '../../constants/OrderConstants';
import Loader from '../../components/Loader';

export default function MyAccount({navigation}) {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    user,
    loading: userLoading,
  } = useSelector(state => state.user);
  const {isDeleted, loading} = useSelector(state => state.deleteUser);
  const {isUpdated} = useSelector(state => state.profile);

  useEffect(() => {
    if (isDeleted === true) {
      dispatch(clearErrors());
      dispatch(logout());
      dispatch({type: RESET_CART});
      dispatch({type: RESET_COUPON});
      dispatch({type: RESET_NEW_ORDER});
    }

    // if (isAuthenticated === false) {
    // navigation.reset({index: 1, routes: [{name: 'loginotp'}]});
    // }
  }, [isAuthenticated, isUpdated, isDeleted]);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch({type: RESET_CART});
    dispatch({type: RESET_COUPON});
    dispatch({type: RESET_NEW_ORDER});
    showToast('success', 'Logout successful');
    navigation.reset({index: 1, routes: [{name: 'loginotp'}]});
  };

  const loginHandler = () => {
    navigation.reset({index: 1, routes: [{name: 'loginotp'}]});
  };

  const deleteAccountHandler = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Yes',
          onPress: () => {
            dispatch(deleteUser(user._id));
          },
        },
        {
          text: 'No',
          onPress: () => {},
        },
      ],
    );
  };

  return loading || userLoading ? (
    <Loader />
  ) : (
    <View>
      <Text style={AccountStyles.userName}>
        {isAuthenticated ? user?.name : 'Guest User'}
      </Text>
      {isAuthenticated && (
        <>
          <AccountTabs
            title="Edit Profile"
            icon="pencil-box-multiple-outline"
            onClick={() => navigation.navigate('editprofile')}
          />
          <AccountTabs
            title="My Orders"
            icon="cart-outline"
            onClick={() => navigation.navigate('myorders')}
          />
          <AccountTabs
            title="Saved Addresses"
            icon="map-marker-outline"
            onClick={() => navigation.navigate('savedaddresses')}
          />
        </>
      )}
      <AccountTabs
        title="Help Center"
        icon="headset"
        onClick={() => navigation.navigate('helpcenter')}
      />
      {isAuthenticated && (
        <AccountTabs
          title="Delete Account"
          icon="delete-outline"
          showArrow={false}
          color={Colors.RED}
          onClick={deleteAccountHandler}
        />
      )}
      {isAuthenticated ? (
        <AccountTabs
          title="Logout"
          color={Colors.RED}
          showArrow={false}
          icon="power-standby"
          onClick={logoutHandler}
        />
      ) : (
        <AccountTabs
          title="Login / Signup"
          color={Colors.RED}
          showArrow={false}
          icon="power-standby"
          onClick={loginHandler}
        />
      )}
    </View>
  );
}
