import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export interface Event {
  name: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  date: string;
  distance: number;
  price: number;
  currency: string;
  startTime: string;
  private: boolean;
  displayCover: string;
  host: {
    username: string;
  };
  hostDetails: {
    username: string;
  };
}

export interface EventContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  mapEvents: Event[];
  mapLocation: any;
  setMapLocation: React.Dispatch<React.SetStateAction<any>>;
  region: any;
  setRegion: React.Dispatch<React.SetStateAction<any>>;
  cachedRegion: any;
  setCachedRegion: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  mapLoading: boolean;
  setMapLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isFetchingMore: boolean;
  setIsFetchingMore: React.Dispatch<React.SetStateAction<boolean>>;
  refreshLoading: boolean;
  error: boolean;
  refreshData: () => Promise<void>;
  fetchListData: (query?: string) => Promise<void>;
  fetchMapData: () => Promise<void>;
  fetchMoreEvents: (query?: string) => Promise<void>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  selectedEvent: Event | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
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
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [noMoreEvents, setNoMoreEvents] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [listLocation, setListLocation] = useState<any>(null);
  const [mapEvents, setMapEvents] = useState<Event[]>([]);
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState(false);
  const [cachedRegion, setCachedRegion] = useState<any>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetchListData();
    // fetchMapData();
  }, []);

  useEffect(() => {}, [page]);

  const pageRef = useRef(1);

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
      setListLocation(coords);
      return coords;
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const fetchListData = async (query: string = '') => {
    try {
      setLoading(true);

      const location = listLocation || (await getLocation()); // Use state or fetch fresh
      const { latitude, longitude } = location;

      const events = await axios.get(
        `${extra.API_URL}/events/eventsByLocation?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}`,
      );

      // Merge nearby and outside events
      setEvents(events.data.data);
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  const fetchMapData = async () => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const queryParams = `lat=${latitude}&lng=${longitude}&latDelta=${latitudeDelta}&lngDelta=${longitudeDelta}`;
    try {
      // setMapLoading(true);
      const response = await axios.get(`${extra.API_URL}/events/eventsByRegion?${queryParams}`);
      const events = response.data.data;
      mapEvents.push(...events);
      setCachedRegion((prev: any) => ({
        latitude: prev ? (prev.latitude + latitude) / 2 : latitude,
        longitude: prev ? (prev.longitude + longitude) / 2 : longitude,
        latitudeDelta: prev ? Math.max(prev.latitudeDelta, latitudeDelta) : latitudeDelta,
        longitudeDelta: prev ? Math.max(prev.longitudeDelta, longitudeDelta) : longitudeDelta,
      }));
    } catch (err) {
      setMapError(true);
      console.error('Error fetching events:', err);
    } finally {
      setMapLoading(false);
    }
  };

  const fetchMoreEvents = async (query: string = searchText) => {
    if (isFetchingMore || noMoreEvents) return;
    setIsFetchingMore(true);
    try {
      pageRef.current += 1;
      const location = listLocation || (await getLocation());
      const { latitude, longitude } = location;

      const response = await axios.get(
        `${extra.API_URL}/events/eventsByLocation?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}&page=${pageRef.current}`,
      );
      const newEvents = response.data.data;
      if (newEvents.length === 0) {
        setNoMoreEvents(true); // No more events available
      } else {
        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      }
    } catch (error) {
      console.error('Failed to fetch more events', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const refreshData = async () => {
    setRefreshLoading(true);
    setSearchText('');
    pageRef.current = 1;
    setNoMoreEvents(false);
    await fetchListData();
    await fetchMapData();
  };

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        mapEvents,
        mapLocation,
        setMapLocation,
        region,
        setRegion,
        cachedRegion,
        setCachedRegion,
        loading,
        mapLoading,
        setMapLoading,
        isFetchingMore,
        setIsFetchingMore,
        refreshLoading,
        error,
        refreshData,
        fetchListData,
        fetchMapData,
        fetchMoreEvents,
        searchText,
        setSearchText,
        selectedEvent,
        setSelectedEvent,
        page,
        setPage,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
