import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View, SafeAreaView } from 'react-native';
import LogoAndSearchBar from '../../../components/ui/SearchBar';
import AnimatedTabBar2 from './AnimatedTabBar2';
import CreatedList from './CreatedList';

export default function ComponentName() {
  const [activeTab, setActiveTab] = useState<'card' | 'map'>('card');
  const route = useRoute()

  return (
    <GestureHandlerRootView className="flex-1">
    <SafeAreaView className='flex-1 px-2'>
      <LogoAndSearchBar activeTab={'card'} />
      <AnimatedTabBar2/>
      <CreatedList/>
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}
