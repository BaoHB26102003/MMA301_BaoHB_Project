import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLOURS, Items } from '../database/Database';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [accessory, setAccessory] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const username = route?.params?.username;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataFromDB();
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const getDataFromDB = () => {
    let productList = [];
    let accessoryList = [];
    for (let index = 0; index < Items.length; index++) {
      if (Items[index].category === 'product') {
        productList.push(Items[index]);
      } else if (Items[index].category === 'accessory') {
        accessoryList.push(Items[index]);
      }
    }
    setProducts(productList);
    setAccessory(accessoryList);
  };

 
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(`${username}_favorites`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (product) => {
    try {
      const storedFavorites = await AsyncStorage.getItem(`${username}_favorites`);
      const currentFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      let updatedFavorites;
      if (currentFavorites.some(item => item.id === product.id)) {
        // Remove from favorites if already exists
        updatedFavorites = currentFavorites.filter((item) => item.id !== product.id);
      } else {
        // Add to favorites if not exists
        updatedFavorites = [...currentFavorites, product];
      }

      setFavorites(updatedFavorites); // Update state
      await AsyncStorage.setItem(`${username}_favorites`, JSON.stringify(updatedFavorites)); // Save to AsyncStorage
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };


  const ProductCard = ({ data }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductInfo', { productID: data.id })}
      style={styles.productCard}
    >
      <View style={styles.productImageContainer}>
        {data.isOff && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{data.offPercentage}%</Text>
          </View>
        )}
        <Image
          source={data.productImage}
          style={styles.productImage}
        />
        <TouchableOpacity
          style={styles.favoriteIconContainer}
          onPress={() => toggleFavorite(data)}
        >
          <FontAwesome
            name={favorites.some(item => item.id === data.id) ? 'heart' : 'heart-o'}
            style={[
              styles.favoriteIcon,
              { color: favorites.some(item => item.id === data.id) ? 'red' : 'black' }
            ]}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.productName}>{data.productName}</Text>
      {data.category === 'accessory' && (
        <View style={styles.availabilityContainer}>
          <FontAwesome
            name="circle"
            style={[styles.availabilityIcon, { color: data.isAvailable ? COLOURS.green : COLOURS.red }]}
          />
          <Text style={{ fontSize: 12, color: data.isAvailable ? COLOURS.green : COLOURS.red }}>
            {data.isAvailable ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      )}
      <Text> ${data.productPrice}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLOURS.white} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Entypo name="menu" style={styles.menuIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <MaterialCommunityIcons
              name="heart-circle"
              style={styles.heartIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MyCart')}>
            <MaterialCommunityIcons
              name="cart"
              style={styles.cartIcon}
            />
          </TouchableOpacity>
        </View>

        <Modal
          isVisible={isDropdownVisible}
          onBackdropPress={() => setDropdownVisible(false)}
          animationIn="fadeInDown"
          animationOut="fadeOutUp"
          style={styles.modalContainer}
        >
          <View style={styles.dropdownMenu}>
            <View style={styles.profileContainer}>
              <Image
                source={require('../database/images/login.png')}
                style={styles.avatar}
              />
              <Text>{username}</Text>
            </View>

           
          </View>
        </Modal>

        <View style={styles.productSection}>
          <Text style={styles.title}>Hi-Fi Shop &amp; Service</Text>
          <Text style={styles.subtitle}>
            Audio shop on Rustaveli Ave 57.
            {'\n'}This shop offers both products and services
          </Text>
        </View>

        <View style={styles.productGridContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products</Text>
            <Text style={styles.sectionLink}>SeeAll</Text>
          </View>
          <View style={styles.productGrid}>
            {products.map(data => (
              <ProductCard data={data} key={data.id} />
            ))}
          </View>
        </View>

        <View style={styles.productGridContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Accessories</Text>
            <Text style={styles.sectionLink}>SeeAll</Text>
          </View>
          <View style={styles.productGrid}>
            {accessory.map(data => (
              <ProductCard data={data} key={data.id} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: COLOURS.white,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuIcon: {
    fontSize: 25,
    color: COLOURS.black,
    padding: 12,
  },
  cartIcon: {
    fontSize: 25,
    color: COLOURS.backgroundMedium,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOURS.backgroundLight,
  },
  heartIcon: {
    fontSize: 25,
    color: COLOURS.backgroundMedium,
    padding: 12,
    marginLeft: 220,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOURS.backgroundLight,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 40,
    width: '90%',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  menuOptions: {
    marginVertical: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionIcon: {
    fontSize: 18,
    color: COLOURS.black,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: COLOURS.black,
  },
  logoutText: {
    fontSize: 20,
    color: 'red',
    marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#ddd',
    borderRadius: 15,
    paddingVertical: 5,
  },
  productSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    color: COLOURS.black,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: COLOURS.black,
    fontWeight: '400',
    lineHeight: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    color: COLOURS.black,
    fontWeight: '500',
  },
  sectionLink: {
    fontSize: 14,
    color: COLOURS.blue,
  },
  productGridContainer: {
    paddingHorizontal: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  productCard: {
    width: '48%',
    marginVertical: 14,
    overflow: 'hidden',
    borderRadius: 10,
  },
  productImageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: COLOURS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: COLOURS.green,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 4,
  },
  discountText: {
    fontSize: 12,
    color: COLOURS.white,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 12,
    color: COLOURS.black,
    fontWeight: '600',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  favoriteIcon: {
    fontSize: 18,
  },
});

export default Home;
