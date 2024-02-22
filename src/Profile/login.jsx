import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';

import Header from '../header/header';
import {loginAction} from '../redux/actions';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Niepoprawny email').required('Wymagane'),
  password: Yup.string().required('Wymagane'),
});

function LoginScreen({navigation}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    const response = await fetch('http://192.168.1.103:3000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    const json = await response.json();
    if (json['message'] === 'Success - Login correct') {
      dispatch(loginAction());
      setLoading(false);
      Alert.alert('Sukces', 'Pomyślnie zalogowano');
      navigation.navigate('Home');
      delete values.email;
      delete values.password;
    } else if (json['message'] === 'Fail - Already logged in') {
      setLoading(false);
      dispatch(loginAction());
    } else {
      setLoading(false);
      Alert.alert('Błąd', 'Spróbuj ponownie później.');
    }
  };


  return (
    <View className='bg-white flex-1'>
      <Header navigation={navigation} />
      <Text
        className='mt-10 mb-8 text-gray-900 text-center text-4xl opacity-60'
      >Logowanie</Text>
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View >
            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="Email"
              placeholderTextColor={'#000'}
              keyboardType="email-address"
            />

            {touched.email && errors.email && (
              <Text className='mx-6 mb-2 text-red-500'>{errors.email}</Text>
            )}

            <TextInput
              className='mx-5 mb-5 mt-4 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'

              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder="Hasło"
              placeholderTextColor={'#000'}
              secureTextEntry
            />

            {touched.password && errors.password && (
              <Text
                className='mx-6 mb-2 text-red-500 h-5'
              >{errors.password}</Text>
            )}

            <View className='w-56 mx-auto mt-10'>
              <TouchableOpacity
                className='bg-blue-500 rounded-md h-14 justify-center'
                onPress={handleSubmit}
              >
                <Text
                  className='text-center p-3 text-white font-bold text-lg'
                >Zaloguj się</Text>
              </TouchableOpacity>
            </View>

            <View className='mx-5 my-5'>
              <Text className='text-gray-900 text-center'>LUB</Text>
            </View>

            <View className='w-56 mx-auto'>
              <TouchableOpacity
                className='bg-white rounded-md border-blue-500
                border h-14 justify-center'
                onPress={() => navigation.navigate('Register')}
              >
                <Text
                  className='text-center p-3 text-blue-500 font-bold text-lg'
                >Zarejestruj się</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
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

export default LoginScreen;
