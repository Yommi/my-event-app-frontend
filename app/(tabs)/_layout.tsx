import { Tabs } from 'expo-router';

export default function () {
  return (
    <Tabs>
      <Tabs.Screen name="(find)" options={{ title: 'Find', headerShown: false }} />
      <Tabs.Screen name="(map)" options={{ title: 'Map', headerShown: false }} />
      <Tabs.Screen name="(registered)" options={{ title: 'Registered', headerShown: false }} />
      <Tabs.Screen name="(settings)" options={{ title: 'Settings', headerShown: false }} />
    </Tabs>
  );
}
