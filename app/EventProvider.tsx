import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';

export interface Event {
  _id: any;
  name: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  date: string;
  tags: [string];
  distance: number;
  price: number;
  currency: string;
  startTime: string;
  private: boolean;
  displayCover: string;
  displayVideo: string;
  host: {
    username: string;
  };
  hostDetails: {
    username: string;
  };
  registeredUsers: [any];
}

export interface EventContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  mapEvents: Event[];
  pageRef: any;
  userLocation: any;
  regionRef: any;
  loading: boolean;
  mapLoading: boolean;
  setMapLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLoading: boolean;
  setSelectedLoading: React.Dispatch<React.SetStateAction<boolean>>;
  eventPageLoading: boolean;
  isFetchingMore: boolean;
  fetchingMoreRef: any;
  noMoreEventsRef: any;
  refreshLoading: boolean;
  error: boolean;
  getLocation: any;
  fetchListData: (query?: string) => Promise<void>;
  fetchMapData: () => Promise<void>;
  fetchMoreEvents: (query?: string) => Promise<void>;
  refreshData: () => Promise<void>;
  getSelectedEvent: () => Promise<void>;
  refreshEventPage: () => Promise<void>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  selectedEvent: Event | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  isEventPageRefreshed: boolean;
  setIsEventPageRefreshed: React.Dispatch<React.SetStateAction<boolean>>;
  registerLoading: boolean;
  setRegisterLoading: React.Dispatch<React.SetStateAction<boolean>>;
  unregisterLoading: boolean;
  setUnRegisterLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ExtraConfig {
  API_URL: string;
}

export const EventContext = createContext<EventContextType | undefined>(
  undefined,
);

// Extract the extra config using type assertion
export const extra = Constants.expoConfig?.extra as ExtraConfig;

// Check if the extra object is available
if (!extra) {
  throw new Error('API_URL is not defined in extra config.');
}

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [userLocation, setuserLocation] = useState<any>(null);
  const [mapEvents, setMapEvents] = useState<Event[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [selectedLoading, setSelectedLoading] = useState<boolean>(true);
  const [eventPageLoading, setEventPageLoading] = useState<boolean>(false);
  const [mapError, setMapError] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventPageRefreshed, setIsEventPageRefreshed] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [unregisterLoading, setUnRegisterLoading] = useState(false);

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
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      // Get the user's current location
      const userLocation = await Location.getCurrentPositionAsync({});
      const coords = userLocation.coords;
      setuserLocation(coords);
      return coords;
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const fetchListData = async (query: string = '') => {
    try {
      setLoading(true);

      const location = userLocation || (await getLocation()); // Use state or fetch fresh
      const { latitude, longitude } = location;
      const token = await SecureStore.getItemAsync('userToken');
      const events = await axios.get(
        `${extra.API_URL}/events/eventsByLocation?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Merge nearby and outside events
      setEvents(events.data.data);
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshLoading(false);
      noMoreEventsRef.current = false;
    }
  };

  const fetchMapData = async (query: string = '') => {
    try {
      setMapLoading(true);
      const location = userLocation || (await getLocation()); // Use state or fetch fresh
      const { latitude, longitude } = location;
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(
        `${extra.API_URL}/events/eventsByLocation?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}&noLimit=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
      const location = userLocation || (await getLocation());
      const { latitude, longitude } = location;
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(
        `${extra.API_URL}/events/eventsByLocation?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}&page=${pageRef.current}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const newEvents = response.data.data;
      if (newEvents.length === 0) {
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
    noMoreEventsRef.current = false;
    await fetchListData();
    await fetchMapData();
  };

  const getSelectedEvent = async () => {
    try {
      setSelectedLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(
        `${extra.API_URL}/events/${selectedEvent?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      let event = response.data.data;
      event.distance = selectedEvent?.distance;
      setSelectedEvent(event);
    } catch (err) {
      console.log(err);
    } finally {
      setSelectedLoading(false);
    }
  };

  const refreshEventPage = async () => {
    try {
      setEventPageLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(
        `${extra.API_URL}/events/${selectedEvent?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const event = response.data.data;
      event.distance = selectedEvent?.distance;
      setSelectedEvent(event);
    } catch (err) {
      console.log(err);
    } finally {
      setEventPageLoading(false);
      setIsEventPageRefreshed((prev) => !prev);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        mapEvents,
        pageRef,
        userLocation,
        regionRef,
        loading,
        mapLoading,
        setMapLoading,
        selectedLoading,
        setSelectedLoading,
        eventPageLoading,
        isFetchingMore,
        fetchingMoreRef,
        noMoreEventsRef,
        refreshLoading,
        error,
        getLocation,
        fetchListData,
        fetchMapData,
        fetchMoreEvents,
        refreshData,
        getSelectedEvent,
        refreshEventPage,
        searchText,
        setSearchText,
        selectedEvent,
        setSelectedEvent,
        isEventPageRefreshed,
        setIsEventPageRefreshed,
        registerLoading,
        setRegisterLoading,
        unregisterLoading,
        setUnRegisterLoading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
