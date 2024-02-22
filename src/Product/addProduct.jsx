import React from 'react';
import {View, TextInput, Text, Alert, TouchableOpacity} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Header from '../header/header';

const validationSchema = Yup.object().shape({
  Name: Yup.string()
      .required('Wymagane')
      .min(3, 'Wpisz minimum 3 znaki.')
      .max(190, 'Opinia musi mieć maksymalnie 250 znaków.'),
  Brand: Yup.string()
      .required('Wymagane')
      .min(3, 'Wpisz minimum 3 znaki.')
      .max(190, 'Opinia musi mieć maksymalnie 250 znaków.'),
  Brand_series: Yup.string()
      .required('Wymagane')
      .min(3, 'Wpisz minimum 3 znaki.')
      .max(190, 'Opinia musi mieć maksymalnie 250 znaków.'),

});

const AddProduct = ({navigation, route}) => {
  const {EAN} = route.params;
  const handleAddProduct = async (values) => {
    values.EAN = EAN;
    try {
      const response = await fetch('http://192.168.1.103:3000/product/postNewProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.status === 401) {
        throw new Error('Brak dostępu. Zaloguj się.');
      }
      if (!response.ok) {
        throw new Error('Spróbuj ponownie później.');
      }
      Alert.alert('Sukces', 'Dodano produkt');
      delete values.Name;
      delete values.Brand;
      delete values.Brand_series;
      delete values.EAN;
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Błąd', error.message);
    }
  };


  return (
    <View className='bg-white flex-1'>
      <Header navigation={navigation} />
      <Text
        className='mt-10 mb-8 text-gray-900 text-center text-4xl opacity-60'
      >Dodawanie produktu</Text>
      <Formik
        initialValues={{Name: '', Brand: '', Brand_series: ''}}
        onSubmit={handleAddProduct}
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
              onChangeText={handleChange('Name')}
              onBlur={handleBlur('Name')}
              value={values.Name}
              placeholder="Rodzaj produktu"
              placeholderTextColor={'#000'}
            />
            {touched.Name && errors.Name && (
              <Text className='mx-6 mb-2 text-red-500'>{errors.Name}</Text>
            )}

            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
                border-b opacity-60 text-gray-950'
              onChangeText={handleChange('Brand')}
              onBlur={handleBlur('Brand')}
              value={values.Brand}
              placeholder="Nazwa firmy"
              placeholderTextColor={'#000'}
            />
            {touched.Brand && errors.Brand && (
              <Text className='mx-6 mb-2 text-red-500'>{errors.Brand}</Text>
            )}

            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('Brand_series')}
              onBlur={handleBlur('Brand_series')}
              value={values.Brand_series}
              placeholder="Nazwa serii produktów"
              placeholderTextColor={'#000'}
            />
            {touched.Brand_series && errors.Brand_series && (
              <Text
                className='mx-6 mb-2 text-red-500'
              >{errors.Brand_series}</Text>
            )}

            <View className='w-56 mx-auto mt-10'>
              <TouchableOpacity
                className='bg-blue-500 rounded-md h-14 justify-center'
                onPress={handleSubmit}
              >
                <Text
                  className='text-center p-3 text-white font-bold text-lg'
                >Dodaj produkt</Text>
              </TouchableOpacity>
            </View>

            <View className='w-56 mt-5 mx-auto'>
              <TouchableOpacity
                className='bg-white rounded-md border-blue-500
                border h-14 justify-center'
                onPress={() => navigation.navigate('Home')}
              >
                <Text
                  className='text-center p-3 text-blue-500 font-bold text-lg'
                >Anuluj</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      </Formik>
    </View>
  );
};
export default AddProduct;
