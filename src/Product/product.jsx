import React, {useState} from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';

import Header from '../header/header';
import {Rating, Image, ListItem, Icon} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';


function ProductCard({navigation, route}) {
  // const {product} = route.params;
  const {EAN} = route.params;
  const [reviews, setReviews] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [product, setProduct] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [deleteConfView, setDeleteConfView] = useState(false);
  const [deleteReviewID, setDeleteReviewID] = useState(null);
  const permission = useSelector((state) => state.perm.permission);

  const isFocused = useIsFocused();

  const getReviewsByProduct = async (productID) => {
    try {
      const response = await fetch('http://192.168.1.103:3000/review/getReviewByProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'Product_ID': productID}),
      });
      if (!response.ok) {
        throw new Error('Spróbuj ponownie później');
      }
      const json = await response.json();
      const reviews = json['data'];
      setReviews(reviews);
    } catch (error) {
      Alert.alert('Błąd', error.message);
    }
  };

  const getProductByEAN = async (EAN) => {
    try {
      const response = await fetch('http://192.168.1.103:3000/product/getByEan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'EAN': EAN}),
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error('Spróbuj ponownie później');
      }
      const json = await response.json();
      const product = json['data'][0];
      setProduct(product);
    } catch (error) {
      Alert.alert('Błąd', error.message);
    }
  };

  const deleteReviewById = async (reviewID) => {
    try {
      const response = await fetch('http://192.168.1.103:3000/moderator/deleteReview', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'Review_ID': reviewID}),
      });
      if (!response.ok) {
        throw new Error('Spróbuj ponownie później');
      }
      await getReviewsByProduct(product['ID']);
      Alert.alert('Sukces', 'Usunięta recenzja');
    } catch (error) {
      Alert.alert('Błąd', error.message);
    }
  };

  if (isFocused && isActive) {
    getProductByEAN(EAN);
    setIsActive(false);
  } else if (!isFocused && !isActive) {
    setIsActive(true);
  }

  const redirectAddReview = (productId) => {
    navigation.navigate('AddReview', {productId: productId});
  };

  const expandReviews = async () => {
    await getReviewsByProduct(product['ID']);
    setExpanded(!expanded);
  };

  const ListOfReviews = () => {
    return (
      reviews.map((review, i) => (
        <ListItem key={i} bottomDivider>
          <Icon name="comment" type="material" />
          <ListItem.Content>
            <ListItem.Title>{review.First_Name}</ListItem.Title>
            <ListItem.Subtitle>{review.Content}</ListItem.Subtitle>
          </ListItem.Content>
          {(permission === 'mod' || permission === 'admin' ) &&
              <TouchableOpacity onPress={() => {
                setDeleteReviewID(review.Review_ID);
                setDeleteConfView(true);
              }}>
                <Icon name='delete'/>
              </TouchableOpacity>
          }
        </ListItem>
      ))
    );
  };

  const DeleteConfirmation = () => {
    return (
      <View className='absolute h-full w-full flex justify-center'>
        <View className='mx-auto w-72 h-64 bg-white p-3 rounded-md '>
          <Text
            className='text-2xl text-gray-900'
          >Czy na pewno chcesz usunąć produkt?</Text>
          <TouchableOpacity
            onPress={() => deleteReviewById(deleteReviewID)}
            className='mt-10 bg-blue-500 rounded-md h-14 justify-center'>
            <Text
              className='text-center p-3 text-white font-bold text-lg'
            >Tak</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteConfView(false)}
            className='mt-3 bg-white rounded-md border-blue-500
            border h-14 justify-center justify-self-end'>
            <Text
              className='text-center p-3 text-blue-500 font-bold text-lg'
            >Nie</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (product != null) {
    const productId = product['ID'];
    const brand = product['Brand'];
    const brandSeries = product['Brand_series'];
    const name = product['Name'];
    const ratingCount = product['Rating_Count'];
    const ratingAverange = parseFloat(product['Average_Rating']);

    if (isFocused && isActive) {
      getReviewsByProduct(product['ID']);
      setIsActive(false);
    } else if (!isFocused && !isActive) {
      setIsActive(true);
    }

    return (
      <View className='bg-white flex-1'>
        <Header navigation={navigation} />
        <ScrollView className='flex-1'>
          <View className='mx-auto my-12'>
            <Image
              // source={{uri: 'https://pro-fra-s3-productsassets.rossmann.pl/product_1_medium/402181_360_350_1703672602.png'}}
              source={require('./../../image/minimalistic_cosmetics.jpg')}
              className='mx-auto h-80 w-80'
            />
          </View>

          <Text className='mx-5 text-3xl text-gray-900'>
            {brand} {brandSeries}
          </Text>
          <Text className='mx-5 mt-3 text-md text-gray-900'>{name}</Text>
          <View className='flex-1 flex-row mx-5 mt-3 mb-10'>
            <Rating
              type={'heart'}
              fractions={1}
              minValue={1}
              imageSize={30}
              startingValue={ratingAverange}
              readonly
            />
            <Text
              className='text-lg ml-3 font-bold text-red-500'>
              {ratingAverange}/5 ({ratingCount} ocen)</Text>
          </View>

          <View className='w-56 mx-auto mt-10'>
            <TouchableOpacity
              className='bg-blue-500 rounded-md h-14 justify-center'
              onPress={() => redirectAddReview(productId)}
            >
              <TextA
                className='text-center p-3 text-white font-bold text-lg'
              >Dodaj recenzję</TextA>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className='flex flex-row justify-between mx-5 mt-3 h-10 '
            onPress={() => expandReviews()}>
            <Text className='text-2xl text-gray-950'>Recenzje</Text>
            <Icon className='w-10 h-10 center p-1' name='expand-more'></Icon>
          </TouchableOpacity>

          {expanded && (<ListOfReviews/>)}
        </ScrollView>
        {deleteConfView && <DeleteConfirmation/>}
      </View>
    );
  } else {
    return (
      <View
        className='flex-1 justify-center content-center
          block w-full h-full absolute bg-gray-800 opacity-50'>
        <ActivityIndicator size='large'/>
      </View>
    );
  }
}

export default ProductCard;
