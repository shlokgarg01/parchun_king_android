import {ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {showToast} from '../../helpers/ShowToast';
import {
  clearErrors,
  getAddressDetails,
  updateAddress,
} from '../../actions/AddressActions';
import {useNavigation} from '@react-navigation/native';
import {UPDATE_ADDRESS_RESET} from '../../constants/AddressConstants';
import InputGroup from '../../components/InputGroup';
import AccountStyles from './AccountStyles';
// import States from '../../data/states.json';
import ServiceablePincodes from '../../data/pincodes.json';
// import Cities from '../../data/cities.json';
import DropDown from '../../components/DropDown';
import LabelGroupInput from '../../components/LabelGroupInput';
import Btn from '../../components/Btn';
import Loader from '../../components/Loader';

export default function UpdateAddress(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const addressId = props.route.params.id;
  const {error: updateError, isUpdated} = useSelector(state => state.address);
  const {error, address, loading} = useSelector(state => state.addressDetails);

  const [label, setLabel] = useState();
  const [userAddress, setUserAddress] = useState();
  const [landmark, setLandmark] = useState()
  // const [city, setCity] = useState();
  // const [isCityOpen, setIsCityOpen] = useState(false);
  // const [cityGroup, setCityGroup] = useState();
  // const [state, setState] = useState();
  // const [isStateOpen, setIsStateOpen] = useState(false);
  const [pincode, setPincode] = useState();
  const [contactNumber, setContactNumber] = useState();

  // const upadteCitiesGroup = () => {
  //   const stateCode = States.find(obj => obj.name === state).isoCode;
  //   setCityGroup(Cities[stateCode]);
  // };

  useEffect(() => {
    if (address._id !== addressId) {
      dispatch(getAddressDetails(addressId));
    } else if (address) {
      setLabel(address.label);
      setUserAddress(address.address);
      setLandmark(address.landmark)
      // setCity(address.city);
      // setState(address.state);
      setPincode(address.pincode.toString());
      setContactNumber(address.contactNumber.toString());
    } else {
      dispatch(getAddressDetails(addressId));
    }

    if (error) {
      showToast('error', error);
      dispatch(clearErrors());
    }

    if (updateError) {
      showToast('error', updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      showToast('success', 'Address Updated Sucessfully');
      navigation.replace('tabnav', {
        screen: 'accounttab',
        params: {screen: 'savedaddresses'},
      });
      dispatch({type: UPDATE_ADDRESS_RESET});
    }
  }, [error, isUpdated, updateError, addressId, loading, address]);

  const validate_params = () => {
    if (!userAddress) {
      showToast('error', 'Please add the address.');
      return false;
    } 
    // else if (!state) {
    //   showToast('error', 'Please select the state.');
    //   return false;
    // } else if (!city) {
    //   showToast('error', 'Please select the city.');
    //   return false;
    // } 
    else if (!pincode) {
      showToast('error', 'Please enter a pincode.');
      return false;
    } else if (!contactNumber || contactNumber.length !== 10) {
      showToast('error', 'Please enter a valid contact number.');
      return false;
    } else if (!label) {
      showToast('error', 'Please select a label.');
      return false;
    } else if (!ServiceablePincodes.includes(parseInt(pincode))) {
      showToast('error', 'We are not available in this pincode right now.');
      return false;
    }
    return true;
  };

  const updateAddressHandler = () => {
    const data = {
      label,
      address: userAddress,
      landmark,
      // city,
      // state,
      pincode,
      contactNumber,
    };

    if (validate_params()) {
      dispatch(updateAddress(addressId, data));
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <View style={AccountStyles.profileContainer}>
          <InputGroup
            label="Address"
            placeholder="Flat Number / Locality / Address"
            value={userAddress}
            onChange={val => setUserAddress(val)}
          />
          <InputGroup
            label="Landmark / Nearby Location"
            placeholder="Landmark"
            value={landmark}
            onChange={val => setLandmark(val)}
          />
          {/* <DropDown
            label="State"
            value={state}
            setValue={val => setState(val)}
            items={States}
            open={isStateOpen}
            onChangeValue={upadteCitiesGroup}
            setIsOpen={() => setIsStateOpen(!isStateOpen)}
            placeholder="Select State"
            zIndex={2}
          />
          {state && (
            <DropDown
              label="City"
              value={city}
              setValue={val => setCity(val)}
              items={cityGroup}
              open={isCityOpen}
              setIsOpen={() => setIsCityOpen(!isCityOpen)}
              placeholder="Select City"
              zIndex={1}
            />
          )} */}
          <InputGroup
            label="Pincode"
            placeholder="eg - 122001"
            value={pincode}
            onChange={val => setPincode(val)}
            type="number-pad"
          />
          <InputGroup
            label="Contact Number"
            placeholder="9999999999"
            value={contactNumber}
            onChange={val => setContactNumber(val)}
            type="number-pad"
          />
          <LabelGroupInput
            label="Label"
            setLabel={val => setLabel(val)}
            selected={label}
          />
          <Btn label="Update" onClick={updateAddressHandler} />
        </View>
        </ScrollView>
      )}
    </>
  );
}
