import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, ImageBackground, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
const eventCover = require('../../../assets/images/default.jpg');

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
    // Add other properties of your data here if necessary, e.g., date, location, etc.
  }

  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://192.168.1.226:5000/api/v1/events/nearby?lat=-84.82550970170777&lng=33.9363830311417'
        );
        setData(response.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle loading state
  if (loading) {
    return <ActivityIndicator className={'m-auto'} size="large" color="white" />;
  }

  // Handle error state
  //   if (error) {
  //     return <Text>Error: {error.message}</Text>;
  //   }

  return (
    <ScrollView className={'flex-grow '} contentContainerStyle={{ paddingBottom: 20 }}>
      <View className={styles.eventGroupCont}>
        <Text className={styles.eventGroupTitle}>
          Nearby <Text className={'italic font-normal'}>(Within 10Km)</Text>{' '}
        </Text>
        <View className={styles.eventGroupLine}></View>
      </View>
      {data.map((item, index) => (
        <View key={index} className={styles.eventCont}>
          <ImageBackground
            source={eventCover}
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
            <View className={'h-12 bg-green-500 rounded-3xl mt-4 mr-4'}>
              <Text className={'text-white font-bold text-xl my-auto mx-6'}>
                {' '}
                ${item.price ? item.price : 'Free'}
              </Text>
            </View>
            {item.private ? (
              <View className={' flex-row h-12 bg-black rounded-3xl mt-4 flex-end mr-4 px-6'}>
                <Icon name="lock" size={20} color="#ffff" className={'my-auto mr-2'} />
                <Text className={'text-white font-bold text-xl my-auto'}>Private</Text>
              </View>
            ) : (
              <View className={'h-12 bg-black rounded-3xl mt-4 flex-end mr-4'}>
                <Text className={'text-white font-bold text-xl my-auto mx-6'}>Public</Text>
              </View>
            )}
          </View>
        </View>
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
