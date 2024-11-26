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
  host: {
    username: string;
  };
}

interface EventContextType {
  nearbyEvents: Event[];
  outsideEvents: Event[];
  loading: boolean;
  error: boolean;
  refreshData: () => Promise<void>;
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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [outsideEvents, setOutsideEvents] = useState<Event[]>([]);

  const fetchData = async () => {
    try {
      const nearbyResponse = await axios.get(
        `${extra.API_URL}/events/nearby?lat=-84.82550970170777&lng=33.9363830311417`
      );
      const outsideResponse = await axios.get(
        `${extra.API_URL}/events/far?lat=-84.82550970170777&lng=33.9363830311417`
      );

      // Merge nearby and outside events
      setNearbyEvents(nearbyResponse.data.data);
      setOutsideEvents(outsideResponse.data.data);
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    await fetchData();
  };

  return (
    <EventContext.Provider value={{ nearbyEvents, outsideEvents, loading, error, refreshData }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
