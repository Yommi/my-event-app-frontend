import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { extra } from './EventProvider';
import { View, ImageBackground, Text, SafeAreaView } from 'react-native';

export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    const checkToken = async () => {
      // await SecureStore.setItemAsync('userToken', '');
      const token = await SecureStore.getItemAsync('userToken');
      setTimeout(async () => {
        if (token) {
          try {
            const response = await axios.get(
              `${extra.API_URL}/auth/checkToken`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            if (response.data.status === 'success') {
              router.push('/(tabs)/(find)');
            } else {
              router.push('/(auth)/login');
            }
          } catch (err) {
            console.log(err);
            router.push('/(auth)/login');
          }
        } else {
          router.push('/(auth)/login');
        }
      }, 5000);
    };

    checkToken();
  }, [router]); // The dependency array ensures that the effect is run when the component mounts

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={{ uri: `${extra.API_URL}/images/logo.jpg` }}
        resizeMode="cover"
        className="m-auto p-20"
      ></ImageBackground>
    </SafeAreaView>
  );
}
