import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';

function Menu(props) {
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const permission = useSelector((state) => state.perm.permission);
  const navigation = props.navigation;
  return (
    <DrawerContentScrollView {...props} className='flex-1'>
      <Text
        className='p-3 text-center font-bold text-3xl text-blue-400'>
        BeautyReview
      </Text>
      <View className='mt-6 mx-5 flex-1 flex h-80'>
        <TouchableOpacity
          className='mb-1 py-2'
          onPress={() => navigation.navigate('Home')}>
          <Text className='text-lg text-gray-900'>Strona główna</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='mb-3'
          onPress={() => navigation.navigate('Scan')}>
          <Text className='text-lg text-gray-900'>Skanowanie kodu</Text>
        </TouchableOpacity>

        {permission === 'admin' ?
        <TouchableOpacity
          className='mb-3'
          onPress={() => navigation.navigate('CreateUser')}>
          <Text
            className='text-lg text-gray-900'
          >Tworzenie użytkownika</Text>
        </TouchableOpacity> :
        null}
        {!isLoggedIn && (
          <><TouchableOpacity
            className='mb-3'
            onPress={() => navigation.navigate('Login')}>
            <Text className='text-lg text-gray-900'>Zaloguj się</Text>
          </TouchableOpacity><TouchableOpacity
            className='mb-3'
            onPress={() => navigation.navigate('Register')}>
            <Text className='text-lg text-gray-900'>Zarejestruj się</Text>
          </TouchableOpacity></>
        )}
      </View>

    </DrawerContentScrollView>
  );
}

export default Menu;
