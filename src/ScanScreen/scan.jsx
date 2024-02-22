import React, {useEffect, useState} from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  NoCameraPermissionErrorView,
} from 'react-native-vision-camera';
import {Input, Button} from 'react-native-elements';
import {Formik} from 'formik';

import Header from '../header/header';

export function ScanScreen({navigation}) {
  // const {hasPermission, requestPermission} = useCameraPermission();
  const [hasPermission, setHasPermission] = useState(null);
  const [wrongEAN, setWrongEAN] = useState(false);
  const [isActivated, setIsActivated] = useState(true);
  const [codeEAN, setCodeEAN] = useState(null);

  const device = useCameraDevice('back');
  const isFocused = useIsFocused();

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  if (hasPermission === false) {
    return <NoCameraPermissionErrorView/>;
  }

  const getProductByEAN = async (EAN) => {
    try {
      const response = await fetch('http://192.168.1.103:3000/product/getByEan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'EAN': EAN}),
      });
      if (response.status === 200) {
        setWrongEAN(false);
        return true;
      } else if (response.status === 404) {
        setWrongEAN(true);
        return false;
      }
    } catch (error) {
      if (error.message === 404) {
        setWrongEAN(true);
        return false;
      }
    }
  };


  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: async (codes) => {
      setIsActivated(false);
      for (const code of codes) {
        const EAN = code.value;
        setCodeEAN(EAN);
        if (await getProductByEAN(code.value)) {
          setIsActivated(true);
          navigation.navigate(
              'ProductCard',
              {EAN: code.value},
          );
        }
      }
    },
  });

  const handleSubmit = async (values) => {
    const EAN = values.EAN;
    delete values.EAN;
    setCodeEAN(EAN);
    if (await getProductByEAN(EAN)) {
      navigation.navigate(
          'ProductCard',
          {EAN: EAN},
      );
    }
  };


  const tryAgain = () => {
    setWrongEAN(false);
    setIsActivated(true);
  };
  const redirectAddProduct = () => {
    setWrongEAN(false);
    setIsActivated(true);
    navigation.navigate('AddProduct', {EAN: codeEAN});
  };

  const WrongEAN = () => {
    return (
      <View className='absolute h-full w-full flex justify-center'>
        <View className='mx-auto w-72 h-64 bg-white p-3 rounded-md '>
          <Text
            className='text-2xl text-gray-900'>
            Nie znaleziono produktu z tym kodem.</Text>
          <TouchableOpacity
            onPress={() => redirectAddProduct()}
            className='mt-10 bg-blue-500 rounded-md h-14 justify-center'>
            <Text
              className='text-center p-3 text-white font-bold text-lg'>
              Dodaj produkt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => tryAgain()}
            className='mt-3 bg-white rounded-md border-blue-500
            border h-14 justify-center justify-self-end'>
            <Text
              className='text-center p-3 text-blue-500 font-bold text-lg'>
              Spróbuj jeszcze raz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  try {
    return (
      <View style={{flex: 1}}>
        <Header navigation={navigation} />
        <Camera
          style={{flex: 1}}
          device={device}
          isActive={isFocused && isActivated}
          codeScanner={codeScanner}
        />
        <Formik
          initialValues={{EAN: ''}}
          onSubmit={handleSubmit}>
          {({handleChange,
            handleBlur,
            handleSubmit,
            values,
          }) => (
            <View>
              <Input
                onChangeText={handleChange('EAN')}
                onBlur={handleBlur('EAN')}
                value={values.EAN}
                placeholder="Kod EAN"
              />
              <Button
                title={'Wprowadź kod EAN ręcznie'}
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
        {wrongEAN && <WrongEAN/>}
      </View>
    );
  } catch (error) {
    console.log(error);
  }
}
export default ScanScreen;
