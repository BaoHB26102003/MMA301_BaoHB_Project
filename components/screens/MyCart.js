import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOURS, Items } from '../database/Database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MyCart = ({ navigation }) => {
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState(null);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [shippingTax, setShippingTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataFromDB();
      fetchAddress();
    });

    return unsubscribe;
  }, [navigation]);

  // Gọi lại calculateTotals khi product thay đổi
  useEffect(() => {
    calculateTotals(product);
  }, [product]);

  // get data from local DB by ID
  const getDataFromDB = async () => {
    let items = await AsyncStorage.getItem('cartItems');
    items = JSON.parse(items);
    let productData = [];
    if (items) {
      Items.forEach(data => {
        if (items.includes(data.id)) {
          productData.push({ ...data, quantity: 1 });
          return;
        }
      });
      setProduct(productData);
    } else {
      setProduct([]);
    }
  };

  // Lấy địa chỉ từ AsyncStorage
  const fetchAddress = async () => {
    const savedAddress = await AsyncStorage.getItem('deliveryAddress');
    const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
    setAddress(savedAddress || 'You have not entered an address');
    setPhoneNumber(savedPhoneNumber || '');
  };

  // Tính tổng phụ, thuế và tổng tiền
  const calculateTotals = productData => {
    let subtotal = 0;
    productData.forEach(item => {
      subtotal += item.productPrice * item.quantity;
    });

    const shippingTax = subtotal * 0.05;
    const total = subtotal + shippingTax;

    setSubtotal(subtotal);
    setShippingTax(shippingTax);
    setTotal(total);
  };

  // remove data from Cart
  const removeItemFromCart = (id) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this item from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            let itemArray = await AsyncStorage.getItem('cartItems');
            itemArray = JSON.parse(itemArray);
            if (itemArray) {
              let array = itemArray.filter(item => item !== id); // Improved to remove item directly
              await AsyncStorage.setItem('cartItems', JSON.stringify(array));
              getDataFromDB();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Hàm cập nhật số lượng sản phẩm
  const updateQuantity = (id, action) => {
    setProduct(prevProducts =>
      prevProducts.map(product => {
        if (product.id === id) {
          const newQuantity = action === 'increment' ? product.quantity + 1 : product.quantity - 1;
          return { ...product, quantity: Math.max(newQuantity, 1) };
        }
        return product;
      })
    );
  };

  // Hàm checkout
  const checkOut = async () => {
    if (!address || address === 'You have not entered an address') {
      Alert.alert('Address Required', 'Please enter a delivery address before proceeding to checkout.');
      return;
    }

    try {
      await AsyncStorage.removeItem('cartItems');
    } catch (error) {
      return error;
    }

    ToastAndroid.show('Items will be Delivered SOON!', ToastAndroid.SHORT);
    navigation.navigate('Home');
  };

  // Các thành phần hiển thị sản phẩm
  const renderProducts = (data) => {
    return (
      <TouchableOpacity
        key={data.id} // Add the unique key prop here based on product ID
        onPress={() => navigation.navigate('ProductInfo', { productID: data.id })}
        style={{
          width: '100%',
          height: 100,
          marginVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
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
        </View>
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'space-around',
          }}>
          <View style={{}}>
            <Text
              style={{
                fontSize: 14,
                maxWidth: '100%',
                color: COLOURS.black,
                fontWeight: '600',
                letterSpacing: 1,
              }}>
              {data.productName}
            </Text>
            <View
              style={{
                marginTop: 4,
                flexDirection: 'row',
                alignItems: 'center',
                opacity: 0.6,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  maxWidth: '85%',
                  marginRight: 4,
                }}>
                ${data.productPrice}
              </Text>
              <Text>
                (~${data.productPrice + data.productPrice / 20})
              </Text>
            </View>
          </View>
          <View
            style={{
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
      </TouchableOpacity>
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 16,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              style={{
                fontSize: 22,
                color: COLOURS.backgroundDark,
                padding: 8,
                backgroundColor: COLOURS.backgroundLight,
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              color: COLOURS.black,
              fontWeight: 'bold',
            }}>
            Order Details
          </Text>
          <View style={{ width: 32 }} />
        </View>
        <Text
          style={{
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
          {product && product.length > 0 ? (
            product.map(data => renderProducts(data)) // Each product now has a unique key based on its ID
          ) : (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 18, color: COLOURS.black }}>
                Your cart is empty.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: COLOURS.blue,
                  borderRadius: 10,
                }}>
                <Text style={{ color: COLOURS.white }}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View>
          <View
            style={{
              paddingHorizontal: 16,
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: COLOURS.black,
                fontWeight: '500',
                letterSpacing: 1,
                marginBottom: 20,
              }}>
              Delivery Location
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '80%',
                  alignItems: 'center',
                }}>
                <View
                  style={{
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
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOURS.black,
                      fontWeight: '500',
                    }}>
                    {address || 'You have not entered an address'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLOURS.black,
                      fontWeight: '400',
                      lineHeight: 20,
                      opacity: 1,
                    }}>
                    Phone: {phoneNumber || ''}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('EditAddress')}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  style={{ fontSize: 22, color: COLOURS.black }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, marginVertical: 10 }}>
            <Text style={{
              fontSize: 16,
              color: COLOURS.black,
              fontWeight: '500',
              letterSpacing: 1,
              marginBottom: 20,
            }}>
              Payment Method
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '80%',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    color: COLOURS.blue,
                    backgroundColor: COLOURS.backgroundLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 12,
                    borderRadius: 10,
                    marginRight: 18,
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '900',
                      color: COLOURS.blue,
                      letterSpacing: 1,
                    }}>
                    VISA
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOURS.black,
                      fontWeight: '500',
                    }}>
                    Visa Classic
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLOURS.black,
                      fontWeight: '400',
                      lineHeight: 20,
                      opacity: 0.5,
                    }}>
                    ****-9092
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                style={{ fontSize: 22, color: COLOURS.black }}
              />
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 16,
              marginTop: 40,
              marginBottom: 80,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: COLOURS.black,
                fontWeight: '500',
                letterSpacing: 1,
                marginBottom: 20,
              }}>
              Order Info
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  maxWidth: '80%',
                  color: COLOURS.black,
                  opacity: 0.5,
                }}>
                Subtotal
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: COLOURS.black,
                  opacity: 0.8,
                }}>
                ${total}.00
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 22,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  maxWidth: '80%',
                  color: COLOURS.black,
                  opacity: 0.5,
                }}>
                Shipping Tax
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: COLOURS.black,
                  opacity: 0.8,
                }}>
                ${total / 20}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  maxWidth: '80%',
                  color: COLOURS.black,
                  opacity: 0.5,
                }}>
                Total
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: COLOURS.black,
                }}>
                ${total + total / 20}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          height: '8%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => (total !== 0 && address ? checkOut() : null)} // Thêm kiểm tra địa chỉ ở đây
          style={{
            width: '86%',
            height: '90%',
            backgroundColor: (total !== 0 && address) ? COLOURS.blue : 'black', // Thay đổi màu nền dựa trên địa chỉ
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: (total === 0 || !address) ? 0.5 : 1, // Vô hiệu hóa độ mờ nếu tổng bằng 0 hoặc không có địa chỉ
          }}
          disabled={total === 0 || !address} // Vô hiệu hóa nếu không có địa chỉ
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              letterSpacing: 1,
              color: COLOURS.white,
              textTransform: 'uppercase',
            }}>
            CHECKOUT (${total !== null ? total + total / 20 : 0} )
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyCart;