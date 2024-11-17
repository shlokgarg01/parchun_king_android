import {ScrollView, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {showToast} from '../../helpers/ShowToast';
import {clearErrors, createAddress} from '../../actions/AddressActions';
import {NEW_ADDRESS_RESET} from '../../constants/AddressConstants';
// import States from '../../data/states.json';
// import Cities from '../../data/cities.json';
import ServiceablePincodes from '../../data/pincodes.json';
import InputGroup from '../../components/InputGroup';
import AccountStyles from './AccountStyles';
import DropDown from '../../components/DropDown';
import LabelGroupInput from '../../components/LabelGroupInput';
import Btn from '../../components/Btn';
import Loader from '../../components/Loader';

export default function NewAddress() {
  const dispatch = useDispatch();
  const {loading, error, success} = useSelector(state => state.newAddress);
  const navigation = useNavigation();

  const [address, setAddress] = useState();
  const [landmark, setLandmark] = useState();
  // const [city, setCity] = useState("");
  // const [isCityOpen, setIsCityOpen] = useState(false);
  // const [cityGroup, setCityGroup] = useState();
  // const [state, setState] = useState("");
  // const [isStateOpen, setIsStateOpen] = useState(false);
  const [pincode, setPincode] = useState();
  const [contactNumber, setContactNumber] = useState();
  const [label, setLabel] = useState();

  useEffect(() => {
    if (error) {
      showToast('error', error);
      dispatch(clearErrors());
    }

    if (success) {
      showToast('success', 'Address Added!');
      navigation.replace('tabnav', {
        screen: 'accounttab',
        params: {screen: 'savedaddresses'},
      });
      dispatch({type: NEW_ADDRESS_RESET});
    }
  }, [error, success, dispatch]);

  const validate_params = () => {
    if (!address) {
      showToast('error', 'Please add the address.');
      return false;
    }
    //  else if (!state) {
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

  const submitAddressHandler = () => {
    const data = {
      label,
      address,
      landmark,
      // city,
      // state,
      pincode,
      contactNumber,
    };
    if (validate_params()) {
      dispatch(createAddress(data));
    }
  };

  // const upadteCitiesGroup = () => {
  //   const stateCode = States.find(obj => obj.name === state).isoCode;
  //   setCityGroup(Cities[stateCode]);
  // };

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
              value={address}
              onChange={val => setAddress(val)}
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
            <LabelGroupInput label="Label" setLabel={val => setLabel(val)} />
            <Btn label="Submit" onClick={submitAddressHandler} />
          </View>
        </ScrollView>
      )}
    </>
  );
}
