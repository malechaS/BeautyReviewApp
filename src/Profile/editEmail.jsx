import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Header from '../header/header';

const validationSchema = Yup.object().shape({
  New_Email: Yup.string()
      .email('Niepoprawny email')
      .required('Wymagane'),
  Repeat_New_Email: Yup.string()
      .oneOf([Yup.ref('New_Email'), null], 'Adresy email muszą być takie same.')
      .email('Niepoprawny email')
      .required('Wymagane'),
  Password: Yup.string()
      .required('Wymagane')
      .min(8, 'Hasło musi mieć co najmniej 8 znaków'),
});

const EditEmail = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const handleUpdateEmail = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.103:3000/user/changeEmail', {
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
      delete values.New_Email;
      delete values.Repeat_New_Email;
      delete values.Password;
      navigation.navigate('Profile');
    } catch (error) {
      Alert.alert('Błąd', error.message);
    }
  };


  return (
    <View className='bg-white flex-1'>
      <Header navigation={navigation} />
      <Text
        className='mt-10 mb-8 text-gray-900 text-center text-4xl opacity-60'
      >Zmiana adresu email</Text>
      <Formik
        initialValues={{New_Email: '', Repeat_New_Email: '', Password: ''}}
        onSubmit={handleUpdateEmail}
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
              onChangeText={handleChange('New_Email')}
              onBlur={handleBlur('New_Email')}
              value={values.New_Email}
              placeholder="Nowy email"
              placeholderTextColor={'#000'}
              keyboardType="email-address"
            />
            {touched.New_Email && errors.New_Email && (
              <Text className='mx-6 mb-2 text-red-500'>{errors.New_Email}</Text>
            )}
            <TextInput
              className='mx-5 mb-5 h-10 text-lg p-0
              border-b opacity-60 text-gray-950'
              onChangeText={handleChange('Repeat_New_Email')}
              onBlur={handleBlur('Repeat_New_Email')}
              value={values.Repeat_New_Email}
              placeholder="Powtórz nowy email"
              placeholderTextColor={'#000'}
              keyboardType="email-address"
            />
            {touched.Repeat_New_Email && errors.Repeat_New_Email && (
              <Text
                className='mx-6 mb-2 text-red-500'
              >{errors.Repeat_New_Email}</Text>
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
            <View className='w-56 mx-auto mt-10'>
              <TouchableOpacity
                className='bg-blue-500 rounded-md h-14 justify-center'
                onPress={handleSubmit}
              >
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

export default EditEmail;
