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
  createdErrorMessage: string;
  createdPageRef: any;
  fetchingMoreCreatedRef: any;
  noMoreCreatedEventsRef: any;
  isFetchingMoreCreated: boolean;
  createdRefreshLoading: boolean;
  fetchCreated: (query?: string) => Promise<void>;
  fetchMoreCreated: (query?: string) => Promise<void>;
  refreshCreated: () => Promise<void>;
  mySearchText: string;
  setMySearchText: React.Dispatch<React.SetStateAction<string>>;
  regEvents: MyEventsType[];
  fetchRegList: (query?: string) => Promise<void>;
  loadingReg: boolean;
  regRefreshLoading: boolean;
  fetchMoreReg: (query?: string) => Promise<void>;
  refreshReg: () => Promise<void>;
  isFetchingMoreReg: boolean;
  regPageRef: any;
  regErrorMessage: string;
}

// Create the context with a default value of undefined
export const MyEventsContext = createContext<
  MyEventsContextType | undefined
>(undefined);

export const MyEventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userLocation, getLocation } = useContext(EventContext)!;
  // Created List
  const [createdEvents, setCreatedEvents] = useState<MyEventsType[]>([]);
  const [loadingCreated, setLoadingCreated] = useState<boolean>(false);
  const [createdRefreshLoading, setCreatedRefreshLoading] =
    useState<boolean>(false);
  const [createdErrorMessage, setCreatedErrorMessage] =
    useState<string>('');
  const [isFetchingMoreCreated, setIsFetchingMoreCreated] =
    useState<boolean>(true);
  const createdPageRef = useRef(1);
  const fetchingMoreCreatedRef = useRef<boolean>(false);
  const noMoreCreatedEventsRef = useRef<boolean>(false);

  // Registered List
  const [regEvents, setRegEvents] = useState<MyEventsType[]>([]);
  const [loadingReg, setLoadingReg] = useState<boolean>(false);
  const [regRefreshLoading, setRegRefreshLoading] =
    useState<boolean>(false);
  const [regErrorMessage, setRegErrorMessage] = useState<string>('');
  const [isFetchingMoreReg, setIsFetchingMoreReg] =
    useState<boolean>(true);
  const regPageRef = useRef(1);
  const fetchingMoreRegRef = useRef<boolean>(false);
  const noMoreRegEventsRef = useRef<boolean>(false);

  const [mySearchText, setMySearchText] = useState<string>('');

  useEffect(() => {
    fetchCreated();
  }, []);

  // CREATED LIST

  const fetchCreated = async (query: string = '') => {
    setLoadingCreated(true);
    try {
      const location = userLocation || (await getLocation());
      const { latitude, longitude } = location;
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(
        `${extra.API_URL}/events/user/me?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCreatedEvents(response.data.data);
    } catch (err: any) {
      setCreatedErrorMessage(err.message || 'An error occurred');
      console.error(err.message);
    } finally {
      setCreatedRefreshLoading(false);
      setLoadingCreated(false);
      noMoreCreatedEventsRef.current = false;
    }
  };

  const fetchMoreCreated = async (query: string = mySearchText) => {
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
        `${extra.API_URL}/events/user/me?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}&page=${createdPageRef.current}`,
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
    setMySearchText('');
    createdPageRef.current = 1;
    noMoreCreatedEventsRef.current = false;
    await fetchCreated();
  };

  // REGISTERED LIST

  const fetchRegList = async (query: string = '') => {
    setLoadingReg(true);
    try {
      const location = userLocation || (await getLocation());
      const { latitude, longitude } = location;
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(
        `${extra.API_URL}/events/registeredFor?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRegEvents(response.data.data);
    } catch (err: any) {
      setRegErrorMessage(err.message || 'An error occurred');
      console.error(err.message);
    } finally {
      setRegRefreshLoading(false);
      setLoadingReg(false);
      noMoreRegEventsRef.current = false;
    }
  };

  const fetchMoreReg = async (query: string = mySearchText) => {
    if (fetchingMoreRegRef.current || noMoreRegEventsRef.current) return;
    try {
      setIsFetchingMoreReg(true);
      fetchingMoreRegRef.current = true;
      regPageRef.current += 1;
      const location = userLocation || (await getLocation());
      const { latitude, longitude } = location;
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(
        `${extra.API_URL}/events/registeredFor?lat=${latitude}&lng=${longitude}${query ? `&query=${query}` : ''}&page=${regPageRef.current}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const newEvents = response.data.data;
      if (newEvents.length === 0) {
        noMoreRegEventsRef.current = true; // No more events available
        regPageRef.current -= 1;
      } else {
        setRegEvents((prevEvents) => [...prevEvents, ...newEvents]);
      }
    } catch (err) {
      console.error('Failed to fetch more events', err);
    } finally {
      setIsFetchingMoreReg(false);
      fetchingMoreRegRef.current = false;
    }
  };

  const refreshReg = async () => {
    setRegRefreshLoading(true);
    setMySearchText('');
    regPageRef.current = 1;
    noMoreRegEventsRef.current = false;
    await fetchRegList();
  };

  return (
    <MyEventsContext.Provider
      value={{
        createdEvents,
        loadingCreated,
        createdRefreshLoading,
        createdErrorMessage,
        fetchCreated,
        fetchMoreCreated,
        refreshCreated,
        createdPageRef,
        fetchingMoreCreatedRef,
        noMoreCreatedEventsRef,
        isFetchingMoreCreated,
        mySearchText,
        setMySearchText,
        regEvents,
        fetchRegList,
        loadingReg,
        regRefreshLoading,
        fetchMoreReg,
        refreshReg,
        isFetchingMoreReg,
        regPageRef,
        regErrorMessage,
      }}
    >
      {children}
    </MyEventsContext.Provider>
  );
};

export default MyEventsProvider;
