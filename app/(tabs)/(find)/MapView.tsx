import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { EventContext } from './EventProvider';
import Constants from 'expo-constants';

export default function App() {
  const [location, setLocation] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { nearbyEvents, outsideEvents } = useContext(EventContext)!;
  const events = [...nearbyEvents, ...outsideEvents];

  interface ExtraConfig {
    API_URL: string;
  }

  // Extract the extra config using type assertion
  const extra = Constants.expoConfig?.extra as ExtraConfig;

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
        setLocation(userLocation.coords);
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 10 },
          (newLocation) => {
            setLocation(newLocation.coords);
            setRegion((prevRegion: typeof region | null) => ({
              ...prevRegion,
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            }));
          },
        );
      } catch (error) {
        console.error(error);
        setError('Failed to fetch location');
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  // If the location is still loading, show a loading spinner
  if (loading) {
    return <ActivityIndicator size="large" color="white" className={'m-auto'} />;
  }

  // Only render the MapView once the location is available
  if (!location) {
    return <ActivityIndicator size="large" color="white" className={'m-auto'} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsMyLocationButton={true}
        showsCompass={true}
        showsUserLocation={true}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {events.map((event, index) => (
          <Marker
            key={index}
            coordinate={{
              longitude: event.location.coordinates[0],
              latitude: event.location.coordinates[1],
            }}
          >
            <Callout tooltip>
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
                      <Text className={styles.eventInfoType}>Name:</Text> {event.name}
                    </Text>
                    <Text className={styles.eventAddress}>
                      <Text className={styles.eventInfoType}>Address:</Text>{' '}
                      {event.location.address}
                    </Text>
                    <Text className={styles.eventDate}>
                      <Text className={styles.eventInfoType}>Date:</Text>{' '}
                      {new Date(event.date).toLocaleDateString()}
                    </Text>
                    <Text className={styles.eventTime}>
                      <Text className={styles.eventInfoType}>Time:</Text> {event.startTime}
                    </Text>
                    <Text className={styles.eventBy}>
                      <Text className={styles.eventInfoType}>By:</Text> @
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
  eventInfoType: 'font-bold text-xl text-yellow-200',
  eventName: 'text-white font-bold text-xl',
  eventAddress: 'text-white mt-2',
  eventDate: 'text-white mt-2',
  eventTime: 'text-white mt-2',
  eventBy: 'text-gray-500 mt-2',
};
