import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function EditProfileScreen({ navigation }) {
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        birthday: '',
        address: ''
    });

    const provinces = [
        "An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu", "Bắc Giang", "Bắc Kạn", "Bắc Ninh", "Bến Tre", 
        "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", 
        "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", 
        "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", 
        "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", 
        "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", 
        "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", 
        "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", 
        "Vĩnh Phúc", "Yên Bái"
    ];

    // Load user data from AsyncStorage on component mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const currentUsername = await AsyncStorage.getItem('currentUsername');
                const storedUsers = await AsyncStorage.getItem('users');
                const users = storedUsers ? JSON.parse(storedUsers) : [];

                // Find the current user's data
                const user = users.find(u => u.username === currentUsername);
                if (user) {
                    setUserInfo({
                        username: user.username,
                        email: user.email,
                        birthday: user.birthday,
                        address: user.address
                    });
                }
            } catch (error) {
                Alert.alert("Error", "Failed to load user information.");
            }
        };
        fetchUserInfo();
    }, []);

    // Save the updated user data to AsyncStorage
    const handleSave = async () => {
        try {
            const currentUsername = await AsyncStorage.getItem('currentUsername');
            const storedUsers = await AsyncStorage.getItem('users');
            const users = storedUsers ? JSON.parse(storedUsers) : [];

            // Update the current user's data
            const updatedUsers = users.map(user => {
                if (user.username === currentUsername) {
                    return { ...user, ...userInfo };
                }
                return user;
            });

            // Save the updated list of users back to AsyncStorage
            await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
            Alert.alert("Success", "Your profile has been updated.");
            navigation.navigate('Profile'); // Navigate to ProfileScreen after saving
        } catch (error) {
            Alert.alert("Error", "Failed to save profile changes.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username:</Text>
                <Text style={styles.show}>{userInfo.username}</Text>

                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={userInfo.email}
                    onChangeText={text => setUserInfo({ ...userInfo, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Birthday:</Text>
                <TextInput
                    style={styles.input}
                    value={userInfo.birthday}
                    onChangeText={text => setUserInfo({ ...userInfo, birthday: text })}
                    placeholder="YYYY-MM-DD"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Address:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={userInfo.address}
                        onValueChange={(itemValue) => setUserInfo({ ...userInfo, address: itemValue })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select your province" value="" />
                        {provinces.map((province) => (
                            <Picker.Item key={province} label={province} value={province} />
                        ))}
                    </Picker>
                </View>
            </View>

            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    show: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        padding: 10,
        fontSize: 16,
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginTop: 5,
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 5,
    },
    picker: {
        height: 40,
        width: '100%',
    },
    saveButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelButton: {
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: '#708090',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
