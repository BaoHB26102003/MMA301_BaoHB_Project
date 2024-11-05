
import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/screens/Home';
import MyCart from './components/screens/MyCart';
import ProductInfo from './components/screens/ProductInfo';
import LoginScreen from './components/screens/LoginScreen';
import SignUpScreen from './components/screens/SignUpScreen';
import FavoritesScreen from './components/screens/FavoriteExpensesScreen';
import ProfileScreen from './components/screens/ProfileScreen';

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Đặt LoginScreen là màn hình đầu tiên */}
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Home' component={Home} />
      
        <Stack.Screen name='MyCart' component={MyCart} />
        <Stack.Screen name='ProductInfo' component={ProductInfo} />
        <Stack.Screen name='Favorites' component={FavoritesScreen} />
        <Stack.Screen name='SignUp' component={SignUpScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
