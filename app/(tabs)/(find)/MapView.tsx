import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export default function MapViewComponent() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text className="text-white text-lg">Map View Coming Soon</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
