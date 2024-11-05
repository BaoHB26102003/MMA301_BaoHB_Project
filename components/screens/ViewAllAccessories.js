import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLOURS, Items } from "../database/Database";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const ViewAllAccessories = ({ navigation }) => {
    const [allAccessories, setAllAccessories] = useState([]);

    useEffect(() => {
        const accessories = Items.filter(item => item.category === 'accessory');
        setAllAccessories(accessories);
    }, []);

    const renderAccessoryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.accessoryCard}
            onPress={() => navigation.navigate('ProductInfo', { productID: item.id })}
        >
            <Image source={item.productImage} style={styles.accessoryImage}/>
            <Text style={styles.accessoryName}>{item.productName}</Text>
            <Text style={styles.accessoryPrice}>${item.productPrice}</Text>
            <Text style={[styles.stockStatus, item.isAvailable ? styles.inStock : styles.outOfStock]}>
                {item.isAvailable ? 'Available' : 'UnAvailable'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 20,
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
                    All Accessories
                </Text>
                <View style={{ width: 32 }} />
            </View>
            <FlatList
                data={allAccessories}
                renderItem={renderAccessoryItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.accessoryList}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLOURS.white,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: COLOURS.black,
    },
    accessoryList: {
        paddingBottom: 16,
    },
    accessoryCard: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 16,
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLOURS.backgroundLight,
    },
    accessoryImage: {
        width: '100%',
        height: 100,
        resizeMode: 'contain',
    },
    accessoryName: {
        fontSize: 16,
        color: COLOURS.black,
        marginTop: 8,
        fontWeight: 'bold',
    },
    accessoryPrice: {
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

export default ViewAllAccessories;