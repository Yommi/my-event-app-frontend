import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

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

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [outsideEvents, setOutsideEvents] = useState<Event[]>([]);

  const fetchData = async () => {
    try {
      const nearbyResponse = await axios.get(
        'http://192.168.1.226:5000/api/v1/events/nearby?lat=-84.82550970170777&lng=33.9363830311417'
      );
      const outsideResponse = await axios.get(
        'http://192.168.1.226:5000/api/v1/events/far?lat=-84.82550970170777&lng=33.9363830311417'
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
