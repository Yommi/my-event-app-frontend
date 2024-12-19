import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { extra } from './EventProvider';

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
      if (token) {
        try {
          const response = await axios.get(`${extra.API_URL}/auth/checkToken`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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
    };

    checkToken();
  }, [router]); // The dependency array ensures that the effect is run when the component mounts

  return null; // This component doesn't need to render anything itself
}
