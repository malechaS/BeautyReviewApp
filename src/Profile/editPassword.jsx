import React, {useState} from 'react';
import {View, TextInput, Text, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Header from '../header/header';

const validationSchema = Yup.object().shape({
  Old_Password: Yup.string()
      .required('Wymagane')
      .min(8, 'Hasło musi mieć co najmniej 8 znaków'),
  New_Password1: Yup.string()
      .required('Wymagane')
      .min(8, 'Hasło musi mieć co najmniej 8 znaków'),
  New_Password2: Yup.string()
      .required('Wymagane')
      .min(8, 'Hasło musi mieć co najmniej 8 znaków')
      .oneOf(
          [Yup.ref('New_Password1'),
            null],
          'Adresy email muszą być takie same.'),
});

const EditPassword = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const handleUpdatePassword = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.103:3000/user/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error('Spróbuj ponownie później.');
      }
      setLoading(false);
      Alert.alert('Sukces', 'Zmiana przebiegła pomyślnie');
      delete values.Old_Password;
      delete values.New_Password1;
      delete values.New_Password2;
      navigation.navigate('Profile');
    } catch (error) {
      Alert.alert('Błąd', error.message);
    }
  };


  return (
    <View className='bg-white flex-1'>
      <Header navigation={navigation} />
      <Text
        className='mt-10 mb-8 text-center text-4xl opacity-60 text-gray-950'
      >Zmiana hasła</Text>
      <Formik
        initialValues={{Old_Password: '', New_Password1: '', New_Password2: ''}}
        onSubmit={handleUpdatePassword}
        validationSchema={validationSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>

            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('Old_Password')}
              onBlur={handleBlur('Old_Password')}
              value={values.Old_Password}
              placeholder="Stare hasło"
              placeholderTextColor={'#000'}
              secureTextEntry
            />
            {touched.Old_Password && errors.Old_Password && (
              <Text
                className='mx-6 mb-2 text-red-500'
              >{errors.Old_Password}</Text>
            )}
            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('New_Password1')}
              onBlur={handleBlur('New_Password1')}
              value={values.New_Password1}
              placeholder="Nowe hasło"
              placeholderTextColor={'#000'}
              secureTextEntry
            />
            {touched.New_Password1 && errors.New_Password1 && (
              <Text
                className='mx-6 mb-2 text-red-500'
              >{errors.New_Password1}</Text>
            )}
            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('New_Password2')}
              onBlur={handleBlur('New_Password2')}
              value={values.New_Password2}
              placeholder="Powtórz nowe hasło"
              placeholderTextColor={'#000'}
              secureTextEntry
            />
            {touched.New_Password2 && errors.New_Password2 && (
              <Text
                className='mx-6 mb-2 text-red-500'
              >{errors.New_Password2}</Text>
            )}
            <View className='w-56 mx-auto mt-10'>
              <TouchableOpacity
                className='bg-blue-500 rounded-md h-14 justify-center'
                onPress={handleSubmit}>
                <Text
                  className='text-center p-3 text-white font-bold text-lg'
                >Zapisz</Text>
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
};

export default EditPassword;
