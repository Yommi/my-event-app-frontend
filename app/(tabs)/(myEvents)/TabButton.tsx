import { TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabButton({ tab, currentTab }: any) {
  const router = useRouter();
  const handlePress = () => {
    if (currentTab.current !== tab) {
      if (tab === 'CreatedList') {
        router.push('/(tabs)/(myEvents)/(tabs)/CreatedList');
        currentTab.current = 'CreatedList';
      } else {
        router.push('/(tabs)/(myEvents)/(tabs)/RegList');
        currentTab.current = 'RegList';
      }
    }
  };
  return (
    <TouchableOpacity
      onPress={() => {
        handlePress();
      }}
      style={{ width: width * 0.4 }}
      className="flex-col justify-between mx-auto h-full"
    >
      <Text className="text-white text-lg text-center font-bold">
        {tab}
      </Text>
      {currentTab.current === tab ? (
        <View className="py-0.5 bg-purple-500 rounded-full"></View>
      ) : null}
    </TouchableOpacity>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {};
