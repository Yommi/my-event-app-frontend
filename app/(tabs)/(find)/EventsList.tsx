import { Text, View, Dimensions } from 'react-native';

export default function EventList() {
  const { width, height } = Dimensions.get('window');

  return (
    <View>
      <View className={styles.eventGroupCont}>
        <Text className={styles.eventGroupTitle}> (Event Group)</Text>
        <View className={styles.eventGroupLine}></View>
      </View>
      <View className={styles.eventCont}>
        <View className={styles.eventCover}></View>
        <View className={styles.eventInfoCont}></View>
      </View>
    </View>
  );
}

const styles = {
  eventGroupCont: 'mt-6',
  eventGroupTitle: 'text-white text-lg font-bold mx-auto',
  eventGroupLine: 'w-full h-[5%] bg-gray-500',
  eventCont: ' flex-row justify-between mt-4 bg-[#191827] rounded-2xl w-full',
  eventCover: 'p-[15%] bg-white rounded-2xl my-auto',
  eventInfoCont: 'bg-red-500',
};
