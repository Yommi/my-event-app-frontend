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
import Icon from 'react-native-vector-icons/FontAwesome';
import { MyEventsContext, MyEventsType } from '../../../MyEventsProvider';
import { EventContext } from '../../../EventProvider';
import { extra } from '../../../EventProvider';

export default function CreatedList() {
  const router = useRouter();
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const { setSelectedEvent } = useContext(EventContext)!;

  const {
    createdEvents,
    loadingCreated,
    fetchMoreCreated,
    isFetchingMoreCreated,
    createdRefreshLoading,
    refreshCreated,
    createdErrorMessage,
  } = useContext(MyEventsContext)!;

  if (!extra) {
    throw new Error('API_URL is not defined in extra config.');
  }

  const handleEventPress = (event: MyEventsType): void => {
    setSelectedEvent(event);
    router.push('/(tabs)/(myEvents)/MyEventPage');
  };

  const renderItem = ({ item }: { item: MyEventsType }) => (
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

  if (loadingCreated && !createdRefreshLoading) {
    return (
      <ActivityIndicator className={'m-auto'} size="large" color="white" />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ref={ref}
        data={createdEvents}
        renderItem={({ item, index }) => {
          return renderItem({ item });
        }}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={createdRefreshLoading}
            onRefresh={refreshCreated}
          />
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0) return;
          fetchMoreCreated();
        }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={
          isFetchingMoreCreated ? (
            <View className="flex-1 mt-4 justify-center items-center">
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          createdErrorMessage ? (
            <View
              className={`flex-1 justify-center items-center`}
              style={{ height: height * 0.7 }}
            >
              <Text className={'text-white'}>{createdErrorMessage}</Text>
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
  eventGroupCont: 'mt-3 mb-2',
  eventGroupTitle: 'text-white text-lg font-bold mx-auto mb-1',
  eventGroupLine: 'w-full h-[0.5] bg-gray-500',
  eventCont:
    'flex justify-between mt-8 mx-auto bg-[#191827] rounded-3xl w-[95%] pb-6',
  eventInfoCont: 'mt-4 p-2',
  eventInfoType: 'font-bold text-xl text-yellow-300',
  eventName: 'text-white font-bold text-xl',
  eventAddress: 'text-white mt-2',
  eventDate: 'text-white mt-2',
  eventTime: 'text-white mt-2',
  eventDistance: 'text-white mt-2',
  eventBy: 'text-gray-500 mt-2',
};
