import React from 'react';
import { View, Text } from 'react-native';

interface AnimatedTabBarProps {
  activeTab: 'card' | 'map';
  setActiveTab: (tab: 'card' | 'map') => void;
}
const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <View className="flex-row justify-around items-center h-16 w-[95%] mx-auto rounded-lg mb-2 overflow-hidden">
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
    </View>
  );
};

export default AnimatedTabBar;
