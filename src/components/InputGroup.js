import React from 'react';
import {View, Text, TextInput} from 'react-native';
import Colors from '../utils/Colors';
import ComponentStyles from './ComponentStyles';

const InputGroup = ({type, placeholder, value, onChange, label, ...rest}) => {
  return (
    <View style={ComponentStyles.inputGroupContainer}>
      <Text style={ComponentStyles.inputLabel}>{label}</Text>
      <TextInput
        keyboardType={type}
        style={ComponentStyles.inputField}
        placeholder={placeholder}
        placeholderTextColor={Colors.GRAY}
        value={value}
        onChangeText={onChange}
        {...rest}
      />
    </View>
  );
};

export default InputGroup;
