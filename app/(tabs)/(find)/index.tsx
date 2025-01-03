import React, { useState, useRef } from 'react';
import { SafeAreaView, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LogoAndSearchBar from './LogoAndSearchBar';
import EventList from './EventsList';
import MapView from './MapView';
import AnimatedTabBar from './AnimatedTabBar';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'card' | 'map'>('card');

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 px-2">
        <LogoAndSearchBar activeTab={activeTab} />
        <AnimatedTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <View style={{ display: activeTab === 'card' ? 'flex' : 'none', flex: 1 }}>
          <EventList />
        </View>
        <View style={{ display: activeTab === 'map' ? 'flex' : 'none', flex: 1 }}>
          <MapView />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
