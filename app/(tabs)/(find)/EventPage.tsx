import { useState, useContext, useEffect } from 'react';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EventContext, extra } from '../../EventProvider';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';

export default function EventPage() {
  const {
    selectedEvent,
    getSelectedEvent,
    selectedLoading,
    refreshEventPage,
    eventPageLoading,
    isEventPageRefreshed,
    registerLoading,
    setRegisterLoading,
  } = useContext(EventContext)!;
  const navigation = useNavigation();

  const [registerState, setRegisterState] = useState(false);
  const [checkingRegister, setCheckingRegister] = useState(true);

  // Check if the extra object is available
  if (!extra) {
    throw new Error('API_URL is not defined in extra config.');
  }

  const image = `${extra.API_URL}/images/${selectedEvent?.displayCover}`;
  const video = selectedEvent?.displayVideo
    ? `${extra.API_URL}/videos/${selectedEvent?.displayVideo}`
    : null;
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    // Set the headerTitle dynamically when the screen is focused
    navigation.setOptions({
      headerTitle: `${selectedEvent?.name}`,
    });
    getSelectedEvent();
  }, []);

  useEffect(() => {
    const checkIfRegistered = async () => {
      try {
        setCheckingRegister(true);
        const token = await SecureStore.getItemAsync('userToken');
        const response = await axios.get(
          `${extra.API_URL}/events/checkRegistered?event=${selectedEvent?._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setRegisterState(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setCheckingRegister(false);
      }
    };
    checkIfRegistered();
  }, [isEventPageRefreshed]);

  const register = async () => {
    try {
      setRegisterLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.patch(
        `${extra.API_URL}/events/register?event=${selectedEvent?._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.log(err);
    } finally {
      refreshEventPage();
    }
  };

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
        showsVerticalScrollIndicator={false}
        className="mt-2 h-full"
      >
        {selectedEvent ? (
          <View className="mb-8">
            <View id="media-container" style={{ height: height * 0.28 }}>
              {!selectedEvent.displayVideo ? (
                <ImageBackground source={{ uri: image }} resizeMode="cover" style={{ flex: 1 }} />
              ) : (
                <VideoView
                  style={styles2.video}
                  player={player}
                  allowsFullscreen
                  contentFit="cover"
                />
              )}
            </View>
            <Text className={styles.header}>Description</Text>
            <Text className="mt-4 text-center text-white leading-normal px-1">
              {selectedEvent.description}
            </Text>
            {selectedEvent.tags.length > 0 ? (
              <View style={{ maxWidth: width * 0.9 }} className={styles.tagsContainer}>
                {selectedEvent.tags.map((tag, index) => (
                  <View key={index} className={styles.tagContainer}>
                    <Text className="text-white font-medium">{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            <View className={styles.otherEventInfoCont}>
              <Text className={styles.infoValue}>
                <Text className={styles.otherEventInfoType}>Distance: </Text>
                {Math.round(selectedEvent.distance / 1000)} Km
              </Text>
              <Text className={styles.infoValue}>
                <Text className={styles.otherEventInfoType}>Price: </Text>
                {selectedEvent.currency ? selectedEvent.currency.toUpperCase() : ''}{' '}
                {selectedEvent.price ? selectedEvent.price.toFixed(2).toLocaleString() : 'Free'}
              </Text>
              <Text className="text-gray-500 text-lg mt-2">
                <Text className={styles.otherEventInfoType}>By: </Text>@
                {selectedEvent.host.username}
              </Text>
            </View>
            {checkingRegister ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <View>
                {registerState ? (
                  <Text className="text-gray-500 underline mb-4 text-right mr-4">Unregister?</Text>
                ) : null}
                {!registerState ? (
                  <TouchableOpacity
                    className={styles.buttons}
                    onPress={() => {
                      register();
                    }}
                  >
                    {registerLoading ? (
                      <ActivityIndicator size="small" color="white" className="text-2xl" />
                    ) : (
                      <View className="flex-row">
                        <Text className={styles.buttonText}>Register</Text>

                        <Feather
                          name="check-circle"
                          size={24}
                          color="white"
                          className={styles.buttonIcon}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className={styles.buttons}
                    onPress={() => {
                      register();
                    }}
                  >
                    <Text className={styles.buttonText}>Chat Room</Text>

                    <Entypo name="typing" size={24} color="white" className={styles.buttonIcon} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity className={styles.buttons}>
                  <Text className={styles.buttonText}>Get Directions</Text>
                  <Entypo name="direction" size={24} color="white" className={styles.buttonIcon} />
                </TouchableOpacity>
              </View>
            )}
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
  header: 'mx-auto mt-4 text-yellow-300 text-2xl font-bold underline',
  tagsContainer: 'mt-6 mx-auto flex-row justify-center flex-wrap gap-x-4 gap-y-4',
  tagContainer: 'p-3 bg-[#312f4d]  rounded-2xl',
  otherEventInfoCont: 'p-4 mt-2',
  otherEventInfoType: 'font-bold text-xl text-yellow-300',
  infoValue: 'text-white text-lg mt-2',
  buttons: ' flex-row justify-center align-center p-3 mx-4 my-3 bg-purple-700 rounded-3xl',
  buttonText: 'text-white text-2xl font-bold',
  buttonIcon: 'my-auto ml-2',
};

const styles2 = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    padding: 10,
  },
});
