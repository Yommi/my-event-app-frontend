import { Stack, Tabs } from 'expo-router';
import MySearchBar from '@/components/ui/MySearchBar';
import { Text, SafeAreaView, View } from 'react-native';
import { useState } from 'react';

export default function MyEvents() {
  const [currentTab, setCurrentTab] = useState<any>('CreatedList');
  return (
    <SafeAreaView className="flex-1">
      <MySearchBar currentTab={currentTab} />
      <Tabs
        screenListeners={{
          tabPress: (e) => {
            setCurrentTab(e.target?.split('-')[0]);
          },
        }}
        screenOptions={{
          tabBarPosition: 'top',
          tabBarIconStyle: { display: 'none' },
          tabBarStyle: {
            height: 40,
            paddingTop: 5,
            backgroundColor: 'transparent',
            borderBottomWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 16,
          },
        }}
      >
        <Tabs.Screen
          name="CreatedList"
          options={{
            title: 'Created',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="RegList"
          options={{
            title: 'Registered',
            headerShown: false,
            tabBarPosition: 'top',
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
