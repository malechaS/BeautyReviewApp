import 'react-native-reanimated';
import 'react-native-gesture-handler';

import React from 'react';

import {Provider} from 'react-redux';
import store from './src/redux/store';


import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Menu from './src/menu/menu';
import HomeScreen from './src/HomeScreen/home';
import ScanScreen from './src/ScanScreen/scan';
import ProductCard from './src/Product/product';
import AddReview from './src/Product/addReview';
import EditReview from './src/Product/editReview';
import AddProduct from './src/Product/addProduct';
import ProfileScreen from './src/Profile/profile';
import EditEmail from './src/Profile/editEmail';
import EditPassword from './src/Profile/editPassword';
import MyReviews from './src/Profile/myReviews';
import RegisterScreen from './src/Profile/register';
import LoginScreen from './src/Profile/login';
import CreateUser from './src/Profile/admin/createUser';

const Drawer = createDrawerNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <Menu {...props} />}
          screenOptions={{headerShown: false}}>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Scan" component={ScanScreen} />
          <Drawer.Screen name="ProductCard" component={ProductCard} />
          <Drawer.Screen name="AddReview" component={AddReview} />
          <Drawer.Screen name="EditReview" component={EditReview} />
          <Drawer.Screen name="AddProduct" component={AddProduct} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="EditEmail" component={EditEmail} />
          <Drawer.Screen name="EditPassword" component={EditPassword} />
          <Drawer.Screen name="MyReviews" component={MyReviews} />
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Register" component={RegisterScreen} />
          <Drawer.Screen name="CreateUser" component={CreateUser} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
