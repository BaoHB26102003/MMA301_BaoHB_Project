import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOURS, Items } from '../database/Database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MyCart = ({ navigation }) => {
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingTax, setShippingTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Default payment method

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataFromDB();
    });

    return unsubscribe;
  }, [navigation]);

  // Get data from local DB by ID
  const getDataFromDB = async () => {
    let items = await AsyncStorage.getItem('cartItems');
    items = JSON.parse(items);
    let productData = [];
    if (items) {
      Items.forEach(data => {
        if (items.includes(data.id)) {
          productData.push({ ...data, quantity: 1 }); // Initialize quantity
        }
      });
      setProduct(productData);
      calculateTotals(productData);
    } else {
      setProduct([]);
      calculateTotals([]);
    }
  };

  // Calculate subtotal, shipping tax, and total price of all items in the cart
  const calculateTotals = productData => {
    let subtotal = 0;
    productData.forEach(item => {
      subtotal += item.productPrice * item.quantity; // Adjust for quantity
    });

    const shippingTax = subtotal * 0.05; // Assuming a fixed shipping tax rate
    const total = subtotal + shippingTax;

    setSubtotal(subtotal);
    setShippingTax(shippingTax);
    setTotal(total);
  };

  // Remove data from Cart
  const removeItemFromCart = async id => {
    let itemArray = await AsyncStorage.getItem('cartItems');
    itemArray = JSON.parse(itemArray);
    if (itemArray) {
      let array = itemArray.filter(item => item !== id);
      await AsyncStorage.setItem('cartItems', JSON.stringify(array));
      getDataFromDB();
    }
  };

  // Update product quantity
  const updateQuantity = (id, action) => {
    setProduct(prevProducts =>
      prevProducts.map(product => {
        if (product.id === id) {
          const newQuantity = action === 'increment' ? product.quantity + 1 : product.quantity - 1;
          return { ...product, quantity: Math.max(newQuantity, 1) }; // Ensure quantity doesn't go below 1
        }
        return product;
      })
    );
    calculateTotals(product);
  };

  // Checkout
  const checkOut = async () => {
    try {
      await AsyncStorage.removeItem('cartItems');
    } catch (error) {
      return error;
    }

    ToastAndroid.show('Items will be Delivered SOON!', ToastAndroid.SHORT);
    navigation.navigate('Home');
  };

  const renderProducts = (data) => {
    return (
      <View
        key={data.id}
        style={{
          width: '100%',
          height: 100,
          marginVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductInfo', { productID: data.id })}
          style={{
            width: '30%',
            height: 100,
            padding: 14,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLOURS.backgroundLight,
            borderRadius: 10,
            marginRight: 22,
          }}>
          <Image
            source={data.productImage}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'space-around',
          }}>
          <View>
            <Text style={{
              fontSize: 14,
              color: COLOURS.black,
              fontWeight: '600',
              letterSpacing: 1,
            }}>
              {data.productName}
            </Text>
            <View style={{
              marginTop: 4,
              flexDirection: 'row',
              alignItems: 'center',
              opacity: 0.6,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '400',
                marginRight: 4,
              }}>
                ${data.productPrice}
              </Text>
              <Text>
                (~${data.productPrice + data.productPrice / 20})
              </Text>
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => updateQuantity(data.id, 'decrement')}>
                <Text style={{
                  fontSize: 20,
                  marginHorizontal: 10,
                  color: COLOURS.black,
                }}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 16 }}>{data.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(data.id, 'increment')}>
                <Text style={{
                  fontSize: 20,
                  marginHorizontal: 10,
                  color: COLOURS.black,
                }}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeItemFromCart(data.id)}>
              <MaterialCommunityIcons
                name="delete-outline"
                style={{
                  fontSize: 16,
                  color: COLOURS.backgroundDark,
                  backgroundColor: COLOURS.backgroundLight,
                  padding: 8,
                  borderRadius: 100,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLOURS.white,
        position: 'relative',
      }}>
      <ScrollView>
        <View style={{
          width: '100%',
          flexDirection: 'row',
          paddingTop: 16,
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              style={{
                fontSize: 18,
                color: COLOURS.backgroundDark,
                padding: 12,
                backgroundColor: COLOURS.backgroundLight,
                borderRadius: 12,
              }}
            />
          </TouchableOpacity>
          <Text style={{
            fontSize: 14,
            color: COLOURS.black,
            fontWeight: '400',
          }}>
            Order Details
          </Text>
          <View></View>
        </View>
        <Text style={{
          fontSize: 20,
          color: COLOURS.black,
          fontWeight: '500',
          letterSpacing: 1,
          paddingTop: 20,
          paddingLeft: 16,
          marginBottom: 10,
        }}>
          My Cart
        </Text>
        <View style={{ paddingHorizontal: 16 }}>
          {product.length > 0 ? product.map(renderProducts) : <Text>Your cart is empty.</Text>}
        </View>
        <View>
          <View style={{ paddingHorizontal: 16, marginVertical: 10 }}>
            <Text style={{
              fontSize: 16,
              color: COLOURS.black,
              fontWeight: '500',
              letterSpacing: 1,
              marginBottom: 20,
            }}>
              Delivery Location
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{
                flexDirection: 'row',
                width: '80%',
                alignItems: 'center',
              }}>
                <View style={{
                  color: COLOURS.blue,
                  backgroundColor: COLOURS.backgroundLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  borderRadius: 10,
                  marginRight: 18,
                }}>
                  <MaterialCommunityIcons
                    name="truck-delivery-outline"
                    style={{
                      fontSize: 18,
                      color: COLOURS.blue,
                    }}
                  />
                </View>
                <View>
                  <Text style={{
                    fontSize: 14,
                    color: COLOURS.black,
                    fontWeight: '500',
                  }}>
                    2 Petre Melikishvili St.
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: COLOURS.black,
                    fontWeight: '400',
                    lineHeight: 20,
                    opacity: 0.5,
                  }}>
                    Tbilisi, Georgia
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Payment Method Section */}
          <View style={{ paddingHorizontal: 16, marginVertical: 10, }}>
            <Text style={{ fontSize: 16, color: COLOURS.black, fontWeight: '500', letterSpacing: 1, marginBottom: 20, }}>
              Payment Method
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
              <View style={{ flexDirection: 'row', width: '80%', alignItems: 'center', }}>
                <View style={{ color: COLOURS.blue, backgroundColor: COLOURS.backgroundLight, alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, marginRight: 18, }}>
                  <Text style={{ fontSize: 10, fontWeight: '900', color: COLOURS.blue, letterSpacing: 1, }}>VISA</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, color: COLOURS.black, fontWeight: '500', }}>Visa Classic</Text>
                  <Text style={{ fontSize: 12, color: COLOURS.black, fontWeight: '400', lineHeight: 20, opacity: 0.5, }}>****-9092</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" style={{ fontSize: 22, color: COLOURS.black }} />
            </View>
          </View>
          {/* Total Amount Section */}
          <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
            <View style={{ paddingHorizontal: 16, marginTop: 40, marginBottom: 80, }}>
              <Text style={{ fontSize: 16, color: COLOURS.black, fontWeight: '500', letterSpacing: 1, marginBottom: 20, }}>
                Order Info
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, }}>
                <Text style={{ fontSize: 12, fontWeight: '400', maxWidth: '80%', color: COLOURS.black, opacity: 0.5, }}>Subtotal</Text>
                <Text style={{ fontSize: 12, fontWeight: '400', color: COLOURS.black, opacity: 0.8, }}>${total}.00</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, }}>
                <Text style={{ fontSize: 12, fontWeight: '400', maxWidth: '80%', color: COLOURS.black, opacity: 0.5, }}>Shipping Tax</Text>
                <Text style={{ fontSize: 12, fontWeight: '400', color: COLOURS.black, opacity: 0.8, }}>${total / 20}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                <Text style={{ fontSize: 12, fontWeight: '400', maxWidth: '80%', color: COLOURS.black, opacity: 0.5, }}>Total</Text>
                <Text style={{ fontSize: 18, fontWeight: '500', color: COLOURS.black, }}>${total + total / 20}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={checkOut}
              style={{
                backgroundColor: COLOURS.blue,
                padding: 16,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text style={{
                color: COLOURS.white,
                fontSize: 16,
                fontWeight: '500',
              }}>
                Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyCart;
