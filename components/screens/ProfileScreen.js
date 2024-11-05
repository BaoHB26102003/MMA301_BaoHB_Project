import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const currentUsername = await AsyncStorage.getItem('currentUsername');
            const storedUsers = await AsyncStorage.getItem('users');
            const users = storedUsers ? JSON.parse(storedUsers) : [];

            const user = users.find(u => u.username === currentUsername);
            if (user) {
                setUserInfo(user);
            }
        };
        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('currentUsername');
        navigation.navigate("Login");
    };

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
                source={require('../database/images/login.png')}s
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

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Log out</Text>
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
        width: 200,
        height: 200,
        alignSelf: "center",
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        alignSelf: "center",
        marginVertical: 20,
    },
    infoContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 8,
        elevation: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
    valueUsername: {
        alignSelf: "center",
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
       
    },
    value: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
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
    backButton: {
        padding: 10,
        backgroundColor: '#FFEBCC',
        borderRadius: 20,
        marginTop: 140,
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});
