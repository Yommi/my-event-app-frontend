import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, Callout, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { EventContext, extra } from '../../EventProvider';
import Constants from 'expo-constants';

export default function App() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { fetchMapData, mapEvents, setSelectedEvent, regionRef, mapLoading, setMapLoading } =
    useContext(EventContext)!;

  // Check if the extra object is available
  if (!extra) {
    throw new Error('API_URL is not defined in extra config.');
  }

  // Get the user's location when the component mounts
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Request permission for location (important for iOS and Android)
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        // Get the user's current location
        const userLocation = await Location.getCurrentPositionAsync({});
        const startRegion = {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        regionRef.current = startRegion;
        fetchMapData();
      } catch (error) {
        console.error(error);
        setError('Failed to fetch location');
      } finally {
        setMapLoading(false);
      }
    };

    getLocation();
  }, []);

  const handleRegionChangeComplete = (newRegion: any) => {
    regionRef.current = newRegion;
  };

  const handleCalloutPress = (event: any): void => {
    setSelectedEvent(event);
    router.push('/(tabs)/(find)/EventPage');
  };

  if (mapLoading) {
    return <ActivityIndicator size="large" color="white" className="m-auto" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsMyLocationButton={true}
        showsCompass={true}
        showsUserLocation={true}
        region={regionRef.current}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {mapEvents.map((event, index) => (
          <Marker
            key={index}
            coordinate={{
              longitude: event.location.coordinates[0],
              latitude: event.location.coordinates[1],
            }}
          >
            <Callout
              tooltip
              onPress={() => {
                handleCalloutPress(event);
              }}
            >
              <TouchableWithoutFeedback>
                <View className={styles.eventCont}>
                  <ImageBackground
                    source={{
                      uri: `${extra.API_URL}/images/${event.displayCover}`,
                    }}
                    style={{ height: height * 0.2, width: width * 0.9, overflow: 'hidden' }}
                    resizeMode="cover"
                  />
                  <View className={styles.eventInfoCont}>
                    <Text className={styles.eventName}>
                      <Text className={styles.eventInfoType}>Name: </Text>
                      {event.name}
                    </Text>
                    <Text className={styles.eventAddress}>
                      <Text className={styles.eventInfoType}>Address: </Text>
                      {event.location.address}
                    </Text>
                    <Text className={styles.eventDate}>
                      <Text className={styles.eventInfoType}>Date: </Text>
                      {new Date(event.date).toLocaleDateString()}
                    </Text>
                    <Text className={styles.eventTime}>
                      <Text className={styles.eventInfoType}>Time: </Text>
                      {event.startTime}
                    </Text>
                    <Text className={styles.eventDistance}>
                      <Text className={styles.eventInfoType}>Distance: </Text>
                      {Math.round(event.distance / 1000)} Km
                    </Text>
                    <Text className={styles.eventBy}>
                      <Text className={styles.eventInfoType}>By: </Text>@
                      {event.hostDetails.username}
                    </Text>
                  </View>
                  <View className={'pl-2 flex-row justify-between'}>
                    <View className={'h-12 bg-green-500 rounded-full mt-4 mr-4'}>
                      <Text className={'text-white font-bold text-xl my-auto mx-6'}>
                        {event.currency ? event.currency.toUpperCase() : ''}{' '}
                        {event.price ? event.price.toFixed(2) : 'Free'}
                      </Text>
                    </View>
                    {event.private ? (
                      <View
                        className={'flex-row h-12 bg-black rounded-full mt-4 flex-end mr-4 px-6'}
                      >
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
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {
  eventCont: 'mt-8 mx-auto bg-[#191827] rounded-2xl w-full pb-6',
  eventInfoCont: 'mt-4 p-2',
  eventInfoType: 'font-bold text-xl text-yellow-300',
  eventName: 'text-white font-bold text-xl',
  eventAddress: 'text-white mt-2',
  eventDate: 'text-white mt-2',
  eventTime: 'text-white mt-2',
  eventDistance: 'text-white mt-2',
  eventBy: 'text-gray-500 mt-2',
};
