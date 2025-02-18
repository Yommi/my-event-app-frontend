import React, { useContext } from 'react';
import { useRouter } from 'expo-router';
import { useScrollToTop } from '@react-navigation/native';
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
import { EventContext, Event, extra } from '../../EventProvider';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EventList() {
  const router = useRouter();
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const {
    events,
    loading,
    refreshLoading,
    fetchMoreEvents,
    error,
    refreshData,
    setSelectedEvent,
    isFetchingMore,
  } = useContext(EventContext)!;

  // Handle loading state
  if (loading && !refreshLoading) {
    return (
      <ActivityIndicator className={'m-auto'} size="large" color="white" />
    );
  }

  // Check if the extra object is available
  if (!extra) {
    throw new Error('API_URL is not defined in extra config.');
  }

  const handleEventPress = (event: Event): void => {
    setSelectedEvent(event);
    router.push('/(tabs)/(find)/EventPage');
  };

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableWithoutFeedback onPress={() => handleEventPress(item)}>
      <View className={styles.eventCont}>
        <ImageBackground
          source={{ uri: `${extra.API_URL}/images/${item.displayCover}` }}
          resizeMode="cover"
          style={{ height: height * 0.2 }}
        />
        <View className={styles.eventInfoCont}>
          <Text className={styles.eventName}>
            <Text className={styles.eventInfoType}>Name: </Text>
            {item.name}
          </Text>
          <Text className={styles.eventAddress}>
            <Text className={styles.eventInfoType}>Address: </Text>
            {item.location.address}
          </Text>
          <Text className={styles.eventDate}>
            <Text className={styles.eventInfoType}>Date: </Text>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text className={styles.eventTime}>
            <Text className={styles.eventInfoType}>Time: </Text>
            {item.startTime}
          </Text>
          {item.distance ? (
            <Text className={styles.eventDistance}>
              <Text className={styles.eventInfoType}>Distance: </Text>
              {Math.round(item.distance / 1000)} Km
            </Text>
          ) : null}
          <Text className={styles.eventBy}>
            <Text className={styles.eventInfoType}>By: </Text>@
            {item.hostDetails.username}
          </Text>
        </View>
        <View className={'pl-2 flex-row justify-between'}>
          <View className={'h-12 bg-green-500 rounded-full mt-4 mr-4'}>
            <Text className={'text-white font-bold text-xl my-auto mx-6'}>
              {item.currency ? item.currency.toUpperCase() : ''}{' '}
              {item.price
                ? item.price.toFixed(2).toLocaleString()
                : 'Free'}
            </Text>
          </View>
          {item.private ? (
            <View
              className={
                'flex-row h-12 bg-black rounded-full mt-4 flex-end mr-4 px-6'
              }
            >
              <Icon
                name="lock"
                size={20}
                color="#ffff"
                className={'my-auto mr-2'}
              />
              <Text className={'text-white font-bold text-xl my-auto'}>
                Private
              </Text>
            </View>
          ) : (
            <View
              className={'h-12 bg-black rounded-full mt-4 flex-end mr-4'}
            >
              <Text
                className={'text-white font-bold text-xl my-auto mx-6'}
              >
                Public
              </Text>
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
        renderItem={({ item, index }) => {
          return renderItem({ item });
        }}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoading}
            onRefresh={refreshData}
          />
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0) return;
          fetchMoreEvents();
        }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={
          isFetchingMore ? (
            <View className="flex-1 mt-4 justify-center items-center">
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          error ? (
            <View
              className={`flex-1 justify-center items-center`}
              style={{ height: height * 0.7 }}
            >
              <Text className={'text-white'}>
                Failed to load events, Please refresh!
              </Text>
            </View>
          ) : (
            <View
              className={`flex-1 justify-center items-center`}
              style={{ height: height * 0.7 }}
            >
              <Text className={'text-white'}>No Events Found 🥲</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {
  eventCont:
    'flex justify-between my-4 mx-auto bg-[#191827] rounded-3xl w-[95%] pb-6',
  eventInfoCont: 'mt-4 p-2',
  eventInfoType: 'font-bold text-xl text-yellow-300',
  eventName: 'text-white font-bold text-xl',
  eventAddress: 'text-white mt-2',
  eventDate: 'text-white mt-2',
  eventTime: 'text-white mt-2',
  eventDistance: 'text-white mt-2',
  eventBy: 'text-gray-500 mt-2',
};
