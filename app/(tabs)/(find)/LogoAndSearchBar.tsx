import React, { useState } from 'react';
import { Text, TextInput, View, ImageBackground, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LogoAndSearchBar() {
  const { width, height } = Dimensions.get('window');
  const [searchText, setSearchText] = useState<string>('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    // Place the search logic here
    console.log('Searching for:', text);
  };

  return (
    <View className={styles.logoSearchCont}>
      <ImageBackground
        source={{ uri: `http://192.168.1.226:5000/api/v1/images/logo.jpg` }} //Placeholder logo
        resizeMode="cover"
        className={styles.logo}
      ></ImageBackground>
      <View className={styles.emptySpace}></View>
      <View className={styles.searchContainer}>
        <Icon name="search" size={20} color="#ccc" className={styles.searchIcon} />
        <TextInput
          className={' text-white '}
          placeholder="Search here..."
          placeholderTextColor="#ccc"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
}

const styles = {
  logoSearchCont: 'w-full flex-row justify-between pb-4',
  logo: 'flex-[1.5]',
  emptySpace: 'flex-[1]',
  searchContainer: 'flex-[7.5] flex-row items-center h-12 rounded-full px-3 bg-[#191827]',
  searchIcon: 'mr-4',
};
