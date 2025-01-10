import React, { useState } from 'react';
import { View, Text } from 'react-native';

interface AnimatedTabBar2Props {
  myActiveTab: 'created' | 'registered';
  setMyActiveTab: (tab: 'created' | 'registered') => void;
}
export default function AnimatedTabBar2() {
    const [myActiveTab, setMyActiveTab] = useState<'created' | 'registered'>('created');
  return (
    <View className="flex-row justify-around items-center h-16 w-[95%] mx-auto rounded-lg mb-2 overflow-hidden">
      {/* Created Tab */}
      <View
        className="flex-1 justify-center items-center py-4"
        onTouchStart={() => setMyActiveTab('created')}
      >
        <Text className={`text-white text-lg ${myActiveTab === 'created' ? 'font-bold' : ''}`}>
          Created
        </Text>
        {myActiveTab === 'created' && <View className="w-full h-1 bg-purple-500 mt-2" />}
      </View>

      {/* registered Tab */}
      <View
        className="flex-1 justify-center items-center py-4"
        onTouchStart={() => setMyActiveTab('registered')}
      >
        <Text className={`text-white text-lg ${myActiveTab === 'registered' ? 'font-bold' : ''}`}>
          Registered
        </Text>
        {myActiveTab === 'registered' && <View className="w-full h-1 bg-purple-500 mt-2" />}
      </View>
    </View> 
  );
};

