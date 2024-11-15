import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { EventContext } from './EventProvider';

export default function App() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { events } = useContext(EventContext)!;

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
        showsUserLocation={true}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {events.map((event, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: event.location.coordinates[0],
              longitude: event.location.coordinates[1],
            }}
            title={event.name}
            description={`Hosted by: ${event.host.username || 'Anonymous'}`}
          />
        ))}
      </MapView>
    </View>
  );
}
