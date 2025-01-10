import { Stack } from 'expo-router';
import MyEventsProvider from '../../MyEventsProvider';

export default function ComponentName() {
  return (
    <MyEventsProvider>
    <Stack>
      <Stack.Screen name="MyEvents" options={{ headerShown: false }} />
    </Stack>
    </MyEventsProvider>
  );
}
