import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUserAndFavorites = async () => {
      const currentUsername = await AsyncStorage.getItem('currentUsername');
      if (currentUsername) {
        setUsername(currentUsername);
        await loadFavorites(currentUsername);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadUserAndFavorites);
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async (username) => {
    try {
      const storedFavorites = await AsyncStorage.getItem(`${username}_favorites`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      const updatedFavorites = favorites.filter(item => item.id !== productId);
      setFavorites(updatedFavorites);

      await AsyncStorage.setItem(`${username}_favorites`, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const ProductCard = ({ data }) => (
    
    <View style={styles.productCard}>
       <TouchableOpacity onPress={() => navigation.navigate('ProductInfo', { productID: data.id })}>
      
      <View style={styles.productImageContainer}>
        {data.isOff && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{data.offPercentage}%</Text>
          </View>
        )}
        <Image source={data.productImage} style={styles.productImage} />
        <TouchableOpacity
          style={styles.favoriteIconContainer}
          onPress={() => removeFavorite(data.id)}
        >
          <FontAwesome name="heart" style={[styles.favoriteIcon, { color: 'red' }]} />
        </TouchableOpacity>
      </View>
      <Text style={styles.productName}>{data.productName}</Text>
      <Text style={styles.productPrice}>${data.productPrice}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
   
      <Text style={styles.title}>Favorite Products</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.productGrid}>
          {favorites.length > 0 ? (
            favorites.map((data, index) => (
              <ProductCard data={data} key={data.id ? data.id : index} />
            ))
          ) : (
            <Text style={styles.emptyText}>No favorite products found.</Text>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  productCard: {
    width: '95%',
    marginVertical: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'green',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 4,
  },
  discountText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  productImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600"
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#FFEBCC',
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default FavoritesScreen;
