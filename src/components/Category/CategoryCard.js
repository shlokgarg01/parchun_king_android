/* eslint-disable react-native/no-inline-styles */
import {Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import ProductStyles from '../Products/ProductStyles';

export default function CategoryCard({category, navigation}) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('tabnav', {
          screen: 'categorytab',
          params: {
            screen: 'categoryproducts',
            params: {categoryId: category._id, navigation},
          },
        })
      }
      style={ProductStyles.productCardContainer}>
      <Image
        source={{uri: category.image.url}}
        style={ProductStyles.productCardImage}
      />
      <Text
        style={[
          ProductStyles.productCardName,
          {textAlign: 'center', paddingTop: 5},
        ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}
