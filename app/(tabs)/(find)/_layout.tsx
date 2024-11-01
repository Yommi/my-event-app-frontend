import { Stack } from 'expo-router';

export default function ComponentName() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
