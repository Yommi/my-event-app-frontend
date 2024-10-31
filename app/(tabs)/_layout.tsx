import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function () {
  const size = 25;

  return (
    <Tabs>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={size} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(find)"
        options={{
          title: 'Find',
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="find" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(myEvents)"
        options={{
          title: 'My Events',
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="user-check" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(create)"
        options={{
          title: 'Create Event',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
