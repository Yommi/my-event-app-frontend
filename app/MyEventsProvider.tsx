import React, { createContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { extra } from './EventProvider';
import * as SecureStore from 'expo-secure-store';


export interface MyEventsType{
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
  fetchCreated: () => Promise<void>;
}

// Create the context with a default value of undefined
export const MyEventsContext = createContext<MyEventsContextType | undefined>(undefined);

interface MyEventsProviderProps {
  children: ReactNode;
}

export const MyEventsProvider: React.FC<MyEventsProviderProps> = ({ children }) => {
  const [createdEvents, setCreatedEvents] = useState<MyEventsType[]>([]); // Replace `any` with the actual type of your event data
  const [loadingCreated, setLoadingCreated] = useState<boolean>(false);
  const [CreatedErrorMessage, setCreatedErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchCreated();
  }, []);

  const fetchCreated = async () => {
    setLoadingCreated(true);
    try {
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
      setLoadingCreated(false);
    }
  };

  return (
    <MyEventsContext.Provider
      value={{
        createdEvents,
        loadingCreated,
        CreatedErrorMessage,
        fetchCreated,
      }}
    >
      {children}
    </MyEventsContext.Provider>
  );
};

export default MyEventsProvider;;
