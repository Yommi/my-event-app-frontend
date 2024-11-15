import React, { useContext } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { EventContext } from './EventProvider';

export default function EventList() {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const { events, loading, error, refreshData } = useContext(EventContext)!;

  // Handle loading state
  if (loading) {
    return <ActivityIndicator className={'m-auto'} size="large" color="white" />;
  }

  // Handle error state
  if (error) {
    return (
      <View className={'flex-1 justify-center items-center'}>
        <Text className={'text-white'}>Failed to load page. Please refresh!</Text>
      </View>
    );
  }

  interface Event {
    name: string; // Ensure this property exists
    location: {
      address: string;
    };
    date: string;
    price: number;
    currency: string;
    startTime: string;
    private: boolean;
    displayCover: string;
    host: {
      username: string;
    };
  }

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableWithoutFeedback>
      <View className={styles.eventCont}>
        <ImageBackground
          source={{ uri: `http://192.168.1.226:5000/api/v1/images/${item.displayCover}` }}
          className={styles.eventCover}
          resizeMode="cover"
          style={{ height: height * 0.2 }}
        />
        <View className={styles.eventInfoCont}>
          <Text className={styles.eventName}>
            <Text className={styles.eventInfoType}>Name:</Text> {item.name}
          </Text>
          <Text className={styles.eventAddress}>
            <Text className={styles.eventInfoType}>Address:</Text> {item.location.address}
          </Text>
          <Text className={styles.eventDate}>
            <Text className={styles.eventInfoType}>Date:</Text>{' '}
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text className={styles.eventTime}>
            <Text className={styles.eventInfoType}>Time:</Text> {item.startTime}
          </Text>
          <Text className={styles.eventBy}>
            <Text className={styles.eventInfoType}>By:</Text> @{item.host.username}
          </Text>
        </View>
        <View className={'pl-2 flex-row justify-between'}>
          <View className={'h-12 bg-green-500 rounded-full mt-4 mr-4'}>
            <Text className={'text-white font-bold text-xl my-auto mx-6'}>
              {item.currency ? item.currency.toUpperCase() : ''}{' '}
              {item.price ? item.price.toFixed(2) : 'Free'}
            </Text>
          </View>
          {item.private ? (
            <View className={'flex-row h-12 bg-black rounded-full mt-4 flex-end mr-4 px-6'}>
              <Icon name="lock" size={20} color="#ffff" className={'my-auto mr-2'} />
              <Text className={'text-white font-bold text-xl my-auto'}>Private</Text>
            </View>
          ) : (
            <View className={'h-12 bg-black rounded-full mt-4 flex-end mr-4'}>
              <Text className={'text-white font-bold text-xl my-auto mx-6'}>Public</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ref={ref}
        data={events}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshData} />}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {
  // eventGroupCont: 'mt-2',
  // eventGroupTitle: 'text-white text-lg font-bold mx-auto mb-1',
  // eventGroupLine: 'w-full h-[1%] bg-gray-500',
  eventCont: 'flex justify-between mt-8 mx-auto bg-[#191827] rounded-2xl w-[95%] pb-6',
  eventCover: 'rounded-2xl flex-1 justify-center items-center',
  eventInfoCont: 'mt-4 p-2',
  eventInfoType: 'font-bold text-xl text-yellow-200',
  eventName: 'text-white font-bold text-xl',
  eventAddress: 'text-white mt-2',
  eventDate: 'text-white mt-2',
  eventTime: 'text-white mt-2',
  eventBy: 'text-gray-500 mt-2',
};
