import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export interface Event {
  name: string;
  location: {
    address: string;
    coordinates: [number, number];
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

export interface EventContextType {
  nearbyEvents: Event[];
  outsideEvents: Event[];
  mapOutsideEvents: Event[];
  mapNearbyEvents: Event[];
  loading: boolean;
  mapLoading: boolean;
  refreshLoading: boolean;
  error: boolean;
  refreshData: () => Promise<void>;
  fetchListData: (query?: string) => Promise<void>;
  fetchMapData: () => Promise<void>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  selectedEvent: Event | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

interface ExtraConfig {
  API_URL: string;
}

// Extract the extra config using type assertion
const extra = Constants.expoConfig?.extra as ExtraConfig;

// Check if the extra object is available
if (!extra) {
  throw new Error('API_URL is not defined in extra config.');
}

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [outsideEvents, setOutsideEvents] = useState<Event[]>([]);
  const [mapNearbyEvents, setMapNearbyEvents] = useState<Event[]>([]);
  const [mapOutsideEvents, setMapOutsideEvents] = useState<Event[]>([]);
  const [yourLocation, setYourLocation] = useState<any>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
      const coords = userLocation.coords;
      setYourLocation(coords);
      return coords;
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const fetchListData = async (query: string = '') => {
    try {
      setLoading(true);

      const location = yourLocation || (await getLocation()); // Use state or fetch fresh
      const { latitude, longitude } = location;

      const nearbyResponse = await axios.get(
        `${extra.API_URL}/events/nearby?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}`,
      );
      const outsideResponse = await axios.get(
        `${extra.API_URL}/events/far?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}`,
      );

      // Merge nearby and outside events
      setNearbyEvents(nearbyResponse.data.data);
      setOutsideEvents(outsideResponse.data.data);
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  const fetchMapData = async () => {
    setMapLoading(true);

    try {
      const location = yourLocation || (await getLocation()); // Use state or fetch fresh
      const { latitude, longitude } = location;
      const nearbyResponse = await axios.get(
        `${extra.API_URL}/events/nearby?lat=${latitude}&lng=${longitude}`,
      );
      const outsideResponse = await axios.get(
        `${extra.API_URL}/events/far?lat=${latitude}&lng=${longitude}`,
      );

      // fetch logo

      // Merge nearby and outside events
      setMapNearbyEvents(nearbyResponse.data.data);
      setMapOutsideEvents(outsideResponse.data.data);
    } catch (err) {
      setMapError(true);
      console.error(err);
    } finally {
      setMapLoading(true);
    }
  };

  useEffect(() => {
    fetchListData();
    fetchMapData();
  }, []);

  const refreshData = async () => {
    setRefreshLoading(true);
    setSearchText('');
    await fetchListData();
    await fetchMapData();
  };

  return (
    <EventContext.Provider
      value={{
        nearbyEvents,
        outsideEvents,
        mapNearbyEvents,
        mapOutsideEvents,
        loading,
        mapLoading,
        refreshLoading,
        error,
        refreshData,
        fetchListData,
        fetchMapData,
        searchText,
        setSearchText,
        selectedEvent,
        setSelectedEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
