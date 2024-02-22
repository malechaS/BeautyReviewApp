import React, {useState} from 'react';
import {View, TextInput, Text, Alert, TouchableOpacity} from 'react-native';
import {Rating} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Header from '../header/header';

const validationSchema = Yup.object().shape({
  Content: Yup.string()
      .required('Wymagane')
      .min(3, 'Opinia musi mieć co najmniej 3 znaki.')
      .max(250, 'Opinia musi mieć maksymalnie 250 znaków.'),
});

const EditReview = ({navigation, route}) => {
  const {review} = route.params;
  const [ratingScore, setRatingScore] = useState(null);

  const editReview = async (values) => {
    try {
      const response = await fetch('http://192.168.1.103:3000/review/editReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'Review_ID': review.ID,
          'Rating': ratingScore,
          'Content': values.Content,
        }),
      });
      if (response.status === 401) {
        throw new Error('Brak dostępu. Zaloguj się.');
      } else if (!response.ok) {
        throw new Error('Spróbuj ponownie później');
      }
      Alert.alert('Sukces', 'Pomyślnie zmieniono opinię');
      delete values.Content;
      setRatingScore(null);
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
      >Edycja opinii</Text>
      <Formik
        initialValues={{Content: ''}}
        onSubmit={editReview}
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
              onChangeText={handleChange('Content')}
              onBlur={handleBlur('Content')}
              value={values.Content}
              placeholder="Wpisz recenzję"
              placeholderTextColor={'#000'}
            />
            {touched.Content && errors.Content && (
              <Text>{errors.Content}</Text>
            )}
            <Rating
              type={'heart'}
              startingValue={review.Rating}
              onFinishRating={(num) => setRatingScore(num)}
            />

            <View className='w-56 mx-auto mt-10'>
              <TouchableOpacity
                className='bg-blue-500 rounded-md h-14 justify-center'
                onPress={handleSubmit}
              >
                <Text
                  className='text-center p-3 text-white font-bold text-lg'
                >Wystaw opinię</Text>
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
export default EditReview;
