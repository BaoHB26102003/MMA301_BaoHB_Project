import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState(null);
  const [address, setAddress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);

  const handleSignUp = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9]{5,}$/;

    if (!email || !username || !password || !birthday || !address) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (!usernameRegex.test(username)) {
      Alert.alert("Error", "Username must be at least 5 characters and contain only letters and numbers");
      return;
    }
    if (password.length <= 5) {
      Alert.alert("Error", "Password must be more than 5 characters");
      return;
    }
    if (address.length < 5) {
      Alert.alert("Error", "Address must be at least 5 characters long");
      return;
    }

    // Lấy danh sách người dùng từ AsyncStorage
    const storedUsers = await AsyncStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Thêm người dùng mới vào danh sách
    const newUser = {
      email,
      username,
      password,
      birthday: birthday.toLocaleDateString(),
      address,
    };
    users.push(newUser);

    // Lưu danh sách người dùng mới vào AsyncStorage
    await AsyncStorage.setItem('users', JSON.stringify(users));
    Alert.alert("Success", "Account created successfully");
    navigation.navigate("Login");
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color="#333" size={25} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Let's get</Text>
        <Text style={styles.headingText}>started</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={30} color="#888" />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={30} color="#888" />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your username"
            placeholderTextColor="#888"
            onChangeText={setUsername}
            value={username}
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="lock" size={30} color="#888" />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={secureEntry}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
            <Ionicons name={secureEntry ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={30} color="#888" />
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: birthday ? "#333" : "#888" }}>
              {birthday ? birthday.toLocaleDateString() : "Select Birthday"}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={birthday || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={30} color="#888" />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your address"
            placeholderTextColor="#888"
            onChangeText={setAddress}
            value={address}
          />
        </View>
        <TouchableOpacity style={styles.signUpButtonWrapper} onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
        <Text style={styles.continueText}>or continue with</Text>
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image
            source={require('../database/images/google.png')}
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Already have an account!</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: '#333',
    fontWeight: '600',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1.5,
    height: 45,
    borderColor: '#888',
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  dateInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  signUpButtonWrapper: {
    backgroundColor: '#333',
    borderRadius: 100,
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signUpText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  continueText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
    color: '#333',
  },
  googleButtonContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  googleImage: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  googleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  accountText: {
    color: '#333',
    fontSize: 14,
  },
  loginText: {
    color: '#333',
    fontWeight: '700',
    marginLeft: 5,
  },
});