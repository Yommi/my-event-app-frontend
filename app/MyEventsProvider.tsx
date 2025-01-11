import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import axios from 'axios';
import { extra } from './EventProvider';
import * as SecureStore from 'expo-secure-store';
import { EventContext } from './EventProvider';

export interface MyEventsType {
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

interface MyEventsContextType {
  createdEvents: MyEventsType[];
  loadingCreated: boolean;
  CreatedErrorMessage: string;
  createdPageRef: any;
  fetchingMoreCreatedRef: any;
  noMoreCreatedEventsRef: any;
  isFetchingMoreCreated: boolean;
  createdRefreshLoading: boolean;
  fetchCreated: () => Promise<void>;
  fetchMoreCreated: () => Promise<void>;
  refreshCreated: () => Promise<void>;
}

// Create the context with a default value of undefined
export const MyEventsContext = createContext<
  MyEventsContextType | undefined
>(undefined);

export const MyEventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userLocation, getLocation } = useContext(EventContext)!;

  const [createdEvents, setCreatedEvents] = useState<MyEventsType[]>([]);
  const [loadingCreated, setLoadingCreated] = useState<boolean>(false);
  const [createdRefreshLoading, setCreatedRefreshLoading] =
    useState<boolean>(false);
  const [CreatedErrorMessage, setCreatedErrorMessage] =
    useState<string>('');
  const [isFetchingMoreCreated, setIsFetchingMoreCreated] =
    useState<boolean>(true);

  const createdPageRef = useRef(1);
  const fetchingMoreCreatedRef = useRef<boolean>(false);
  const noMoreCreatedEventsRef = useRef<boolean>(false);

  useEffect(() => {
    fetchCreated();
  }, []);

  const fetchCreated = async () => {
    setLoadingCreated(true);
    try {
      const location = userLocation || (await getLocation());
      const { latitude, longitude } = location;
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`${extra.API_URL}/events/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCreatedEvents(response.data.data);
    } catch (err: any) {
      setCreatedErrorMessage(err.message || 'An error occurred');
      console.error(err.message);
    } finally {
      setCreatedRefreshLoading(false);
      setLoadingCreated(false);
    }
  };

  const fetchMoreCreated = async () => {
    if (fetchingMoreCreatedRef.current || noMoreCreatedEventsRef.current)
      return;
    try {
      setIsFetchingMoreCreated(true);
      fetchingMoreCreatedRef.current = true;
      createdPageRef.current += 1;
      const location = userLocation || (await getLocation());
      const { latitude, longitude } = location;
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(
        `${extra.API_URL}/events/user/me?lat=${latitude}&lng=${longitude}&page=${createdPageRef.current}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const newEvents = response.data.data;
      if (newEvents.length === 0) {
        noMoreCreatedEventsRef.current = true; // No more events available
        createdPageRef.current -= 1;
      } else {
        setCreatedEvents((prevEvents) => [...prevEvents, ...newEvents]);
      }
    } catch (err) {
      console.error('Failed to fetch more events', err);
    } finally {
      setIsFetchingMoreCreated(false);
      fetchingMoreCreatedRef.current = false;
    }
  };

  const refreshCreated = async () => {
    setCreatedRefreshLoading(true);
    createdPageRef.current = 1;
    noMoreCreatedEventsRef.current = false;
    await fetchCreated();
  };

  return (
    <MyEventsContext.Provider
      value={{
        createdEvents,
        loadingCreated,
        createdRefreshLoading,
        CreatedErrorMessage,
        fetchCreated,
        fetchMoreCreated,
        refreshCreated,
        createdPageRef,
        fetchingMoreCreatedRef,
        noMoreCreatedEventsRef,
        isFetchingMoreCreated,
      }}
    >
      {children}
    </MyEventsContext.Provider>
  );
};

export default MyEventsProvider;
