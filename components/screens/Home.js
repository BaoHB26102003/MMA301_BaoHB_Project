import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
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

  const menuItems = [
    { label: 'Home', icon: 'home', route: 'Home', backgroundColor: '#FFD1DC' },
    { label: 'Profile', icon: 'user', route: 'Profile', backgroundColor: '#FFD1DC' },
   
    { label: 'Contact', icon: 'check-square', route: 'Contact', backgroundColor: '#FFD1DC' },
    { label: 'About', icon: 'list', route: 'About', backgroundColor: '#FFD1DC' },
  ];

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
        updatedFavorites = currentFavorites.filter((item) => item.id !== product.id);
      } else {
        updatedFavorites = [...currentFavorites, product];
      }

      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(`${username}_favorites`, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    setDropdownVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
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
        <Image source={data.productImage} style={styles.productImage} />
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
      {data.category === 'accessory' || data.category === 'product' ? (
        data.isAvailable ? (
          <View style={styles.availabilityContainer}>
            <FontAwesome name="circle" style={{ fontSize: 12, marginRight: 6, color: COLOURS.green }} />
            <Text style={{ fontSize: 12, color: COLOURS.green }}>Available</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="circle" style={{ fontSize: 12, marginRight: 6, color: COLOURS.red }} />
            <Text style={{ fontSize: 12, color: COLOURS.red }}>Unavailable</Text>
          </View>
        )
      ) : null}
      <Text>${data.productPrice}</Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => { setDropdownVisible(false); navigation.navigate(item.route); }}
      style={[styles.optionContainer, { backgroundColor: item.backgroundColor }]}
    >
      <FontAwesome name={item.icon} style={styles.optionIcon} />
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLOURS.white} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setDropdownVisible(!isDropdownVisible)}>
            <Entypo name="menu" style={styles.menuIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <MaterialCommunityIcons name="heart-circle" style={styles.heartIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MyCart')}>
            <MaterialCommunityIcons name="cart" style={styles.cartIcon} />
          </TouchableOpacity>
        </View>

        {isDropdownVisible && (
          <View style={styles.dropdownMenu}>
            <FlatList  scrollEnabled={false} 
              data={menuItems}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.label}
            />
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.productSection}>
          <Text style={styles.title}>Hi-Fi Shop &amp; Service</Text>
          <Text style={styles.subtitle}>
            Audio shop on Rustaveli Ave 57.
            {'\n'}This shop offers both products and services
          </Text>
        </View>

        <View style={styles.productGridContainer}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>Products</Text>
            </View>
            <Text style={styles.sectionLink} onPress={() => navigation.navigate('ViewAllProduct')}>
              See All
            </Text>
          </View>

          <View style={styles.productGrid}>
            {products.slice(0, 6).map(data => {
              return <ProductCard data={data} key={data.id} />;
            })}
          </View>
        </View>

        <View style={styles.productGridContainer}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>Accessories</Text>
            </View>
            <Text style={styles.sectionLink} onPress={() => navigation.navigate('ViewAllAccessories')}>
              See All
            </Text>
          </View>
          <View style={styles.productGrid}>
            {accessory.slice(0, 6).map(data => {
              return <ProductCard data={data} key={data.id} />;
            })}
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
  dropdownMenu: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
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
  logoutButton: {
    marginTop: 10,
    width: '100%',
    height: 45,
    backgroundColor: "#ff5a5f",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
