import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOURS } from '../database/Database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EditAddress = ({ navigation }) => {
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    setIsSaveDisabled(
      !province || !district || !ward || !houseNumber || !phoneNumber
    );
  }, [province, district, ward, houseNumber, phoneNumber]);

  const saveAddress = async () => {
    const address = `${province}, ${district}, ${ward}, ${houseNumber}`;
    await AsyncStorage.setItem('deliveryAddress', address);
    await AsyncStorage.setItem('phoneNumber', phoneNumber);
    Alert.alert('Address updated successfully');
    navigation.goBack();
  };

  const loadAddress = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem('deliveryAddress');
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      
      if (savedAddress) {
        const [loadedProvince, loadedDistrict, loadedWard, loadedHouseNumber] = savedAddress.split(', ');
        setProvince(loadedProvince || '');
        setDistrict(loadedDistrict || '');
        setWard(loadedWard || '');
        setHouseNumber(loadedHouseNumber || '');
      }
      
      if (savedPhoneNumber) {
        setPhoneNumber(savedPhoneNumber);
      }
    } catch (error) {
      Alert.alert('Error loading address');
    }
  };

  useEffect(() => {
    loadAddress();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
            navigation.goBack();
        }}>
          <MaterialCommunityIcons
            name="chevron-left"
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>Update Address</Text>

        <View style={styles.headerRightSpace} />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Province"
          value={province}
          onChangeText={setProvince}
        />

        <TextInput
          style={styles.input}
          placeholder="District"
          value={district}
          onChangeText={setDistrict}
        />

        <TextInput
          style={styles.input}
          placeholder="Ward"
          value={ward}
          onChangeText={setWard}
        />

        <TextInput
          style={styles.input}
          placeholder="House Number"
          value={houseNumber}
          onChangeText={setHouseNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { opacity: isSaveDisabled ? 0.5 : 1 }]}
        onPress={saveAddress}
        disabled={isSaveDisabled}
      >
        <Text style={styles.buttonText}>Save Address</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          Alert.alert(
            'Confirm Clear Address',
            'Are you sure you want to clear your address?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: async () => {
                  await AsyncStorage.removeItem('deliveryAddress');
                  await AsyncStorage.removeItem('phoneNumber');
                  navigation.navigate('MyCart');
                },
              },
            ],
            { cancelable: true }
          );
        }}
      >
        <Text style={styles.buttonText}>Clear Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.white,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 26,
    color: COLOURS.backgroundDark,
    padding: 10,
    backgroundColor: COLOURS.backgroundLight,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 22,
    color: COLOURS.black,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerRightSpace: {
    width: 32, // Giữ chỗ để cân đối với nút back
  },
  inputContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOURS.grey,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: COLOURS.backgroundLight,
    color: COLOURS.black,
  },
  saveButton: {
    backgroundColor: COLOURS.blue,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
  clearButton: {
    backgroundColor: COLOURS.red,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: COLOURS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
