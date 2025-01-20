import { Stack, Tabs } from 'expo-router';
import MyEventsProvider from '../../MyEventsProvider';
import EventProvider from '../../EventProvider';

export default function ComponentName() {
  return (
    <EventProvider>
      <MyEventsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="MyEventPage"
            options={{
              headerBackTitle: 'Back',
              headerTitle: '',
              headerTransparent: true,
            }}
          />
        </Stack>
      </MyEventsProvider>
    </EventProvider>
  );
}
