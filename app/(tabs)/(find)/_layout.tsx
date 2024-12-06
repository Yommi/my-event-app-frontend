import { EventProvider } from '@/app/EventProvider';
import { Stack } from 'expo-router';

export default function ComponentName() {
  return (
    <EventProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="EventPage"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Event Page',
            headerTransparent: true,
          }}
        />
      </Stack>
    </EventProvider>
  );
}
