import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
  RefreshControl,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';

export default function EventList() {
  interface Event {
    name: string;
    location: {
      address: string;
    };
    date: string;
    price: number;
    startTime: string;
    private: boolean;
    displayCover: string;
  }

  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animations, setAnimations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      // GET REQUEST
      const response = await axios.get(
        'http://192.168.1.226:5000/api/v1/events/nearby?lat=-84.82550970170777&lng=33.9363830311417'
      );
      setData(response.data.data);

      //ANIMATION
      const initialAnimations = response.data.data.map(() => new Animated.Value(1));
      setAnimations(initialAnimations);
    } catch (err) {
      setError(true);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Refresh data
    setRefreshing(false);
  };

  // Handle loading state
  if (loading) {
    return <ActivityIndicator className={'m-auto'} size="large" color="white" />;
  }

  const handlePressIn = (index: number) => {
    Animated.spring(animations[index], {
      toValue: 0.9, // Shrink slightly
      useNativeDriver: true,
    }).start();
    console.log('pressed');
  };

  const handlePressOut = (index: number) => {
    Animated.spring(animations[index], {
      toValue: 1, // Return to original size
      useNativeDriver: true,
    }).start();
  };

  // Handle error state
  if (error) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff0000', '#00ff00', '#0000ff']} // Customize refresh spinner colors
          />
        }
      >
        <Text className={'flex, align-center, justify-center my-auto, text-white'}>
          Failed to load page. Please refresh!
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#ff0000', '#00ff00', '#0000ff']} // Customize refresh spinner colors
        />
      }
      className={'flex-grow '}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className={styles.eventGroupCont}>
        <Text className={styles.eventGroupTitle}>
          Nearby <Text className={'italic font-normal'}>(Within 10Km)</Text>{' '}
        </Text>
        <View className={styles.eventGroupLine}></View>
      </View>
      {data.map((item, index) => (
        <TouchableWithoutFeedback
          key={index}
          onPressIn={() => handlePressIn(index)}
          onPressOut={() => handlePressOut(index)}
          delayPressIn={100} // Delay before the press action is recognized
          delayPressOut={100}
        >
          <Animated.View
            className={styles.eventCont}
            style={[{ transform: [{ scale: animations[index] }] }]}
          >
            <ImageBackground
              source={{ uri: `http://192.168.1.226:5000/api/v1/images/${item.displayCover}` }}
              className={styles.eventCover}
              resizeMode="cover"
              style={{ height: height * 0.2 }}
            ></ImageBackground>
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
            </View>
            <View className={' pl-2 flex-row justify-between'}>
              <View className={'h-12 bg-green-500 rounded-full mt-4 mr-4'}>
                <Text className={'text-white font-bold text-xl my-auto mx-6'}>
                  ${item.price ? item.price.toFixed(2) : 'Free'}
                </Text>
              </View>
              {item.private ? (
                <View className={' flex-row h-12 bg-black rounded-full mt-4 flex-end mr-4 px-6'}>
                  <Icon name="lock" size={20} color="#ffff" className={'my-auto mr-2'} />
                  <Text className={'text-white font-bold text-xl my-auto'}>Private</Text>
                </View>
              ) : (
                <View className={'h-12 bg-black rounded-full mt-4 flex-end mr-4'}>
                  <Text className={'text-white font-bold text-xl my-auto mx-6'}>Public</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      ))}
    </ScrollView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {
  eventGroupCont: 'mt-2',
  eventGroupTitle: 'text-white text-lg font-bold mx-auto mb-1',
  eventGroupLine: 'w-full h-[1%] bg-gray-500',
  eventCont: ' flex justify-between mt-8 mx-2 bg-[#191827] rounded-2xl w-[95%] pb-6',
  eventCover: 'rounded-2xl flex-1 justify-center items-center',
  eventInfoCont: 'mt-4 p-2',
  eventInfoType: 'font-bold text-xl text-yellow-200',
  eventName: 'text-white font-bold text-xl',
  eventAddress: 'text-white mt-2',
  eventDate: 'text-white mt-2',
  eventTime: 'text-white mt-2',
};
