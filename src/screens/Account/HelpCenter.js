import {View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../utils/Colors';

export default function HelpCenter() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Please contact us for help.</Text>
      <View style={styles.phone_container}>
        <Icon name="email-open-multiple" size={22} color={Colors.BLACK} />
        <TouchableOpacity
          onPress={() => Linking.openURL('mailto:satishpillania65@gmail.com')}>
          <Text style={[styles.phone_title, {fontWeight: 'normal'}]}>
            satishpillania65@gmail.com
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.phone_container}>
        <Icon name="phone" size={22} color={Colors.BLUE} />
        <TouchableOpacity onPress={() => Linking.openURL('tel:7419918199')}>
          <Text style={[styles.phone_title, {color: Colors.BLUE}]}>
            7419918199
          </Text>
        </TouchableOpacity>
        <Text style={[styles.phone_title, {color: Colors.BLUE}]}>,</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:7419917199')}>
          <Text style={[styles.phone_title, {color: Colors.BLUE}]}>
            7419917199
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.phone_container}>
        <Icon name="whatsapp" size={22} color={Colors.DARK_GREEN} />
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://api.whatsapp.com/send?phone=7419918199')
          }>
          <Text style={[styles.phone_title, {color: Colors.DARK_GREEN}]}>
            7419918199
          </Text>
        </TouchableOpacity>
        <Text style={[styles.phone_title, {color: Colors.DARK_GREEN}]}>,</Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://api.whatsapp.com/send?phone=7419917199')
          }>
          <Text style={[styles.phone_title, {color: Colors.DARK_GREEN}]}>
            7419917199
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 22,
    marginTop: 28,
  },
  heading: {
    fontSize: 19,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  phone_container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  phone_title: {
    fontSize: 19,
    marginLeft: 10,
    color: Colors.BLACK,
    fontWeight: 'bold',
  },
});
