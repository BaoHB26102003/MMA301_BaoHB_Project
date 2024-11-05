
import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/screens/Home';
import MyCart from './components/screens/MyCart';
import ProductInfo from './components/screens/ProductInfo';
import LoginScreen from './components/screens/LoginScreen';
import SignUpScreen from './components/screens/SignUpScreen';
import FavoritesScreen from './components/screens/FavoriteScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import ViewAllProduct from './components/screens/ViewAllProduct';
import ViewAllAccessories from './components/screens/ViewAllAccessories';
import EditAddress from './components/screens/EditAddress';
import AboutScreen from './components/screens/AboutScreen';
import ContactScreen from './components/screens/ContactScreen';
import EditProfileScreen from './components/screens/EditProfileScreen';

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
        <Stack.Screen name='ViewAllAccessories' component={ViewAllAccessories}/>
        <Stack.Screen name='EditAddress' component={EditAddress}/>
        <Stack.Screen name='About' component={AboutScreen} />
        <Stack.Screen name='Contact' component={ContactScreen} />
        <Stack.Screen name='ViewAllProduct' component={ViewAllProduct}/>
     <Stack.Screen name='EditProfileScreen' component={EditProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
