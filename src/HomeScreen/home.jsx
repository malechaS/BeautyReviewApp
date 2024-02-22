import {Text, View} from 'react-native';
import React, {useEffect} from 'react';

import {useDispatch} from 'react-redux';

import Header from '../header/header';
import {
  adminPermissionAction,
  loginAction,
  modPermissionAction,
  userPermissionAction,
} from '../redux/actions';
import {Icon} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';

function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const checkIsLoggedIn = async () => {
    const response = await fetch('http://192.168.1.103:3000/user/isLoggedIn', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      dispatch(loginAction());
      const json = await response.json();
      if (json['permission'] === 'User') {
        dispatch(userPermissionAction());
      } else if (json['permission'] === 'Moderator') {
        dispatch(modPermissionAction());
      } else if (json['permission'] === 'Admin') {
        dispatch(adminPermissionAction());
      }
    }
  };

  useEffect(() => {
    checkIsLoggedIn();
  }, [isFocused]);

  return (
    <View className='flex-1 '>
      <Header navigation={navigation} />
      <View className='flex-1 items-center'>
        <Icon
          name='long-arrow-up'
          type='font-awesome'
          size={400}
          color='#60a5fa'
          className=''
        />
        <Text
          className='text-gray-900 mt-3.5 font-bold text-3xl'
        >Click here to scan!</Text>
      </View>
    </View>
  );
}

export default HomeScreen;
