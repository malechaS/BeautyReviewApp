import React, {useState} from 'react';
import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Header from '../header/header';
import {loginAction} from '../redux/actions';
import {useDispatch} from 'react-redux';

const validationSchema = Yup.object().shape({
  First_Name: Yup.string().min(3, 'Podaj minimum 3 znaki').required('Wymagane'),
  Last_Name: Yup.string().min(3, 'Podaj minimum 3 znaki').required('Wymagane'),
  Email: Yup.string().email('Niepoprawny email').required('Wymagane'),
  Password: Yup.string()
      .required('Wymagane')
      .min(8, 'Hasło musi mieć co najmniej 8 znaków'),
  confirmPassword: Yup.string()
      .oneOf([Yup.ref('Password'), null], 'Hasła muszą być takie same')
      .required('Wymagane'),
});

function RegisterScreen({navigation}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const autoLogin = async (email, password) => {
    try {
      const response = await fetch('http://192.168.1.103:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'email': email,
          'password': password,
        }),
      });
      const json = await response.json();
      if (json['message'] === 'Success - Login correct') {
        dispatch(loginAction());
        setLoading(false);
        navigation.navigate('Home');
      } else if (json['message'] === 'Fail - Already logged in') {
        setLoading(false);
        throw new Error('Użytkownik z takim adresem Email juz istnieje.');
        dispatch(loginAction());
      } else {
        setLoading(false);
        throw new Error('Spróbuj ponownie później');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Błąd', error.message);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    delete values.confirmPassword;
    try {
      const response = await fetch('http://192.168.1.103:3000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.status === 409) {
        setLoading(false);
        throw new Error('Taki użytkownik już istnieje');
      } else if (!response.ok) {
        setLoading(false);
        throw new Error('Spróbuj ponownie później');
      }
      delete values.First_Name;
      delete values.Last_Name;
      const email = values.Email;
      const password = values.Password;
      delete values.Email;
      delete values.Password;
      await autoLogin(email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Błąd', error.message);
    }
  };

  return (
    <View className='bg-white flex-1'>
      <Header navigation={navigation} />
      <Text
        className='mt-10 mb-8 text-gray-900 text-center text-4xl opacity-60'
      >Rejestracja</Text>
      <Formik
        initialValues={{
          First_Name: '',
          Last_Name: '',
          Email: '',
          Password: '',
          confirmPassword: '',
        }}
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
          <ScrollView>

            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('First_Name')}
              onBlur={handleBlur('First_Name')}
              value={values.First_Name}
              placeholder="Imię"
              placeholderTextColor={'#000'}
            />
            {touched.First_Name && errors.First_Name && (
              <Text
                className='mx-6 mb-2 text-red-500'
              >{errors.First_Name}</Text>
            )}

            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('Last_Name')}
              onBlur={handleBlur('Last_Name')}
              value={values.Last_Name}
              placeholder="Nazwisko"
              placeholderTextColor={'#000'}
            />
            {touched.Last_Name && errors.Last_Name && (
              <Text className='mx-6 mb-2 text-red-500'>{errors.Last_Name}</Text>
            )}


            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('Email')}
              onBlur={handleBlur('Email')}
              value={values.Email}
              placeholder="Email"
              placeholderTextColor={'#000'}
              keyboardType="email-address"
            />
            {touched.Email && errors.Email && (
              <Text className='mx-6 mb-2 text-red-500'>{errors.Email}</Text>
            )}


            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('Password')}
              onBlur={handleBlur('Password')}
              value={values.Password}
              placeholder="Hasło"
              placeholderTextColor={'#000'}
              secureTextEntry
            />
            {touched.Password && errors.Password && (
              <Text className='mx-6 mb-2 text-red-500'>{errors.Password}</Text>
            )}


            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              placeholder="Potwierdź hasło"
              placeholderTextColor={'#000'}
              secureTextEntry
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text
                className='mx-6 mb-2 text-red-500'
              >{errors.confirmPassword}</Text>
            )}

            <View className='w-56 mx-auto mt-10'>
              <TouchableOpacity
                className='bg-blue-500 rounded-md h-14 justify-center'
                onPress={handleSubmit}
              >
                <Text
                  className='text-center p-3 text-white font-bold text-lg'
                >Zarejestruj się</Text>
              </TouchableOpacity>
            </View>

            <View className='mx-5 my-5'>
              <Text className='text-gray-900 text-center'>LUB</Text>
            </View>

            <View className='w-56 mb-5 mx-auto'>
              <TouchableOpacity
                className='bg-white rounded-md border-blue-500
                border h-14 justify-center'
                onPress={() => navigation.navigate('Login')}
              >
                <Text
                  className='text-center p-3 text-blue-500 font-bold text-lg'
                >Zaloguj się</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Formik>
      {loading &&
        <View className='flex-1 justify-center content-center
        block w-full h-full absolute bg-gray-800 opacity-50'>
          <ActivityIndicator size='large'/>
        </View>
      }
    </View>
  );
}

export default RegisterScreen;
