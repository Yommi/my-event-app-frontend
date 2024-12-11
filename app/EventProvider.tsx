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
  pageRef: any;
  regionRef: any;
  loading: boolean;
  mapLoading: boolean;
  setMapLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isFetchingMore: boolean;
  fetchingMoreRef: any;
  noMoreEventsRef: any;
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
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [listLocation, setListLocation] = useState<any>(null);
  const [mapEvents, setMapEvents] = useState<Event[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(true);
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const regionRef = useRef(null);
  const pageRef = useRef(1);
  const fetchingMoreRef = useRef<boolean>(false);
  const noMoreEventsRef = useRef<boolean>(false);

  useEffect(() => {
    fetchListData();
  }, []);

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
    try {
      setMapLoading(true);
      const response = await axios.get(`${extra.API_URL}/events/`);
      const events = response.data.data;
      setMapEvents(events);
    } catch (err) {
      setMapError(true);
      console.error('Error fetching events:', err);
    } finally {
      setMapLoading(false);
    }
  };

  const fetchMoreEvents = async (query: string = searchText) => {
    if (fetchingMoreRef.current || noMoreEventsRef.current) return;
    try {
      setIsFetchingMore(true);
      fetchingMoreRef.current = true;
      pageRef.current += 1;
      const location = listLocation || (await getLocation());
      const { latitude, longitude } = location;

      const response = await axios.get(
        `${extra.API_URL}/events/eventsByLocation?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}&page=${pageRef.current}`,
      );
      const newEvents = response.data.data;
      if (newEvents.length === 0) {
        // setNoMoreEvents(true);
        noMoreEventsRef.current = true; // No more events available
        pageRef.current -= 1;
      } else {
        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      }
    } catch (error) {
      console.error('Failed to fetch more events', error);
    } finally {
      setIsFetchingMore(false);
      fetchingMoreRef.current = false;
    }
  };

  const refreshData = async () => {
    setRefreshLoading(true);
    setSearchText('');
    pageRef.current = 1;
    // setNoMoreEvents(false);
    noMoreEventsRef.current = false;
    await fetchListData();
    await fetchMapData();
  };

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        mapEvents,
        pageRef,
        regionRef,
        loading,
        mapLoading,
        setMapLoading,
        isFetchingMore,
        fetchingMoreRef,
        noMoreEventsRef,
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
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
