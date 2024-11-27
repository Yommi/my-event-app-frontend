import React, { useState, useContext } from 'react';
import { TextInput, View, ImageBackground, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from 'expo-constants';
import axios from 'axios';
import { EventContext } from './EventProvider';

export default function LogoAndSearchBar() {
  const { fetchData, searchText, setSearchText } = useContext(EventContext)!;

  const handleSearch = (text: string) => {
    setSearchText(text);
    // Place the search logic here
    fetchData(text);
  };

  interface ExtraConfig {
    API_URL: string;
  }

  // Extract the extra config using type assertion
  const extra = Constants.expoConfig?.extra as ExtraConfig;

  // Check if the extra object is available
  if (!extra) {
    throw new Error('API_URL is not defined in extra config.');
  }

  return (
    <View className={styles.logoSearchCont}>
      <ImageBackground
        source={{ uri: `${extra.API_URL}/images/logo.jpg` }} //Placeholder logo
        resizeMode="cover"
        className={styles.logo}
      ></ImageBackground>
      <View className={styles.emptySpace}></View>
      <View className={styles.searchContainer}>
        <Icon name="search" size={20} color="#ccc" className={styles.searchIcon} />
        <TextInput
          className={' text-white w-full h-full '}
          placeholder="Search..."
          placeholderTextColor="#ccc"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = {
  logoSearchCont: 'w-full flex-row justify-between pb-4',
  logo: 'flex-[1.5]',
  emptySpace: 'flex-[1]',
  searchContainer: 'flex-[7.5] flex-row items-center h-12 rounded-full px-3 bg-[#191827]',
  searchIcon: 'mr-4',
};
