import { useState, useContext, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EventContext } from '../../EventProvider';
import Constants from 'expo-constants';

export default function EventPage() {
  const { selectedEvent, getSelectedEvent, selectedLoading, refreshEventPage, eventPageLoading } =
    useContext(EventContext)!;
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
    getSelectedEvent();
  }, []);
  // Extract the extra config using type assertion
  const extra = Constants.expoConfig?.extra as ExtraConfig;

  // Check if the extra object is available
  if (!extra) {
    throw new Error('API_URL is not defined in extra config.');
  }

  if (selectedLoading) {
    return (
      <SafeAreaView className=" flex-1 bg-[#191827]">
        <ActivityIndicator className={'m-auto'} size="large" color="white" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-[#191827]">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={eventPageLoading} onRefresh={refreshEventPage} />
        }
        className="mt-2 h-full"
      >
        {selectedEvent ? (
          <View className="mb-8">
            <View style={{ height: height * 0.3 }}>
              <ImageBackground
                source={{ uri: `${extra.API_URL}/images/${selectedEvent?.displayCover}` }}
                resizeMode="cover"
                style={{ flex: 1 }}
              />
            </View>
            <Text className={styles.header}>Description</Text>
            <Text className="mt-4 text-center text-white leading-normal px-1">
              {selectedEvent.description}
            </Text>
            {selectedEvent.tags.length > 0 ? (
              <>
                <Text className={styles.header}>Tags</Text>
                <View style={{ maxWidth: width * 0.9 }} className={styles.tagsContainer}>
                  {selectedEvent.tags.map((tag, index) => (
                    <View key={index} className={styles.tagContainer}>
                      <Text className="text-white">{tag}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-xl text-center">Event doesnt exist</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {
  header: 'mx-auto mt-4 text-white text-2xl font-bold underline',
  tagsContainer: 'mt-4 mx-auto flex-row justify-center flex-wrap gap-x-4 gap-y-4',
  tagContainer: 'p-3 bg-purple-500 rounded-2xl',
};
