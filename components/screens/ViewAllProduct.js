import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLOURS, Items } from '../database/Database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ViewAllProduct = ({ navigation }) => {
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const products = Items.filter(item => item.category === 'product');
        setAllProducts(products);
    }, []);

    const renderProductItem = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductInfo', { productID: item.id })}
        >
            <Image source={item.productImage} style={styles.productImage} />
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productPrice}>${item.productPrice}</Text>
            <Text style={[styles.stockStatus, item.isAvailable ? styles.inStock : styles.outOfStock]}>
                {item.isAvailable ? 'Available' : 'UnAvailable'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons
                        name="chevron-left"
                        style={styles.backButton}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>All Products</Text>
                <View style={{ width: 32 }} />
            </View>
            <FlatList
                data={allProducts}
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.productList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLOURS.white,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    headerText: {
        fontSize: 20,
        color: COLOURS.black,
        fontWeight: 'bold',
    },
    backButton: {
        fontSize: 22,
        color: COLOURS.backgroundDark,
        padding: 8,
        backgroundColor: COLOURS.backgroundLight,
        borderRadius: 10,
    },
    productList: {
        paddingBottom: 16,
    },
    productCard: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 16,
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLOURS.backgroundLight,
    },
    productImage: {
        width: '100%',
        height: 100,
        resizeMode: 'contain',
    },
    productName: {
        fontSize: 16,
        color: COLOURS.black,
        marginTop: 8,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: COLOURS.green,
        marginTop: 4,
    },
    stockStatus: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    inStock: {
        color: COLOURS.green, // Green color for in stock
    },
    outOfStock: {
        color: COLOURS.red, // Red color for out of stock
    },
});

export default ViewAllProduct;
