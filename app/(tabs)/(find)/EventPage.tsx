import { useContext } from 'react';
import { Text, View, SafeAreaView, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { EventContext, Event } from '../../EventProvider';
import Constants from 'expo-constants';

export default function EventPage() {
  const { selectedEvent, setSelectedEvent, nearbyEvents } = useContext(EventContext)!;
  interface ExtraConfig {
    API_URL: string;
  }
  // Extract the extra config using type assertion
  const extra = Constants.expoConfig?.extra as ExtraConfig;

  // Check if the extra object is available
  if (!extra) {
    throw new Error('API_URL is not defined in extra config.');
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {selectedEvent ? (
          <ImageBackground
            source={{ uri: `${extra.API_URL}/images/${selectedEvent.displayCover}` }}
            resizeMode="cover"
            style={{ height: height * 0.2 }}
          />
        ) : (
          <View>
            <Text>No Event Selected</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {};
