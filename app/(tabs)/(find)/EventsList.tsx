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
import Constants from 'expo-constants';

export default function EventList() {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const { nearbyEvents, outsideEvents, loading, refreshLoading, error, refreshData } =
    useContext(EventContext)!;

  // Handle loading state
  if (loading) {
    return <ActivityIndicator className={'m-auto'} size="large" color="white" />;
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
    hostDetails: {
      username: string;
    };
  }

  interface ExtraConfig {
    API_URL: string;
  }

  // Extract the extra config using type assertion
  const extra = Constants.expoConfig?.extra as ExtraConfig;

  // Check if the extra object is available
  if (!extra) {
    throw new Error('API_URL is not defined in extra config.');
  }

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableWithoutFeedback>
      <View className={styles.eventCont}>
        <ImageBackground
          source={{ uri: `${extra.API_URL}/images/${item.displayCover}` }}
          // className={styles.eventCover}
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
            <Text className={styles.eventInfoType}>By:</Text> @{item.hostDetails.username}
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
        data={[...nearbyEvents, ...outsideEvents]}
        renderItem={({ item, index }) => {
          if (index === 0 && nearbyEvents.length > 0) {
            return (
              <>
                <View className={styles.eventGroupCont}>
                  <Text className={styles.eventGroupTitle}>Nearby Events (Within 10km)</Text>
                  <View className={styles.eventGroupLine}></View>
                </View>
                {renderItem({ item })}
              </>
            );
          }
          if (index === nearbyEvents.length && outsideEvents.length > 0) {
            return (
              <>
                <View className={styles.eventGroupCont}>
                  <Text className={styles.eventGroupTitle}>Events outside 10km radius</Text>
                  <View className={styles.eventGroupLine}></View>
                </View>
                {renderItem({ item })}
              </>
            );
          }
          return renderItem({ item });
        }}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshLoading} onRefresh={refreshData} />}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          error ? (
            <View className={`flex-1 justify-center items-center`} style={{ height: height * 0.7 }}>
              <Text className={'text-white'}>Failed to load events, Please refresh!</Text>
            </View>
          ) : (
            <View className={`flex-1 justify-center items-center`} style={{ height: height * 0.7 }}>
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
  eventCont: 'flex justify-between mt-8 mx-auto bg-[#191827] rounded-2xl w-[95%] pb-6',
  eventInfoCont: 'mt-4 p-2',
  eventInfoType: 'font-bold text-xl text-yellow-200',
  eventName: 'text-white font-bold text-xl',
  eventAddress: 'text-white mt-2',
  eventDate: 'text-white mt-2',
  eventTime: 'text-white mt-2',
  eventBy: 'text-gray-500 mt-2',
};
