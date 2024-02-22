import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';

function Header({navigation}) {
  return (
    <View>
      <View style={{flexDirection: 'row', height: 80}}>
        <TouchableOpacity
          className='bg-blue-400 w-20 justify-center'
          onPress={() => navigation.openDrawer()}>
          <Icon
            type='material'
            name='menu'
            color='#fff'
            size={50}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className='bg-blue-400 flex-1 justify-center'
          onPress={() => navigation.navigate('Scan')}>
          <Icon
            name='line-scan'
            type='material-community'
            color='#fff'
            size={50}
          />
          <Text className='text-center font-bold text-white'>Scan now!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='bg-blue-400 w-20 justify-center'
          onPress={() => navigation.navigate('Profile')}>
          {/* <Icon name='profile' type='antdesign' color='#fff' size={50}/>*/}
          <Text className='text-center text-xl text-white font-bold'>
            Profil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Header;
