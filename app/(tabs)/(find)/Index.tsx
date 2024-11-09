import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LogoAndSearchBar from './LogoAndSearchBar';
import EventList from './EventsList';
import MapView from './MapView';
import { EventProvider } from './EventProvider';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'card' | 'map'>('card');

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 px-2">
        <EventProvider>
          <LogoAndSearchBar />

          {/* Animated Tab Bar */}
          <Animated.View className="flex-row justify-around items-center h-16 w-[95%] mx-auto rounded-lg mb-2 overflow-hidden">
            {/* Card View Tab */}
            <View
              className="flex-1 justify-center items-center py-4"
              onTouchStart={() => setActiveTab('card')}
            >
              <Text className={`text-white text-lg ${activeTab === 'card' ? 'font-bold' : ''}`}>
                Card View
              </Text>
              {activeTab === 'card' && <View className="w-full h-1 bg-purple-500 mt-2" />}
            </View>

            {/* Map View Tab */}
            <View
              className="flex-1 justify-center items-center py-4"
              onTouchStart={() => setActiveTab('map')}
            >
              <Text className={`text-white text-lg ${activeTab === 'map' ? 'font-bold' : ''}`}>
                Map View
              </Text>
              {activeTab === 'map' && <View className="w-full h-1 bg-purple-500 mt-2" />}
            </View>
          </Animated.View>

          {/* Conditionally Render EventList or MapView */}
          {activeTab === 'card' ? (
            <EventList />
          ) : (
            <MapView /> // Implement MapViewComponent separately
          )}
        </EventProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
