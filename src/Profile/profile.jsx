import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {clearPermissionAction, logoutAction} from '../redux/actions';

import Header from '../header/header';
import LoginScreen from './login';

function ProfileScreen({navigation, route}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(false);
  const [lastName, setLastName] = useState(false);
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const permission = useSelector((state) => state.perm.permission);

  const getUserDetails = async () => {
    const response = await fetch('http://192.168.1.103:3000/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    setFirstName(json['data'][0]['First_Name']);
    setLastName(json['data'][0]['Last_Name']);
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUserDetails();
    }
  }, [isLoggedIn]);

  const getProductByID = async (productID) => {
    const response = await fetch('http://192.168.1.103:3000/product/getById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'ID': productID}),
    });
    const json = await response.json();
    return json['data'][0]['Brand']+' '+
        json['data'][0]['Brand_series'];
  };

  const getAllMyReviews = async () => {
    try {
      const response = await fetch('http://192.168.1.103:3000/review/getReviewByLoggedInUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error('Spróbuj ponownie później');
      }
      const json = await response.json();
      const reviews = json['data'];

      for (let i = 0; i < reviews.length; i++) {
        reviews[i]['Brand'] = await getProductByID(reviews[i]['Product_ID']);
      }
      return reviews;
    } catch (error) {
      setLoading(false);
      Alert.alert('Błąd', error.message);
    }
  };

  const myReviewsRedirect = async () => {
    setLoading(true);
    const reviews = await getAllMyReviews();
    setLoading(false);
    navigation.navigate('MyReviews', {reviews});
  };

  const logoutAPI = async () => {
    setLoading(true);
    await fetch('http://192.168.1.103:3000/user/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(logoutAction());
    dispatch(clearPermissionAction());
    setLoading(false);
    navigation.navigate('Home');
  };

  const AdminButtons = () => {
    return (
      <View className='w-56 mx-auto mt-10'>
        <TouchableOpacity
          className='bg-blue-500 rounded-md h-14 justify-center'
          onPress={() => navigation.navigate('CreateUser')}
        >
          <Text
            className='text-center p-3 text-white font-bold text-lg'
          >Tworzenie użytkownika</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!isLoggedIn) {
    return <LoginScreen navigation={navigation} />;
  } else {
    return (
      <View className='flex-1' >
        <Header navigation={navigation} />
        <View>
          <Text
            className='text-3xl text-center mt-10 font-bold text-gray-900'
          >Cześć! {firstName} {lastName}</Text>
        </View>
        <View>

          <View className='w-56 mx-auto mt-10'>
            <TouchableOpacity
              className='bg-blue-500 rounded-md h-14 justify-center'
              onPress={myReviewsRedirect}
            >
              <Text
                className='text-center p-3 text-white font-bold text-lg'
              >Moje recenzje</Text>
            </TouchableOpacity>
          </View>

          <View className='w-56 mx-auto mt-10'>
            <TouchableOpacity
              className='bg-blue-500 rounded-md h-14 justify-center'
              onPress={() => navigation.navigate('EditEmail')}
            >
              <Text
                className='text-center p-3 text-white font-bold text-lg'
              >Zmień adres email</Text>
            </TouchableOpacity>
          </View>

          <View className='w-56 mx-auto mt-10'>
            <TouchableOpacity
              className='bg-blue-500 rounded-md h-14 justify-center'
              onPress={() => navigation.navigate('EditPassword')}
            >
              <Text
                className='text-center p-3 text-white font-bold text-lg'
              >Zmień hasło</Text>
            </TouchableOpacity>
          </View>

          {permission === 'admin' ?
              <AdminButtons/> :
              null}

          <View className='w-56 mx-auto mt-10'>
            <TouchableOpacity
              className='bg-blue-500 rounded-md h-14 justify-center'
              onPress={() => logoutAPI()}
            >
              <Text
                className='text-center p-3 text-white font-bold text-lg'
              >Wyloguj</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loading &&
          <View
            className='flex-1 justify-center content-center
              block w-full h-full absolute bg-gray-800 opacity-50'>
            <ActivityIndicator size='large'/>
          </View>
        }
      </View>
    );
  }
}

export default ProfileScreen;
