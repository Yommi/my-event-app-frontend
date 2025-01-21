import { Tabs } from 'expo-router';
import { useRef } from 'react';
import { useNavigation } from 'expo-router';
import { SafeAreaView, View } from 'react-native';
import MySearchBar from '@/components/ui/MySearchBar';
import TabButton from '../TabButton';

export default function MyEvents() {
  const currentTab = useRef('CreatedList');
  return (
    <SafeAreaView className="flex-1">
      <MySearchBar currentTab={currentTab} />
      <Tabs
        screenOptions={{
          tabBarPosition: 'top',
          tabBarIconStyle: { display: 'none' },
          tabBarStyle: {
            height: 40,
            paddingTop: 5,
            backgroundColor: 'transparent',
            borderBlockColor: 'transparent',
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
            tabBarButton: () => (
              <TabButton tab={'CreatedList'} currentTab={currentTab} />
            ),
          }}
        />
        <Tabs.Screen
          name="RegList"
          options={{
            title: 'Registered',
            headerShown: false,
            tabBarPosition: 'top',
            tabBarButton: () => (
              <TabButton tab={'RegList'} currentTab={currentTab} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
