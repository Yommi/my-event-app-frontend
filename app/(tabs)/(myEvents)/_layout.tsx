import { Stack } from 'expo-router';

export default function ComponentName() {
  return (
    <Stack>
      <Stack.Screen name="Index" options={{ headerShown: false }} />
    </Stack>
  );
}
