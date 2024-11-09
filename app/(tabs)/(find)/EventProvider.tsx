import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Event {
  name: string;
  location: {
    address: string;
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
  events: Event[];
  loading: boolean;
  error: boolean;
  refreshData: () => Promise<void>;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const nearbyResponse = await axios.get(
        'http://192.168.1.226:5000/api/v1/events/nearby?lat=-84.82550970170777&lng=33.9363830311417'
      );
      const outsideResponse = await axios.get(
        'http://192.168.1.226:5000/api/v1/events/far?lat=-84.82550970170777&lng=33.9363830311417'
      );

      // Merge nearby and outside events
      const combinedEvents = [...nearbyResponse.data.data, ...outsideResponse.data.data];
      setEvents(combinedEvents);
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
    <EventContext.Provider value={{ events, loading, error, refreshData }}>
      {children}
    </EventContext.Provider>
  );
};
