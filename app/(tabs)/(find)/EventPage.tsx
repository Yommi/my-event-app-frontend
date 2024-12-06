import { useState, useContext, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EventContext } from '../../EventProvider';
import Constants from 'expo-constants';

export default function EventPage() {
  const { selectedEvent } = useContext(EventContext)!;
  const [imageLoading, setImageLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  interface ExtraConfig {
    API_URL: string;
  }

  const navigation = useNavigation();

  useEffect(() => {
    // Set the headerTitle dynamically when the screen is focused
    navigation.setOptions({
      headerTitle: `${selectedEvent?.name}`,
    });
  }, [navigation, selectedEvent?.name]);

  useEffect(() => {
    fetchImage();
  }, [selectedEvent]);
  // Extract the extra config using type assertion
  const extra = Constants.expoConfig?.extra as ExtraConfig;

  // Check if the extra object is available
  if (!extra) {
    throw new Error('API_URL is not defined in extra config.');
  }

  const fetchImage = () => {
    try {
      setImageLoading(true);
      const image = `${extra.API_URL}/images/${selectedEvent?.displayCover}`;
      setImage(image);
    } catch (err) {
      console.log(err);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="mt-2 bg-[#191827] h-full">
        {selectedEvent ? (
          <>
            <View style={{ height: height * 0.3 }}>
              {imageLoading || !image ? (
                <ActivityIndicator className={'m-auto'} size="large" color="white" />
              ) : (
                <ImageBackground source={{ uri: image }} resizeMode="cover" style={{ flex: 1 }} />
              )}
            </View>
            <Text className={styles.header}>Description</Text>
            <Text className="mt-4 mx-auto text-white">{selectedEvent.description}</Text>
            <Text className={styles.header}>Tags</Text>
            <View></View>
          </>
        ) : (
          <View>
            <Text>Event not Available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {
  header: 'mx-auto mt-4 text-white text-2xl font-bold underline',
};
