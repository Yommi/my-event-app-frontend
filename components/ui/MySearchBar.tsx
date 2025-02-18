import React, { useContext, useEffect } from 'react';
import { TextInput, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MyEventsContext } from '../../app/MyEventsProvider';

export default function MySearchBar({ currentTab }: any) {
  const {
    fetchCreated,
    mySearchText,
    setMySearchText,
    createdPageRef,
    regPageRef,
    fetchRegList,
  } = useContext(MyEventsContext)!;

  const handleSearch = (text: string) => {
    setMySearchText(text);
    if (currentTab.current === 'CreatedList') {
      createdPageRef.current = 1;
      fetchCreated(text);
    } else {
      regPageRef.current = 1;
      fetchRegList(text);
    }
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
          value={mySearchText}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = {
  logoSearchCont: 'w-full flex-row justify-between pb-6',
  searchContainer:
    'flex-row items-center h-12 rounded-full px-3 bg-[#191827] m-auto px-6',
  searchIcon: 'mr-4',
};
