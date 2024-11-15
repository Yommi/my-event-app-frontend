// import { Stack } from 'expo-router';
import Index from './index';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function ComponentName() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={Index} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
