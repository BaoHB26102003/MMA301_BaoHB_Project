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
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const handleLogin = async () => {
    if (!username) {
      Alert.alert("Error", "Please enter your username");
      return;
    }
    if (password.length <= 5) {
      Alert.alert("Error", "Password must be more than 5 characters");
      return;
    }

    const storedUsers = await AsyncStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      await AsyncStorage.setItem('currentUsername', username);
      navigation.navigate("Home", { username: user.username });
    } else {
      Alert.alert("Error", "Invalid username or password");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="arrow-back-outline" color="#333" size={25} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome</Text>
        <Text style={styles.headingText}>Back</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={30} color="#888" />
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
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
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
          <Text style={styles.accountText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signupText}>Sign up</Text>
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
  forgotPasswordText: {
    textAlign: 'right',
    color: '#333',
    fontWeight: '600',
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: '#333',
    borderRadius: 100,
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginText: {
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
    height: 20,
    width: 20,
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
  signupText: {
    color: '#333',
    fontWeight: '700',
    marginLeft: 5,
  },
});
