import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';

interface Event {
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

interface EventContextType {
  nearbyEvents: Event[];
  outsideEvents: Event[];
  loading: boolean;
  refreshLoading: boolean;
  error: boolean;
  refreshData: () => Promise<void>;
  fetchData: () => Promise<void>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
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
  const [refreshLoading, setRefreshLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [outsideEvents, setOutsideEvents] = useState<Event[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const fetchData = async (query: string = ''): Promise<void> => {
    try {
      const nearbyResponse = await axios.get(
        `${extra.API_URL}/events/nearby?lat=33.9363830311417&lng=-84.82550970170777${query ? `&query=${query}` : ''}`,
      );
      const outsideResponse = await axios.get(
        `${extra.API_URL}/events/far?lat=33.9363830311417&lng=-84.82550970170777${query ? `&query=${query}` : ''}`,
      );

      // fetch logo

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

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    setRefreshLoading(true);
    setSearchText('');
    await fetchData();
  };

  return (
    <EventContext.Provider
      value={{
        nearbyEvents,
        // setNearbyEvents,
        outsideEvents,
        // setOutsideEvents,
        loading,
        refreshLoading,
        error,
        refreshData,
        fetchData,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
