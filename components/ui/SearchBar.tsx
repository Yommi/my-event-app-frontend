import React, { useContext } from 'react';
import { Text, TextInput, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { EventContext } from '../../app/EventProvider';

interface Props {
  activeTab: 'card' | 'map';
}
export default function SearchBar() {
  const { fetchListData, searchText, setSearchText, pageRef } =
    useContext(EventContext)!;

  const handleSearch = (text: string) => {
    pageRef.current = 1;
    setSearchText(text);
    fetchListData(text);
  };

  return (
    <View className={styles.logoSearchCont}>
      <View
        style={{ width: width * 0.9 }}
        className={styles.searchContainer}
      >
        <Icon
          name="search"
          size={20}
          color="#ccc"
          className={styles.searchIcon}
        />
        <TextInput
          className={' text-white w-full h-full '}
          placeholder="Type to search..."
          placeholderTextColor={'gray'}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
  //  : (
  //   <View className="w-full flex justify-center pb-6 h-14">
  //     <Text className="text-white text-center font-bold text-3xl">
  //       Evently
  //     </Text>
  //   </View>
  // );
}

const { width, height } = Dimensions.get('window');

const styles = {
  logoSearchCont: 'w-full flex-row justify-between pb-6',
  searchContainer:
    'flex-row items-center h-12 rounded-full px-3 bg-[#191827] m-auto px-6',
  searchIcon: 'mr-4',
};
