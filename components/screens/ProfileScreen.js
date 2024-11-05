import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [userInfo, setUserInfo] = useState(null);

    const fetchUserInfo = async () => {
        const currentUsername = await AsyncStorage.getItem('currentUsername');
        const storedUsers = await AsyncStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];

        const user = users.find(u => u.username === currentUsername);
        if (user) {
            setUserInfo(user);
        }
    };

    useEffect(() => {
        fetchUserInfo(); // Load data initially

        const unsubscribe = navigation.addListener('focus', fetchUserInfo); // Reload data when the screen is focused

        return unsubscribe; // Cleanup the listener on component unmount
    }, [navigation]);

    if (!userInfo) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading user information...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../database/images/login.png')}
                style={styles.logoImageStyle}
                resizeMode="contain"
            />
            
            <Text style={styles.valueUsername}>{userInfo.username}</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userInfo.email}</Text>

                <Text style={styles.label}>Birthday:</Text>
                <Text style={styles.value}>{userInfo.birthday}</Text>

                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{userInfo.address}</Text>
            </View>
          
            <TouchableOpacity style={styles.EditButton} onPress={() => navigation.navigate("EditProfileScreen")}>
                <Text style={styles.EditText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
        padding: 20,
    },
    logoImageStyle: {
        width: 230,
        height: 230,
        alignSelf: "center",
        marginTop: 30,
    },
    infoContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 8,
        elevation: 1,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
    valueUsername: {
        alignSelf: "center",
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
    },
    value: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    
    EditButton: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 140,
    },
    EditText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    backButton: {
        padding: 10,
        backgroundColor: '#708090',
        borderRadius: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    signupText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        marginTop: 20,
    },
});
