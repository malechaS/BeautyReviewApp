import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import Header from '../header/header';

const ProfileView = ({navigation, route}) => {
  const {reviews} = route.params;

  const redirectToProduct = async (productID) => {
    try {
      const response = await fetch('http://192.168.1.103:3000/product/getById', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'ID': productID}),
      });
      if (!response.ok) {
        throw new Error(response.status);
      }
      const json = await response.json();
      const EAN = json['data'][0]['EAN'];
      navigation.navigate('ProductCard', {EAN: EAN});
    } catch (error) {
      console.log('Błąd', error.message);
    }
  };

  const deleteReview = async (reviewID) => {
    try {
      const response = await fetch('http://192.168.1.103:3000/review/deleteReview', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'Review_ID': reviewID}),
      });
      if (!response.ok) {
        throw new Error('Spróbuj ponownie później');
      }
      Alert.alert('Sukces', 'Usunięta recenzja');
    } catch (error) {
      Alert.alert('Błąd', error.message);
    }
  };

  const ListOfReviews = () => {
    return (
      reviews.map((review, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => redirectToProduct(review.Product_ID)}>
          <ListItem key={i} bottomDivider>
            <Icon name="comment" type="material" />
            <ListItem.Content>
              <ListItem.Title>{review.Brand}</ListItem.Title>
              <ListItem.Subtitle>{review.Content}</ListItem.Subtitle>
            </ListItem.Content>

            <TouchableOpacity onPress={() => deleteReview(review.ID)}>
              <Icon name='delete'/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditReview', {
                review: review,
              })}>
              <Icon name='edit'/>
            </TouchableOpacity>

          </ListItem>
        </TouchableOpacity>
      ))
    );
  };

  return (
    <ScrollView className='bg-white flex-1'>
      <Header navigation={navigation} />
      <Text
        className='mt-10 mb-8 text-gray-900 text-center text-4xl opacity-60'
      >Moje recenzje</Text>
      <View>
        {reviews !== undefined ? <ListOfReviews/> :
          <View className='flex flex-row mx-auto'>
            <Text
              className='text-lg text-gray-900 space-x-0'
            >Brak recenzji, </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Scan')}>
              <Text
                className='text-lg text-blue-400 font-bold'
              >zrecenzuj coś!</Text>
            </TouchableOpacity>
          </View>

        }

      </View>
    </ScrollView>
  );
};

export default ProfileView;
